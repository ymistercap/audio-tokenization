// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC721";

contract AudioToken is ERC721, Ownable {
    uint256 public tokenCounter;

    struct AudioFile {
        string name;
        string ipfsHash;
        uint256 price;
    }

    mapping(uint256 => AudioFile) public audioFiles;

    constructor() ERC721("AudioToken", "ATK") {
        tokenCounter = 0;
    }

    function createAudioToken(string memory _name, string memory _ipfsHash, uint256 _price) public onlyOwner {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        audioFiles[newTokenId] = AudioFile(_name, _ipfsHash, _price);
        tokenCounter += 1;
    }

    function purchaseToken(uint256 _tokenId) public payable {
        AudioFile memory audioFile = audioFiles[_tokenId];
        require(msg.value >= audioFile.price, "Insufficient payment");
        address tokenOwner = ownerOf(_tokenId);
        payable(tokenOwner).transfer(msg.value);
        _transfer(tokenOwner, msg.sender, _tokenId);
    }

    function getAudioFile(uint256 _tokenId) public view returns (string memory, string memory, uint256) {
        AudioFile memory audioFile = audioFiles[_tokenId];
        return (audioFile.name, audioFile.ipfsHash, audioFile.price);
    }
}
