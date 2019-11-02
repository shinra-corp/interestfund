pragma solidity ^0.5.11;

import "./ENS.sol";
import "./ENSResolver.sol";
import "../utils/Ownable.sol";


interface IFund {

    function accruedInterest() external view returns(uint256);

}

/**
    @title Interact with ENS system.
    @dev Only account define as Asker can make a new subdomain. All subdamains are unique.
    @author axe
 */
contract DomainController is Ownable {

    address public owner;
    address public asker;
    bytes32 public rootNode;
    ENS public ens;
    ENSResolver public resolver;

    event AskerChange(address indexed newAsker);
    event NewSubDomain(address indexed manager, string label);
    event DomainReclaim(address indexed newOwner);
    event ReclaimSubDomain(address indexed reclaimer, string label, uint256 balance);


    struct Reclaim {
        uint256 startDate;
        address reclaimer;
        uint256 snapshot;
    }

    uint256 public timeout;

    mapping(bytes32 => bool) public register;

    mapping(bytes32 => Reclaim) public reclaims;

    constructor(bytes32 _rootNode, address _asker, address _ens, address _resolver,uint256 _timeoutDays ) public {
        require(_timeoutDays > 0 , 'Error: Define timeout to reclaim');
        owner = msg.sender;
        rootNode = _rootNode;
        asker = _asker;
        ens = ENS(_ens);
        resolver = ENSResolver(_resolver);
        timeout = _timeoutDays;
    }


    //@notice Submit to ENS a new subdomain of rootNode.
    //@param label name of the subdomain.
    //@param endpoint address that resolver will point.
    //@param manager address of manager that create funding.
    function newSubDomain(string calldata label, address endpoint, address manager) external onlyAsker {
        bytes32 _label = keccak256(abi.encodePacked(label));
        bytes32 _node = keccak256(abi.encodePacked(rootNode, _label));
        require(register[_node] == false, 'Error: Subdomain registry');

        //register a new sub domain
        ens.setSubnodeOwner(rootNode, _label, address(this));
        ens.setResolver(_node, address(this));

        //set resolver of subdomain
        resolver.setAddr(_node, endpoint);

        register[_node] = true;

        emit NewSubDomain(manager, label);
    }


    //@notice get rootNode ownership back.
    function transferDomain() public onlyOwner {
        ens.setOwner(rootNode, msg.sender);
        emit DomainReclaim(msg.sender);
    }


    //@notice change contract that can ask a new subdomain
    //@param _newAsker new contract that can ask for new subdomains.
    function changeAsker(address _newAsker) public onlyOwner {
        require(_newAsker != address(0), 'Error: Invalid address');
        asker = _newAsker;

        emit AskerChange(_newAsker);
    }

    //@notice Ask from a given subdomain. register claim and fund balances
    //@param label name of the subdomain.
    function askFromSubdomain(string calldata label) external {
        bytes32 _label = keccak256(abi.encodePacked(label));
        bytes32 _node = keccak256(abi.encodePacked(rootNode, _label));
        require(register[_node] == true, 'Error: Subdomain is not register');
        require(reclaims[_node].startDate == 0 , 'Error: Claim register');

        //Resolve to the Fund Wallet address
        address _fund = resolver.addr(_node);
        //Get fund interest balance to make a snapshot
        uint256 _interest = IFund(_fund).accruedInterest();
        //Create claim
        reclaims[_node] = Reclaim(block.timestamp, msg.sender, _interest);

        emit ReclaimSubDomain(msg.sender, label, _interest);
    }


    modifier onlyAsker {
        require(msg.sender == asker, 'not contract call');
        _;
    }
}
