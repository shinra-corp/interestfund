pragma solidity ^0.5.11;

/// @title Ownable Contract functions
/// @notice This contract allow for defining the owner of the child contract. To change ownership the new Owner must acceptOwnership.
contract Ownable {

    address public owner;
    address public nextOwner;

    event ProposedNewOwner(address indexed newOwner);
    event AcceptNewOwner(address indexed newOwner);

    constructor() internal {
        owner = msg.sender;
    }

    ///@notice Change ownership of contract
    ///@dev The new owner must accept the ownership
    ///@param _newOwner address of the new Owner
    function changeOwner(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), 'Must be a valid new Owner');
        nextOwner = _newOwner;
        emit ProposedNewOwner(_newOwner);
    }

    ///@notice Accept ownership of contract
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
