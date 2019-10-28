pragma solidity ^0.5.12;

import "../../interfaces/IERC20.sol";
import "../../interfaces/ICToken.sol";
import "../../utils/SafeMath.sol";


contract CErc20 is ICToken {

    using SafeMath for uint256;

    IERC20 private _underlyingToken;
    uint256 private _supplyRateBlock;

    mapping(address => uint256) public balance;


    constructor(address _daiToken, uint256 _supplyRatePerBlock) public {
        _underlyingToken = IERC20(_daiToken);
        _supplyRateBlock = _supplyRatePerBlock;
    }


    function mint(uint256 amount) external returns(uint) {
        require(_underlyingToken.transferFrom(msg.sender, address(this), amount), 'Error: Unable to transfer tokens');
        balance[msg.sender] = balance[msg.sender].add(amount);
    }

    function redeemUnderlying(uint redeemamount) external returns (uint) {
        balance[msg.sender] = balance[msg.sender].sub(redeemamount);
        require(_underlyingToken.transfer(msg.sender, redeemamount), 'Error: Unable to transfer tokens');
    }

    function balanceOf(address account) external view returns (uint) {
        return balance[account] * _supplyRateBlock;
    }

    function balanceOfUnderlying(address account) external view returns (uint) {
        return _underlyingToken.balanceOf(account);
    }

    function exchangeRateCurrent() external returns (uint) {
    }

    function getCash() external returns (uint) {
        return _underlyingToken.balanceOf(address(this));
    }


    function supplyRatePerBlock() external returns (uint) {
        return _supplyRateBlock;
    }


}
