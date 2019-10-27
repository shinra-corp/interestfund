pragma solidity ^0.5.12;

import "../../ens/ENSResolver.sol";


contract ENSResolverMock is ENSResolver {

    bytes4 constant SUPPORT_INTERFACE_ID = 0x01ffc9a7;
    bytes4 constant ADDR_INTERFACE_ID = 0x3b3b57de;
    bytes4 constant NAME_INTERFACE_ID = 0x691f3431;

    struct Record {
        address addr;
        string name;
    }

    mapping(bytes32 => Record) public records;

    function supportsInterface(bytes4 _interfaceID) public pure returns (bool) {
        return _interfaceID == SUPPORT_INTERFACE_ID || _interfaceID == ADDR_INTERFACE_ID || _interfaceID == NAME_INTERFACE_ID;
    }

    function addr(bytes32 _node) public view returns (address) {
        return records[_node].addr;
    }

    function setAddr(bytes32 _node, address _addr) public {
        records[_node].addr = _addr;
    }

    function name(bytes32 _node) public view returns (string memory) {
        return records[_node].name;
    }

    function setName(bytes32 _node, string memory _name) public {
        records[_node].name = _name;
    }
}
