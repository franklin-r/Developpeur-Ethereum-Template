// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {

    string _name = "Alyra";
    string _symbol = "ALY";
    uint _initialSupply = 10000 * 10**18;
    address _owner = makeAddr("User0");
    address _recipient = makeAddr("User1");
    uint _decimals = 18;
    MyToken _myToken;

    function setUp() public {
        vm.prank(_owner);
        _myToken = new MyToken(_initialSupply);
    }

    function test_NameIsAlyra() public view {
        string memory name = _myToken.name();
        assertEq(name, _name);
    }

    function test_SymbolIsALY() public view {
        string memory symbol = _myToken.symbol();
        assertEq(symbol, _symbol);
    }

    function test_Decimals() public view {
        uint decimals = _myToken.decimals();
        assertEq(decimals, _decimals);
    }

    function test_Mint() public view {
        uint initialSupply = _myToken.totalSupply();
        assertEq(initialSupply, _initialSupply);
    }

    function test_CheckFirstBalance() public view {
        uint firstBalance = _myToken.balanceOf(_owner);
        assertEq(firstBalance, _initialSupply);
    }

    function test_BalanceAFterTransfer() public {
        uint value = 100;
        uint ownerBalanceBeforeTransfer = _myToken.balanceOf(_owner);
        uint recipientBalanceBeforeTransfer = _myToken.balanceOf(_recipient);
        assertEq(recipientBalanceBeforeTransfer, 0);

        vm.prank(_owner);
        _myToken.transfer(_recipient, value);

        uint ownerBalanceAfterTransfer = _myToken.balanceOf(_owner);
        uint recipientBalanceAfterTransfer = _myToken.balanceOf(_recipient);
        assertEq(ownerBalanceAfterTransfer, ownerBalanceBeforeTransfer - value);
        assertEq(recipientBalanceAfterTransfer, recipientBalanceBeforeTransfer + value);
    }

    function test_CheckIfApprovalDone() public {
        uint value= 100;
        uint allowanceBeforeApproval = _myToken.allowance(_owner, _recipient);
        assertEq(allowanceBeforeApproval, 0);

        vm.prank(_owner);
        _myToken.approve(_recipient, value);

        uint allowanceAfterApproval = _myToken.allowance(_owner, _recipient);
        assertEq(allowanceAfterApproval, value);
    }

    function test_CheckIfTransferDone() public {
        uint value = 100;

        vm.prank(_owner);
        _myToken.approve(_recipient, value);

        uint balanceOwnerBeforeTransfer = _myToken.balanceOf(_owner);
        uint balanceRecipientBeforeTransfer = _myToken.balanceOf(_recipient);
        assertEq(balanceOwnerBeforeTransfer, _initialSupply);
        assertEq(balanceRecipientBeforeTransfer, 0);

        vm.prank(_recipient);
        _myToken.transferFrom(_owner, _recipient, value);

        uint balanceOwnerAfterTransfer = _myToken.balanceOf(_owner);
        uint balanceRecipientAfterTransfer = _myToken.balanceOf(_recipient);

        assertEq(balanceOwnerAfterTransfer, _initialSupply - value);
        assertEq(balanceRecipientAfterTransfer, value);
    }

}