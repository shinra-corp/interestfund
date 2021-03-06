pragma solidity 0.5.11;

import "../mocks/ERC20.sol";

contract ERC20Mock is ERC20 {

    constructor (address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}

