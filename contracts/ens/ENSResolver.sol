pragma solidity ^0.5.11;

contract ENSResolver {

    function supportsInterface(bytes4 _interfaceID) public pure returns (bool);

    function addr(bytes32 _node) public view returns (address);

    function setAddr(bytes32 _node, address _addr) public;

    function name(bytes32 _node) public view returns (string memory);

    function setName(bytes32 _node, string memory _name) public;
}
