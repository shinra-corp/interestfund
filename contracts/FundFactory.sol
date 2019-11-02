pragma solidity ^0.5.0;

import "./Fund.sol";
import "./utils/SafeMath.sol";
import "./utils/Ownable.sol";

interface IDomainController {

    function newSubDomain(string calldata label, address endpoint, address manager) external;
    function transferDomain() external;
    function changeAsker(address _newAsker) external;
    function resolve(string calldata label) external returns(address);
    function releaseSubDomain(string calldata label, address manager) external;
}


contract FundFactory is Ownable {

    using SafeMath for uint256;

    event NewFunding(address indexed _manager, address indexed _at);
    event DomainControllerChange(address indexed _old, address indexed _new);
    event DAITokenChange(address indexed _old, address indexed _new);
    event CompoundTokenChange(address indexed _old, address indexed _new);

    IDomainController public controller;
    address public daiToken;
    address public compoundToken;
    uint256 public _collateral;

    address[] public funds;
    mapping(address => bool) isFund;
    mapping(address => uint256) ethBalances;

    constructor(address _daiToken, address _compoundToken, uint256 _collateralWei) public {
        require(_daiToken != address(0), 'Error: DAI Address invalid');
        require(_compoundToken != address(0), 'Error: Compound Token invalid');
        require(_collateralWei > 0, 'Error: Must define a collateral');

        daiToken = _daiToken;
        compoundToken = _compoundToken;
        _collateral = _collateralWei;
    }


    function newFunding(string memory _URI) public payable {
        require(msg.value == _collateral, 'Error: Send the correct amount');

        Fund _fund = new Fund(msg.sender, daiToken, compoundToken);
        funds.push(address(_fund));
        isFund[address(_fund)] = true;

        //set subdomain name and resolve endpoint
        controller.newSubDomain(_URI, address(_fund), msg.sender);

        //save ether amount to user balance
        ethBalances[msg.sender] = ethBalances[msg.sender].add(msg.value);

        emit NewFunding(msg.sender, address(_fund));
    }

    function retrieveCollateral(string memory _URI) public {
        ethBalances[msg.sender].sub(_collateral);

        address _fund = controller.resolve(_URI);
        require(_fund != address(0), 'Error: Endpoint not valid');
        //get manager from fund and check if sender is the same
        address _manager = Fund(_fund).manager();

        require(msg.sender == _manager, 'Error: Not fund manager');

        controller.releaseSubDomain(_URI, _manager);

        msg.sender.transfer(_collateral);

    }

    function setDomainController(address _controller) public onlyOwner {
        require(_controller != address(0), 'Error: Controller invalid');

        emit DomainControllerChange(address(controller), _controller);
        controller = IDomainController(_controller);
    }

    function setDAIToken(address _newDaiToken) public onlyOwner {
        require(_newDaiToken != address(0), 'Error: DAI Address invalid');

        emit DAITokenChange(daiToken, _newDaiToken);
        daiToken = _newDaiToken;
    }

    function setCompoundToken(address _newCompoundToken) public onlyOwner {
        require(_newCompoundToken != address(0), 'Error: Compound Token invalid');

        emit CompoundTokenChange(compoundToken, _newCompoundToken);
        compoundToken = _newCompoundToken;
    }

    function() external payable {
        revert("Error: No default Function");
    }
}
