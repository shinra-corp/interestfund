pragma solidity ^0.5.11;

import "../../interfaces/IERC20.sol";

interface ILiquidity {

    function addLiquidity(address pool, uint256 amount) external;

}

contract LiquidityProvider {

    IERC20 public token;
    address public ctoken;

    constructor(address _token, address _ctoken) public {
        token = IERC20(_token);
        ctoken = _ctoken;
    }


    function transferToPool(address _pool, uint256 _amount) public {
//        ctoken.call(abi.encodeWithSignature("addLiquidity(address,uint256)", _pool, _amount));
        //require(ok,'not good');
       //require(ctoken.call(bytes4(keccak256("addLiquidity(address pool,uint256 amount)")), _pool, _amount), "Errorrororor");
       token.transfer(_pool, _amount);
       ILiquidity(ctoken).addLiquidity(_pool, _amount);
    }

}
