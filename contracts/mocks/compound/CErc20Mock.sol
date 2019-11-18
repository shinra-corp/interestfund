pragma solidity ^0.5.11;

import "../../interfaces/IERC20.sol";
import "../../interfaces/ICToken.sol";

import "../../utils/SafeMath.sol";


contract CErc20 is ICToken {

    using SafeMath for uint256;

    IERC20 private _underlyingToken;
    uint256 private _supplyRateBlock;
    uint256 public _testing;

    mapping(address => uint256) public balance;


    constructor(address _daiToken, uint256 _supplyRatePerBlock) public {
        _underlyingToken = IERC20(_daiToken);
        _supplyRateBlock = _supplyRatePerBlock;
    }


    function addLiquidity(address pool, uint256 amount) external {
        balance[pool] = balance[pool] + amount;
    }

    function mint(uint256 amount) external returns(uint) {
        require(_underlyingToken.transferFrom(msg.sender, address(this), amount), 'Error: Unable to transfer tokens');
        balance[msg.sender] = balance[msg.sender].add(amount);
        return 0;
    }


    function redeemUnderlying(uint reddemAmount) external returns (uint) {
        balance[msg.sender] = balance[msg.sender].sub(reddemAmount);
        require(_underlyingToken.transfer(msg.sender, reddemAmount), 'Error: Unable to transfer tokens');
        return 0;
    }

    function balanceOf(address account) external view returns (uint) {
        return balance[account];
    }

    function balanceOfUnderlying(address account) external view returns (uint) {
        return _underlyingToken.balanceOf(account).add(_supplyRateBlock);
    }


    function getCash() external returns (uint) {
        return _underlyingToken.balanceOf(address(this));
    }


    function supplyRatePerBlock() external returns (uint) {
        return _supplyRateBlock;
    }
}
