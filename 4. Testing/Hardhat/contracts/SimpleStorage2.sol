// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.28; 

contract SimpleStorage2 {
    uint256 private value;
    
    function setValue(uint256 newValue) public {
        value = newValue;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }

    function getCurrentTime() external view returns (uint) {
        return block.timestamp;
    }
}