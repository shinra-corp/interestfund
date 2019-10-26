pragma solidity ^0.5.12;


import "./utils/SafeMath.sol";
import "./utils/ReentrancyGuard.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/ICToken.sol";

contract Fund is ReentrancyGuard {

    using SafeMath for uint256;

    event StartFunding(address indexed donor, uint256 amount);
    event Withdraw(address indexed donor, uint256 amount);
    event TopFunding(address indexed donor, uint256 amount);

    string public URI;
    address public manager;

    uint256 public totalBalances;
    uint256 public numberDonors;
    uint256 public numberActiveDonors;

    ICToken public compoundToken;
    IERC20 public daiToken;

    mapping(address => uint256) public userBalances;
    mapping(address => bool) public isDonor;

    constructor(
        address _manager,
        string memory _URI,
        address _compoundToken,
        address _daiToken
    )
    public
    {
        require(_manager != address(0), "Error: manager not valid");
        manager = _manager;
        URI = _URI;
        compoundToken = ICToken(_compoundToken);
        daiToken = IERC20(_daiToken);
    }


    function funding(uint256 _amount) public nonReentrant {

        require(_amount != 0, "Error: define amount");

        _openFunding(msg.sender, _amount);

        totalBalances = totalBalances.add(_amount);
        userBalances[msg.sender] = userBalances[msg.sender].add(_amount);

        if(isDonor[msg.sender]) {
            emit TopFunding(msg.sender, _amount);
        } else {
            isDonor[msg.sender] = true;
            numberDonors = numberDonors.add(1);
            numberActiveDonors = numberActiveDonors.add(1);
            emit StartFunding(msg.sender, _amount);
        }

    }


    function withdraw(uint256 _amount) public nonReentrant {

        require(userBalances[msg.sender] > _amount, 'Error: not enough balance');

        userBalances[msg.sender] = userBalances[msg.sender].sub(_amount);

        if(userBalances[msg.sender] == 0) {
            isDonor[msg.sender] = false;
            numberActiveDonors = numberActiveDonors.sub(1);
        }

        _withdraw(msg.sender,_amount);

        emit Withdraw(msg.sender, _amount);
    }


    function withdrawInterest(uint256 _amount) public onlyManager nonReentrant {
        //get compound balance
        uint cbalance = compoundToken.balanceOf(address(this));

        require(cbalance.sub(totalBalances) >= _amount, 'Error: not enough balance');
        _withdraw(msg.sender, _amount);

        emit Withdraw(msg.sender, _amount);
    }

    function accruedInterest() public returns(uint256) {
    }


    function balanceOf(address _donor) public view returns(uint256) {
        return userBalances[_donor];
    }


    function () external payable {
        revert("Error: call method directly");
    }

    function _openFunding(address _sender, uint256 _amount) internal {

            //get tokens from user to Fund account
            require(daiToken.transferFrom(_sender, address(this), _amount), 'Error transfer tokens');
            //approve compound contract to withdraw tokens
            require(daiToken.approve(address(compoundToken), _amount), 'failed to approve token');
            //ask to mint new compound tokens
            require(compoundToken.mint(_amount) == 0, 'failed to mint ctokens');
    }


    function _withdraw(address _sender, uint256 _amount) internal {

            //get tokens back from compound
            require(compoundToken.redeem(_amount) == 0, "Error: compound reddem");
            //approve users to withdraw dai token
            require(daiToken.approve(_sender, _amount) == true, "Error: Token Approve");
    }

    modifier onlyManager {
        require(msg.sender == manager, 'Error: not manager');
        _;
    }
}
