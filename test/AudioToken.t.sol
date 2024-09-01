// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/AudioToken.sol";

contract AudioTokenTest is Test {
    AudioToken token;

    function setUp() public {
        token = new AudioToken(address(this)); 
    }

    function testCreateAudioToken() public {
        token.createAudioToken("Test Audio", "QmTestHash", 1 ether);
        (string memory name, string memory ipfsHash, uint256 price) = token.getAudioFile(0);
        assertEq(name, "Test Audio");
        assertEq(ipfsHash, "QmTestHash");
        assertEq(price, 1 ether);
    }

    function testPurchaseToken() public {
        token.createAudioToken("Test Audio", "QmTestHash", 1 ether);
        token.purchaseToken{value: 1 ether}(0);
        address owner = token.ownerOf(0);
        assertEq(owner, address(this));
    }
}
