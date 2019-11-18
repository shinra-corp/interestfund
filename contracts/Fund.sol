pragma solidity ^0.5.0;

import "./utils/SafeMath.sol";
import "./utils/ReentrancyGuard.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/ICToken.sol";

/// @title Fund Wallet
/// @notice You should interact with this contract to start/end funding this project. Each project have a Fund contract.
/// @dev A new Fund contract is instanciated from Factory Pattern. See FundFactory.sol.
contract Fund is ReentrancyGuard {

    using SafeMath for uint256;

    event StartFunding(address indexed donor, uint256 amount);
    event Withdraw(address indexed donor, uint256 amount);
    event TopFunding(address indexed donor, uint256 amount);

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
        address _daiToken,
        address _compoundToken
    )
    public
    {
        require(_manager != address(0), "Error: manager not valid");
        manager = _manager;
        daiToken = IERC20(_daiToken);
        compoundToken = ICToken(_compoundToken);
    }

    ///@notice Start funding this project with some amount of DAI.
    ///@dev This function should only be call after the user approved DAI with this contract address.
    ///@param _amount The amount of DAI token to send to this project wallet.
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


    ///@notice Get back a previous send amount of DAI token.
    ///@dev This function after validating withdraw amounts will call 'transfer' on DAI contract with the caller address.
    ///@param _amount The amount of DAI token to withdraw from this project wallet. Use 18 decimals
    function withdraw(uint256 _amount) public nonReentrant {

        require(userBalances[msg.sender] >= _amount, 'Error: not enough balance');

        totalBalances = totalBalances.sub(_amount);
        userBalances[msg.sender] = userBalances[msg.sender].sub(_amount);

        if(userBalances[msg.sender] == 0) {
            isDonor[msg.sender] = false;
            numberActiveDonors = numberActiveDonors.sub(1);
        }

        _withdraw(_amount);

        emit Withdraw(msg.sender, _amount);
    }

    ///@notice Get fund generated interest in DAI. Can't withdraw users balances.
    ///@dev This function after validating withdraw amounts will call 'transfer' on DAI contract with the caller address.
    ///@param _amount The amount of DAI token to withdraw from this project wallet. Use 18 decimals
    function withdrawInterest(uint256 _amount) public onlyManager nonReentrant {
        //get compound balance
        uint256 cbalance = compoundToken.balanceOf(address(this));
        require(cbalance.sub(totalBalances) >= _amount, 'Error: not enough balance');

        _withdraw(_amount);

        emit Withdraw(address(this), _amount);
    }

    ///@notice Return the amount of accrued interest from fund on Compound market.
    ///@return _amount The amount of interest generated. Use 18 decimals
    function accruedInterest() public view returns(uint256) {
        uint256 cbalance = compoundToken.balanceOfUnderlying(address(this));
        if(cbalance < totalBalances) {
            return 0;
        }
        return cbalance.sub(totalBalances);
    }

    ///@notice Return the balance of a user in this contract.
    ///@return _amount The amount of donation given by user. Use 18 decimals
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


    function _withdraw(uint256 _amount) internal {
        //get tokens back from compound
        require(compoundToken.redeemUnderlying(_amount) == 0, "Error: compound reddem");

        //Transfer tokens to user address
        require(daiToken.transfer(msg.sender, _amount), "Error: DAI transfer");
    }


    modifier onlyManager {
        require(msg.sender == manager, 'Error: not manager');
        _;
    }
}
