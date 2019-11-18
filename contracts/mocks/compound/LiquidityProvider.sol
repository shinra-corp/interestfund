pragma solidity ^0.5.11;

import "../../interfaces/IERC20.sol";

interface ILiquidity {
    function addLiquidity(address pool, uint256 amount) external;
}

contract LiquidityProvider {

    IERC20 public dai;
    ILiquidity public ctoken;

    constructor(address _dai, address _ctoken) public {
        dai = IERC20(_dai);
        ctoken = ILiquidity(_ctoken);
    }


    function transferToPool(address _pool, uint256 _amount) public {
       dai.transfer(address(ctoken), _amount);
       ctoken.addLiquidity(_pool, _amount);
    }
}
