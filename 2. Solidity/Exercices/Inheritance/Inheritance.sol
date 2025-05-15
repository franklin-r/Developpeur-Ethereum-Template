// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

contract Parent {
    uint internal value;

    function setValue(uint _value) external {
        value = _value;
    }
}

contract Child is Parent {
    function getValue() external view returns (uint) {
        return value;
    }
}

contract Caller {
    Child child = new Child();

    function callFunctions(uint _value) public returns (uint) {
        child.setValue(_value);
        return child.getValue();
    }
}
