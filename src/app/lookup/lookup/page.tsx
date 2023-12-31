'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faTiktok, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.css';
import Image from 'next/legacy/image';

import styles from '@styles/App.css';

library.add( faCopy, faGlobe, faTiktok, faInstagram, faTwitter, faYoutube );

const formatTransactionValue = (value) => {
  const tikValue = parseFloat(value) / 1e18; // Divide by the TIK decimal factor (1e18)
  const formattedValue = tikValue.toFixed(18); // Format with 18 decimal places
  return `${formattedValue} TIK`;
};

const LookUp = () => {
  const baseURL = 'https://identity-resolver-5ywm7t2p3a-pd.a.run.app';
  const defaultHandle = 'technicallyweb3'; // Default handle
  const [handle, setHandle] = useState(defaultHandle);
  const [userInfo, setUserInfo] = useState({});
  const [balance, setBalance] = useState('Loading balance...');
  const [transactions, setTransactions] = useState([]);
  const [isWalletRegistered, setIsWalletRegistered] = useState(false);
  const router = useRouter();

  const copyToClipboard = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const getUserInfo = (handle) => {
    const apiUrl = `${baseURL}/user?handle=${handle}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const tiktokUser = data['tiktok-user'];
        const linkedWallet = data['linked-wallet'];

        setUserInfo({
          tiktokUser,
          linkedWallet
        });
      })
      .catch((error) => {
        console.log('Error fetching user information:', error);
      });
  };

  const handleSendClick = () => {
    const linkedWalletAddress = userInfo?.linkedWallet?.address;
    // Construct the full path to the wallet.js file
    const walletPath = '/wallet';
    // Use window.location.href to navigate to the desired path
    window.location.href = walletPath + `?address=${linkedWalletAddress}`;
  };

  const handleTransactionsClick = () => {
    const handleUrl = `https://polygonscan.com/token/0x359c3ad611e377e050621fb3de1c2f4411684e92?a=${userInfo?.linkedWallet?.address}`;

    window.open(handleUrl, '_blank');
  };

  const displayBalance = async () => {
    const userApiUrl = `${baseURL}/user?handle=${handle}`;

    try {
      const userResponse = await fetch(userApiUrl);
      if (!userResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const userData = await userResponse.json();
      const linkedWallet = userData['linked-wallet'];
      const isRegistered = linkedWallet['isRegistered'];

      if (isRegistered) {
        const balanceDec = linkedWallet['balanceDec'];
        setBalance(formatBalance(balanceDec));

        const address = linkedWallet.address;
        const transactionsResponse = await fetchPolygonTransactions(address);
        const transactionsData = await transactionsResponse.json();
        const transactions = transactionsData.result;
        setTransactions(transactions);
      } else {
        setBalance('Wallet not registered');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPolygonTransactions = async (address) => {
    const apiKey = 'NVTYK9HY29VP2C54X24PXZQUS57TPWHCU7'; // Replace with your own API key from Polygon
    const apiUrl = `https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress=0x359c3ad611e377e050621fb3de1c2f4411684e92&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=asc&apikey=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatBalance = (balanceDec) => {
    const formattedBalance = parseFloat(balanceDec).toFixed(6);
    return `${formattedBalance} TIK`;
  };

  useEffect(() => {
    getUserInfo(handle); // Fetch user info with the initial/default handle
    displayBalance();
  }, [handle]); // Update whenever the handle changes

  useEffect(() => {
    // Check if the wallet is registered
    if (userInfo?.linkedWallet?.isRegistered) {
      setIsWalletRegistered(true);
    } else {
      setIsWalletRegistered(false);
    }
  }, [userInfo?.linkedWallet]);

const handleSocialMediaChange = (event) => {
  const selectedValue = event.target.value;
  if (selectedValue) {
    window.open(selectedValue, '_blank');
  }
};

  return (
    <div className={styles.containerHome}>
<header>
  <div className="site-description">
    <h1>User LookUp</h1>
  </div>
</header>

      <br />
      <br />

      <form onSubmit={(e) => { e.preventDefault(); getUserInfo(handle); }}>
        <label htmlFor="handleInput">TikTok Handle:</label>
        <input
          type="text"
          id="handleInput"
          placeholder="Enter TikTok handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <button type="submit">Get Info</button>
      </form>

      <br />
      <br />

      <div className="container">
        <div className="use-avatar">
          <img className="avatar" src={userInfo?.tiktokUser?.avatarURL} alt="User Avatar" />
        </div>
        <div className="user-details">
          <h2>{userInfo?.tiktokUser?.username}</h2>
          <p>@{userInfo?.tiktokUser?.handle}</p>
<br />
          <div className="user-stats">
            <div className="stat">
              <div>
                <span className="number">{userInfo?.tiktokUser?.followers}</span>
              </div>
              <div>
                <span className="label">FOLLOWERS</span>
              </div>
            </div>
            <div className="stat">
              <div>
                <span className="number">{userInfo?.tiktokUser?.following}</span>
              </div>
              <div>
                <span className="label">FOLLOWING</span>
              </div>
            </div>
            <div className="stat">
              <div>
                <span className="number">{userInfo?.tiktokUser?.likes}</span>
              </div>
              <div>
                <span className="label">LIKES</span>
              </div>
            </div>
            <div className="stat">
              <div>
                <span className="number">{userInfo?.tiktokUser?.videos}</span>
              </div>
              <div>
                <span className="label">VIDEOS</span>
              </div>
            </div>
          </div>
<br />
<br />
  <div className="bio">
    <span className="label">Bio:</span>
    <p>{userInfo?.tiktokUser?.bio}</p>
  </div>

  <h2>Social Media Accounts</h2>
  <select
    className="socialDropdown"
    onChange={handleSocialMediaChange}
    style={{ color: 'black', fontWeight: 'bold' }} // Apply styles to the select element
  >
    <option value="">Select an account</option>
    <option
      value={`https://www.tiktok.com/@${handle}`}
      className="fabSocial"
    >
<span className="fabIcon"
  dangerouslySetInnerHTML={{ __html: '&#xe07b;' }}
/>
      TikTok
    </option>
    <option
      value={`https://www.instagram.com/${userInfo?.tiktokUser?.handle}`}
      className="fabSocial"
    >
      <span
        className="fabIcon"
        dangerouslySetInnerHTML={{ __html: '&#xf16d;' }}
      />
      Instagram
    </option>
    <option
      value={`https://www.twitter.com/${userInfo?.tiktokUser?.handle}`}
      className="fabSocial"
    >
      <span
        className="fabIcon"
        dangerouslySetInnerHTML={{ __html: '&#xf099;' }}
      />
      Twitter
    </option>
    <option
      value={`https://www.youtube.com/${userInfo?.tiktokUser?.handle}`}
      className="fabSocial"
    >
      <span
        className="fabIcon"
        dangerouslySetInnerHTML={{ __html: '&#xf167;' }}
      />
      YouTube
    </option>
  </select>
<br />
<br />
<br />
<br />
      <div className="cardIcons">

        <a href={`/send?to=${userInfo?.tiktokUser?.handle}`} rel="noopener noreferrer">
              <i className="fas fa-paper-plane"></i>
        </a>

        <i className="fas fa-copy icon" style={{ marginTop: '9px' }} onClick={() => copyToClipboard(userInfo?.linkedWallet?.address)}></i>

        <a href={`https://polygonscan.com/address/${userInfo?.linkedWallet?.address}`} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGlobe} />
        </a>
      </div>
<br />
<br />
          <h2>Wallet Balance</h2>
          <div className="balance">{balance}</div>
          <br />
          <button onClick={handleSendClick}>Send TIK</button>
        </div>
        <br />

        {/* Render transactions only if the wallet is registered */}
        {isWalletRegistered && (
          <div className="transaction-container">
            <h2>Transactions</h2>
            {transactions.length > 0 ? (
              <div className="transaction-container">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Timestamp</th>
                      <th>From</th>
                      <th>To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr className="transaction-row" key={transaction.hash}>
                        <td>{formatTransactionValue(transaction.value)}</td>
                        <td>{new Date(parseInt(transaction.timeStamp) * 1000).toLocaleString()}</td>
                        <td>
                          {transaction.from === userInfo?.linkedWallet?.address
                            ? userInfo?.tiktokUser?.username
                            : transaction.from}
                        </td>
                        <td>
                          {transaction.to === userInfo?.linkedWallet?.address
                            ? userInfo?.tiktokUser?.handle
                            : userInfo?.tiktokUser?.username}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No transactions found.</p>
            )}

            <br />
            <button onClick={handleTransactionsClick}>View All Transactions</button>
          </div>
        )}
      </div>

      <br />

      <br />

      <footer>
        <p>
          Made with <span className="heart">&hearts;</span> by{' '}
          <a href="https://michaelh.org" target="_blank" rel="noopener noreferrer">
            MichaelHDesigns
          </a>
        </p>
        <p>
          Data provided by{' '}
          <a href="https://www.tokcount.com/" target="_blank" rel="noopener noreferrer">
            TokCount
          </a>
        </p>
      </footer>
    </div>
  );
};

export { formatTransactionValue };
export default LookUp;