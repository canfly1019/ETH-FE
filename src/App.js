import React, { useState , useRef } from 'react'
import { ethers } from 'ethers';
import { abi, contractAddress } from './constants.js';
import './App.css'; 

function App() {
  const [connectedAccount, setConnectedAccount] = useState(false);
  const [error, setError] = useState("");
  const signerRef = useRef(null);
  const providerRef = useRef(null);

  const connectWallet = async () => {
    if (window && window.ethereum) {
      try {
        if (!connectedAccount) {
          providerRef.current = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await providerRef.current.send("eth_requestAccounts", []);
          signerRef.current = providerRef.current.getSigner();
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
    try {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const contractCtx = contract.connect(signer);
      const result = await contractCtx.enterPriceGuess(isLong, {value: ethers.utils.parseEther("0.01")});
      alert("You joined the game sucessfully!");
    } catch (err) {
      setError(err.message);
    }
  }

  function extractFirstSentence(errorMessage) {
    const periodIndex = error.indexOf('.');
    
    if (periodIndex !== -1) {
      return error.substring(0, periodIndex + 1);
    } else {
      return error;
    }
  }

  const firstSentence = extractFirstSentence(error);

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
        <img className="img" src={process.env.PUBLIC_URL + '/logo.jpg'} alt="logo" />
        <p className="title">FURACLE GAMETH</p>
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
        <div className="footer">
          {error && <div className="err">{error}</div>}
        </div>
      </div>     
    </div>

  );
}

export default App;
