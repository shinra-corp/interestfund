pragma solidity ^0.5.11;

interface ICToken {


    function redeemUnderlying(uint redeemamount) external returns (uint);

    function balanceOf(address account) external returns (uint);

    function balanceOfUnderlying(address account) external returns (uint);

    function getCash() external returns (uint);

    function supplyRatePerBlock() external returns (uint);

    function mint(uint256 amount) external returns(uint);


}
