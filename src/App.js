import React, { useState , useEffect, useRef } from 'react'
import { ethers } from 'ethers';
import { abi, contractAddress } from './constants.js';

function App() {
  const [connectedAccount, setConnectedAccount] = useState(false);
  const [error, setError] = useState("");
  const signerRef = useRef(null);
  const providerRef = useRef(null);
  const web3 = useRef(null);

  const connectWallet = async () => {
    if (window && window.ethereum) {
      try {
          console.log(ethers.providers);
          providerRef.current = new ethers.providers.Web3Provider(window.ethereum);
          console.log(providerRef.current);
          await providerRef.current.send("eth_requestAccounts", []);
          signerRef.current = providerRef.current.getSigner();
      } catch (error) {
          setError(error.message);
      }
    } else {
        alert("please install MetaMask");
    }
  }

  const callContract = async (isLong) => {
    const signer = signerRef.current;
    const provider = providerRef.current;
    const contract = new ethers.Contract(contractAddress, abi, provider);
    console.log(contract);
    const contractCtx = contract.connect(signer);
    console.log("contractCtx", contractCtx);
    await contractCtx.enterPriceGuess(isLong, {value: ethers.utils.parseEther("0.01")});
}

  const handleConnect = async () => {
    await connectWallet();
  }

  const handleLong = async () => {
    await callContract(true);
  }

  const handleShort = async () => {
    await callContract(false);
  }

  return (
    <div>
      <button onClick={handleConnect}>{connectedAccount ? 'Connected' : 'Connect'}</button>
      <button onClick={handleLong}>Long</button>
      <button onClick={handleShort}>Short</button>
    </div>
  );
}

export default App;
