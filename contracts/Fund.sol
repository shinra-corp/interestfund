pragma solidity ^0.5.11;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./utils/ReentrancyGuard.sol";
import "./interfaces/IResolver.sol";
import "./Dispatcher.sol";

contract Fund is ReentrancyGuard {

    using SafeMath for uint256;

    event StartFunding(address indexed donor, address indexed token, uint256 amount);
    event Withdraw(address indexed donor, address indexed token, uint256 amount);
    event TopFunding(address indexed donor, address indexed token, uint256 amount);

    address public manager;
    IResolver public resolver;
    Dispatcher public dispatcher;
    string public URI;

    mapping(address => uint256) public totalBalances;
    uint256 public numberDonors;

    mapping(address => mapping(address => uint256)) public userBalances;
    mapping(address => bool) public isDonor;

    constructor(address _manager, address _resolver, string memory _URI) public {
        require(_manager != address(0), "Error: manager not valid");
        require(_resolver != address(0), "Error: resolver not valid");

        manager = _manager;
        resolver = IResolver(_resolver);
        URI = _URI;
    }


    function funding(address _token, uint256 _amount) public payable nonReentrant {
        require(msg.value == 0 || msg.value == _amount, "Error: define amount");
        address _endpoint = resolver.resolveToken(_token);
        require(_endpoint != address(0), 'Error: Compound endpoint not register');

        Dispatcher.openFunding(msg.sender, _token, _endpoint, _amount);
        isDonor[msg.sender] = true;
        totalBalances[_token] = totalBalances[_token].add(_amount);
        userBalances[msg.sender][_token] = userBalances[msg.sender][_token].add(_amount);
        numberDonors = numberDonors.add(1);

        emit StartFunding(msg.sender, _token, _amount);
    }


    function withdraw(address _token, uint256 _amount) public nonReentrant {
        require(userBalances[msg.sender][_token] > _amount, 'Error: not enough balance');
        userBalances[msg.sender][_token] = userBalances[msg.sender][_token].sub(_amount);

        address _endpoint = resolver.resolveToken(_token);
        require(_endpoint != address(0), 'Error: Compound endpoint not register');
        //if ether, transfer to sender, else approve token to be withdraw
        Dispatcher.withdraw(msg.sender, _token, _endpoint,_amount);

        emit Withdraw(msg.sender, _token, _amount);
    }


    function withdrawInterest(address _token, uint256 _amount) public onlyManager nonReentrant {

    }


    function donations(address _token) public view returns(uint256) {
        return totalBalances[_token];
    }


    function balanceOf(address _token, address _donor) public view returns(uint256) {
        return userBalances[_donor][_token];
    }


    function () external payable {
        revert("Error: call method directly");
    }


    modifier onlyManager {
        require(msg.sender == manager, 'Error: not manager');
        _;
    }
}
