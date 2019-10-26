pragma solidity ^0.5.11;

interface ICToken {

    function redeem(uint redeemtokens) external returns (uint);

    function redeemUnderlying(uint redeemamount) external returns (uint);

    function balanceOf(address account) external returns (uint);

    function balanceOfUnderlying(address account) external returns (uint);

    function exchangeRateCurrent() external returns (uint);

    function getCash() external returns (uint);

    function totalSupply() external returns (uint);

    function supplyRatePerBlock() external returns (uint);

    function mint(uint256 amount) external returns(uint);


}
