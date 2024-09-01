// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/AudioToken.sol";

contract DeployAudioToken is Script {
    function run() external {
        vm.startBroadcast();
        new AudioToken(msg.sender);
        vm.stopBroadcast();
    }
}
