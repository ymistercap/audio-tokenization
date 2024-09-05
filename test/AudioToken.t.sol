// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/AudioToken.sol";

contract AudioTokenTest is Test {
    AudioToken public audioToken;
    address public owner = address(0x123);
    address public buyer = address(0x456);

    function setUp() public {
        audioToken = new AudioToken(owner);
    }

    function testInitialTokenCounter() public view {
        assertEq(audioToken.tokenCounter(), 0);
    }

    function testCreateAudioToken() public {
        vm.prank(owner);
        audioToken.createAudioToken("MyAudioFile", "QmTestHash", 1 ether);

        (string memory name, string memory ipfsHash, uint256 price) = audioToken.getAudioFile(0);
        assertEq(name, "MyAudioFile");
        assertEq(ipfsHash, "QmTestHash");
        assertEq(price, 1 ether);
        assertEq(audioToken.tokenCounter(), 1);
    }

    function testPurchaseToken() public {
        vm.prank(owner);
        audioToken.createAudioToken("MyAudioFile", "QmTestHash", 1 ether);

        uint256 tokenId = 0;

        assertEq(audioToken.ownerOf(tokenId), owner);

        vm.deal(buyer, 2 ether);
        vm.prank(buyer);
        audioToken.purchaseToken{value: 1 ether}(tokenId);

        assertEq(audioToken.ownerOf(tokenId), buyer);

        assertEq(owner.balance, 1 ether);
    }

    function testPurchaseFailsIfInsufficientPayment() public {
        vm.prank(owner);
        audioToken.createAudioToken("MyAudioFile", "QmTestHash", 1 ether);

        uint256 tokenId = 0;

        vm.deal(buyer, 0.5 ether);

        vm.prank(buyer);
        vm.expectRevert("Insufficient payment");
        audioToken.purchaseToken{value: 0.5 ether}(tokenId);
    }
}
