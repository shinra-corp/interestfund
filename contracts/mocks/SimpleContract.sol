pragma solidity ^0.5.12;

import "../utils/Ownable.sol";

contract SimpleContract is Ownable {

    uint256 public counter;

    constructor() public {
    }

    function addCounter() public onlyOwner {
        counter += 1;
    }

}
