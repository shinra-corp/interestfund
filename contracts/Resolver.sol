pragma solidity ^0.5.11;

import "./utils/Ownable.sol";

contract Resolver is Ownable {

    mapping(address => address) internal _resolve;
    address[] internal _tokens;


    function resolveToken(address _token) public view returns(address) {
        return _resolve[_token];
    }

    function addToken(address _token, address _endpoint) public onlyOwner {

        require(_resolve[_token] == address(0), 'token duplication');

        _tokens.push(_token);
        _resolve[_token] = _endpoint;
    }

    function tokens(uint256 _pos) public view returns(address) {
        return _tokens[_pos];
    }

    function numTokens() public view returns(uint256) {
        return _tokens.length;
    }
}
