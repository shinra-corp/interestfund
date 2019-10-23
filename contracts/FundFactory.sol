pragma solidity ^0.5.11;

import "./Fund.sol";
import "./utils/Ownable.sol";

interface IDomainController {

    function newSubDomain(string calldata label, address endpoint, address manager) external;
    function transferDomain() external;
    function changeAsker(address _newAsker) external;

}

contract FundFactory is Ownable {

    event NewFunding(address indexed manager, address indexed at);
    event DomainControllerChange(address indexed old, address indexed _new);

    address public resolver;
    address public dispatcher;
    IDomainController public controller;

    address[] public funds;
    mapping(address => bool) isFund;


    constructor(address _tokenResolver) public {
        require(_tokenResolver != address(0), 'Error: Resolver invalid');
        resolver = _tokenResolver;
    }


    function setDomainController(address _controller) public onlyOwner {
        require(_controller != address(0), 'Error: Controller invalid');

        emit DomainControllerChange(address(controller), _controller);
        controller = IDomainController(_controller);
    }


    function newFunding(string memory _URI) public {
        Fund _fund = new Fund(msg.sender, address(resolver), _URI);
        funds.push(address(_fund));
        isFund[address(_fund)] = true;

        //set subdomain name and resolver
        controller.newSubDomain(_URI, address(_fund), msg.sender);
        emit NewFunding(msg.sender, address(_fund));
    }
}
