pragma solidity ^0.5.11;

import "./Fund.sol";
import "./utils/Ownable.sol";

interface IDomainController {

    function newSubDomain(string calldata label, address endpoint, address manager) external;
    function transferDomain() external;
    function changeAsker(address _newAsker) external;

}

contract FundFactory is Ownable {

    event NewFunding(address indexed _manager, address indexed _at);
    event DomainControllerChange(address indexed _old, address indexed _new);
    event DAIChange(address indexed _old, address indexed _new);
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

    function newFunding(string memory _URI) public {
        Fund _fund = new Fund(msg.sender, _URI, daiToken, compoundToken);
        funds.push(address(_fund));
        isFund[address(_fund)] = true;

        //set subdomain name and resolve endpoint
        controller.newSubDomain(_URI, address(_fund), msg.sender);
        emit NewFunding(msg.sender, address(_fund));
    }


    function setDomainController(address _controller) public onlyOwner {
        require(_controller != address(0), 'Error: Controller invalid');

        emit DomainControllerChange(address(controller), _controller);
        controller = IDomainController(_controller);
    }

    function setDAIToken(address _newDaiToken) public onlyOwner {
        require(_newDaiToken != address(0), 'Error: DAI Address invalid');

        emit DAIChange(daiToken, _newDaiToken);
        daiToken = _newDaiToken;
    }

    function setCompoundToken(address _newCompoundToken) public onlyOwner {
        require(_newCompoundToken != address(0), 'Error: Compound Token invalid');

        emit CompoundTokenChange(compoundToken, _newCompoundToken);
        compoundToken = _newCompoundToken;
    }
}
