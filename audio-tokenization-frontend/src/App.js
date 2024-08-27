import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import AudioToken from "./contracts/AudioToken.json";

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [name, setName] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [price, setPrice] = useState("");
  const contractAddress = "CONTRACT_ADDRESS";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, AudioToken.abi, signer);

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    const totalSupply = await contract.tokenCounter();
    let files = [];
    for (let i = 0; i < totalSupply; i++) {
      const audioFile = await contract.getAudioFile(i);
      files.push({
        name: audioFile[0],
        ipfsHash: audioFile[1],
        price: ethers.utils.formatEther(audioFile[2]),
      });
    }
    setAudioFiles(files);
  };

  const createAudioToken = async () => {
    const tx = await contract.createAudioToken(
      name,
      ipfsHash,
      ethers.utils.parseEther(price)
    );
    await tx.wait();
    alert("Token Created!");
    loadAudioFiles();
  };

  const purchaseToken = async (tokenId) => {
    const tokenPrice = audioFiles[tokenId].price;
    const tx = await contract.purchaseToken(tokenId, {
      value: ethers.utils.parseEther(tokenPrice),
    });
    await tx.wait();
    alert("Token Purchased!");
    loadAudioFiles();
  };

  return (
    <div>
      <h1>Audio Tokenization</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="IPFS Hash"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price in ETH"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={createAudioToken}>Create Token</button>
      <h2>Available Audio Files</h2>
      {audioFiles.map((file, index) => (
        <div key={index}>
          <p>Name: {file.name}</p>
          <p>IPFS Hash: {file.ipfsHash}</p>
          <p>Price: {file.price} ETH</p>
          <button onClick={() => purchaseToken(index)}>Purchase</button>
        </div>
      ))}
    </div>
  );
};

export default App;
