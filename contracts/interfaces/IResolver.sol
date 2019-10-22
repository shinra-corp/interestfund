pragma solidity ^0.5.11;

interface IResolver {

    function resolveToken(address _token) external returns(address);

    function tokens(uint256 _pos) external view returns(address);

    function numTokens() external view returns(uint256);
}
