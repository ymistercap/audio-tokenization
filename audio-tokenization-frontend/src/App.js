import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import AudioToken from "./contracts/AudioToken.json";
import "./App.css";

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [ownedFiles, setOwnedFiles] = useState([]);
  const [name, setName] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [price, setPrice] = useState("");
  const contractAddress = "0xC7500B277faBe9F4a90E84CBC71fA5412630De13";

  useEffect(() => {
    const connectWalletAndLoadData = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          AudioToken.abi,
          signer
        );

        loadAudioFiles(contract, signer);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    };

    connectWalletAndLoadData();
  }, []);

  const loadAudioFiles = async (contract, signer) => {
    const totalSupply = await contract.tokenCounter();
    let availableFiles = [];
    let ownedFiles = [];
    const userAddress = await signer.getAddress();

    for (let i = 0; i < totalSupply; i++) {
      const owner = await contract.ownerOf(i);
      const audioFile = await contract.getAudioFile(i);
      const fileDetails = {
        name: audioFile[0],
        ipfsHash: audioFile[1],
        price: ethers.formatEther(audioFile[2]),
      };

      if (owner !== userAddress) {
        availableFiles.push(fileDetails);
      } else {
        ownedFiles.push(fileDetails);
      }
    }
    setAudioFiles(availableFiles);
    setOwnedFiles(ownedFiles);
  };

  const createAudioToken = async (contract, signer) => {
    try {
      const tx = await contract.createAudioToken(
        name,
        ipfsHash,
        ethers.parseEther(price)
      );
      await tx.wait();
      alert("Token Created!");
      loadAudioFiles(contract, signer);
    } catch (error) {
      console.error("Failed to create token:", error);
    }
  };

  const purchaseToken = async (contract, tokenId, signer) => {
    try {
      const tokenPrice = audioFiles[tokenId].price;
      const tx = await contract.purchaseToken(tokenId, {
        value: ethers.parseEther(tokenPrice),
      });
      await tx.wait();
      alert("Token Purchased!");
      loadAudioFiles(contract, signer);
    } catch (error) {
      console.error("Failed to purchase token:", error);
    }
  };

  return (
    <div className="container">
      <h1>Audio Tokenization</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            AudioToken.abi,
            signer
          );
          await createAudioToken(contract, signer);
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="IPFS Hash"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Create Token</button>
      </form>

      <h2>Available Audio Files</h2>
      {audioFiles.length > 0 ? (
        audioFiles.map((file, index) => (
          <div key={index} className="audio-file">
            <p>
              <strong>Name:</strong> {file.name}
            </p>
            <p>
              <strong>Price:</strong> {file.price} ETH
            </p>
            <button
              onClick={async () => {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                  contractAddress,
                  AudioToken.abi,
                  signer
                );
                await purchaseToken(contract, index);
              }}
            >
              Purchase
            </button>
          </div>
        ))
      ) : (
        <p>No available audio files.</p>
      )}

      <h2>Your Owned Audio Files</h2>
      {ownedFiles.length > 0 ? (
        ownedFiles.map((file, index) => (
          <div key={index} className="audio-file">
            <p>
              <strong>Name:</strong> {file.name}
            </p>
            <p>
              <strong>IPFS Hash:</strong> {file.ipfsHash}
            </p>
            <p>
              <strong>Price:</strong> {file.price} ETH
            </p>
          </div>
        ))
      ) : (
        <p>You do not own any audio files.</p>
      )}
    </div>
  );
};

export default App;
