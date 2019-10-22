pragma solidity ^0.5.11;

contract ENS {

    function owner(bytes32 _node) public view returns (address);

    function resolver(bytes32 _node) public view returns (address);

    function ttl(bytes32 _node) public view returns (uint64);

    function setOwner(bytes32 _node, address _owner) public;

    function setSubnodeOwner(bytes32 _node, bytes32 _label, address _owner) public;

    function setResolver(bytes32 _node, address _resolver) public;

    function setTTL(bytes32 _node, uint64 _ttl) public;
}
