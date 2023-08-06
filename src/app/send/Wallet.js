import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

const MetaMaskConnector = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const initializeWeb3 = async () => {
      // Detect MetaMask provider
      const provider = await detectEthereumProvider();

      if (provider) {
        // Set up Web3 with the MetaMask provider
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        // Add an event listener to update the accounts when the user changes account in MetaMask
        provider.on('accountsChanged', (newAccounts) => {
          setAccounts(newAccounts);
        });
      } else {
        console.error('Please install MetaMask to use this application.');
      }
    };

    initializeWeb3();
  }, []);

  const connectToMetaMask = async () => {
    try {
      if (web3) {
        // Request account access from the user
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccounts(accounts);
      } else {
        console.error('Web3 is not initialized.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error.message);
    }
  };

  return (
    <div>
      {accounts.length > 0 ? (
        <p>Connected Account: {accounts[0]}</p>
      ) : (
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      )}
    </div>
  );
};

export default MetaMaskConnector;