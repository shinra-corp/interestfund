pragma solidity ^0.5.0;

import "./Fund.sol";
import "./utils/Ownable.sol";

interface IDomainController {

    function newSubDomain(string calldata label, address endpoint, address manager) external;
    function transferDomain() external;
    function changeAsker(address _newAsker) external;
}

/// @title Fund Factory Wallet
/// @notice You should interact with this contract to create a new Fund instance. Each Fund has a unique URI that will have a ENS subdomain.
contract FundFactory is Ownable {

    event NewFunding(address indexed _manager, address indexed _at);
    event DomainControllerChange(address indexed _old, address indexed _new);
    event DAITokenChange(address indexed _old, address indexed _new);
    event CompoundTokenChange(address indexed _old, address indexed _new);

    IDomainController public controller;
    address public daiToken;
    address public compoundToken;

    address[] public funds;
    mapping(address => bool) isFund;

    constructor(address _daiToken, address _compoundToken) public {
        require(_daiToken != address(0), 'Error: DAI Address invalid');
        require(_compoundToken != address(0), 'Error: Compound Token invalid');

        daiToken = _daiToken;
        compoundToken = _compoundToken;
    }


    ///@notice Create a new Fund project with a subdomain. The new Fund will have endpoint configured for you.
    ///@notice The new Fund address is saved to facilite frontend listing
    ///@param _URI Define the name of the new Fund. Must be unique.
    function newFunding(string memory _URI) public {
        Fund _fund = new Fund(msg.sender, daiToken, compoundToken);
        funds.push(address(_fund));
        isFund[address(_fund)] = true;

        //set subdomain name and resolve endpoint
        controller.newSubDomain(_URI, address(_fund), msg.sender);
        emit NewFunding(msg.sender, address(_fund));
    }


    ///@notice Define a new endpoint of the smart contract responsable to manage the issuing of new subdomains.
    ///@param _controller New Domain Controller address
    function setDomainController(address _controller) public onlyOwner {
        require(_controller != address(0), 'Error: Controller invalid');

        emit DomainControllerChange(address(controller), _controller);
        controller = IDomainController(_controller);
    }


    ///@notice Define a new DAI contract used by Fund instances.
    ///@param _newDaiToken New DAI contract address
    function setDAIToken(address _newDaiToken) public onlyOwner {
        require(_newDaiToken != address(0), 'Error: DAI Address invalid');

        emit DAITokenChange(daiToken, _newDaiToken);
        daiToken = _newDaiToken;
    }


    ///@notice Define a new Compound market contract used by Fund instances.
    ///@param _newCompoundToken New Compound Market address
    function setCompoundToken(address _newCompoundToken) public onlyOwner {
        require(_newCompoundToken != address(0), 'Error: Compound Token invalid');

        emit CompoundTokenChange(compoundToken, _newCompoundToken);
        compoundToken = _newCompoundToken;
    }
}
