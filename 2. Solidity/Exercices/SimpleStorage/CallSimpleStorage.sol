// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

interface ISimpleStorage {
    // Not necessary to put all functions of SimpleStorage in the interface
    function store(uint256 num) external;
    function retrieve() external view returns (uint256);
}

contract CallSimpleStorage {
    ISimpleStorage simpleStorage;

    // _addr is the address at which SimpleStorage has been deployed
    function setAddress(address _addr) external {
        simpleStorage = ISimpleStorage(_addr);
    }

    function useRetrieve() external view returns (uint) {
        return simpleStorage.retrieve();
    }

    function useStore(uint _number) external {
        simpleStorage.store(_number);
    }
}
