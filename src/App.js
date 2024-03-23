import React, { useState , useEffect, useRef } from 'react'
import { ethers } from 'ethers';
import { abi, contractAddress } from './constants.js';
import './App.css'; 

function App() {
  const [connectedAccount, setConnectedAccount] = useState(false);
  const [error, setError] = useState("");
  const signerRef = useRef(null);
  const providerRef = useRef(null);
  const web3 = useRef(null);

  const connectWallet = async () => {
    if (window && window.ethereum) {
      try {
        if (!connectedAccount) {
          providerRef.current = new ethers.providers.Web3Provider(window.ethereum);
          console.log(providerRef.current);
          const accounts = await providerRef.current.send("eth_requestAccounts", []);
          signerRef.current = providerRef.current.getSigner();
          console.log(accounts);

          setConnectedAccount(accounts[0]);
        }
        else {
          setConnectedAccount("");
          setError("");
          signerRef.current = null;
          providerRef.current = null;
        }
      } catch (err) {
          setError(err.message);
      }
    } else {
        alert("please install MetaMask");
    }
  }

  const callContract = async (isLong) => {
    if (!connectedAccount) {
      setError("Please connect to a wallet first.");
      return;
    }
    const signer = signerRef.current;
    const provider = providerRef.current;
    const contract = new ethers.Contract(contractAddress, abi, provider);
    console.log(contract);
    const contractCtx = contract.connect(signer);
    console.log("contractCtx", contractCtx);
    const result = await contractCtx.enterPriceGuess(isLong, {value: ethers.utils.parseEther("0.01")});
    console.log("result", result);
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
    <div className="App">
      <div className="head">
        <h1 className="title">FURACLE GAMETH</h1>
        <button onClick={handleConnect} className="connectButton">
          {connectedAccount ? `${connectedAccount.substring(0, 6)}...` : 'Connect Wallet'}
        </button>
      </div>

      <div className="body">
        <h2 className="line1">Guess tomorrow's ETH price at noon!</h2>
        <p className="line2">Will it be higher or lower than at midnight?</p>
        <div className="btnFlex">
          <button onClick={handleLong} className="button">
            Higher
          </button>
          <button onClick={handleShort} className="button">
            Lower
          </button>
        </div>
      </div>

      <div className="footer">
        &copy; 2024 Furacle GamETH. All rights reserved.
      </div>
    </div>

  );
}

export default App;
