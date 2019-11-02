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
    event ReleaseSubdomain(address indexed manager, string label);


    mapping(bytes32 => bool) public register;


    constructor(bytes32 _rootNode, address _asker, address _ens, address _resolver) public {
        owner = msg.sender;
        rootNode = _rootNode;
        asker = _asker;
        ens = ENS(_ens);
        resolver = ENSResolver(_resolver);
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

    function resolve(string calldata label) external returns(address) {
        bytes32 _label = keccak256(abi.encodePacked(label));
        bytes32 _node = keccak256(abi.encodePacked(rootNode, _label));

        return resolver.addr(_node);
    }

    function releaseSubDomain(string calldata label, address manager) external onlyAsker {
        bytes32 _label = keccak256(abi.encodePacked(label));
        bytes32 _node = keccak256(abi.encodePacked(rootNode, _label));
        require(register[_node] == true, 'Error: Subdomain registry');

        //register a new sub domain
        ens.setSubnodeOwner(rootNode, _label, address(this));
        ens.setResolver(_node, address(this));

        //set resolver of subdomain
        resolver.setAddr(_node, address(0));

        delete register[_node];

        emit ReleaseSubdomain(manager, label);

    }


    modifier onlyAsker {
        require(msg.sender == asker, 'not contract call');
        _;
    }
}
