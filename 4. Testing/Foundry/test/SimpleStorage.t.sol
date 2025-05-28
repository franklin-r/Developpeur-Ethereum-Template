// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {SimpleStorage} from "../src/SimpleStorage.sol";

contract SimpleStorageTest is Test {

    // Needs to defined again to test it
    event NumberChanged(address indexed by, uint256 number);

    address user1 = makeAddr("user1");
    address user2 = makeAddr("user2");

    SimpleStorage simpleStorage;

    function setUp() public {
        simpleStorage = new SimpleStorage();
    }

    function test_NumberIs0() public view {
        uint expectedNumber = simpleStorage.getNumber();

        assertEq(expectedNumber, 0);
    }

    function test_RevertWhen_NumberOutOfRange() public {
        vm.expectRevert();
        simpleStorage.setNumber(99);
    }

    function test_SetNumberTo7() public {
        simpleStorage.setNumber(7);
        uint expectedNumber = simpleStorage.getNumber();

        assertEq(expectedNumber, 7);
    }

    function test_SetNumberWithDifferentUser() public {
        // Change account
        vm.startPrank(user2);
        simpleStorage.setNumber(6);

        uint expectedNumberUser2 = simpleStorage.getNumber();

        assertEq(expectedNumberUser2, 6); 

        // Stop change account
        vm.stopPrank();

        uint expectedNumberUser1 = simpleStorage.getNumber();

        assertEq(expectedNumberUser1, 0);
    }

    function test_ExpectEmit() public {
        // First three booleans represent the topics that I have.
        // Here, I only have one.
        // Last 'true' represents the uint of the event.
        // Boolean for uint can be 'false' if we don't care about its value.
        // In this case, we can put whatever we want as parameter of setNumber(),
        // it won't be checked.
        vm.expectEmit(true, false, false, true);
        emit NumberChanged(address(user2), 5);
        vm.startPrank(user2);
        simpleStorage.setNumber(5);
        vm.stopPrank();
    }
}
