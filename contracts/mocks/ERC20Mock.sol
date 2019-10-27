pragma solidity 0.5.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {

    constructor (address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}

