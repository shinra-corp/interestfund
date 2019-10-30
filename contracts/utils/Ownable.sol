pragma solidity ^0.5.11;

contract Ownable {

    address public owner;
    address public nextOwner;

    event ProposedNewOwner(address indexed newOwner);
    event AcceptNewOwner(address indexed newOwner);

    constructor() internal {
        owner = msg.sender;

    }

    function changeOwner(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), 'Must be a valid new Owner');
        nextOwner = _newOwner;
        emit ProposedNewOwner(_newOwner);
    }

    function acceptOwnership() public {
        require(msg.sender == nextOwner, 'not the next owner');
        owner = nextOwner;
        delete nextOwner;
        emit AcceptNewOwner(owner);
    }

    modifier onlyOwner {
        require(msg.sender == owner, 'not owner');
        _;
    }
}
