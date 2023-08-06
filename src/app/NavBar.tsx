'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import Web3 from 'web3';
import { Connection } from '@solana/web3.js';
import { abi } from './abi/abi.tsx';
import { useRouter } from 'next/navigation';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Add event listener for mouseleave on the nav element
    const handleMouseLeave = () => {
      closeMenu();
    };

    const navElement = document.querySelector('nav');
    navElement?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      navElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSignIn = async (provider: string) => {
    if (['google', 'github', 'discord', 'facebook'].includes(provider)) {
      signIn(provider);
    } else if (['metamask', 'trust', 'phantom', 'coinbase'].includes(provider)) {
      // Crypto wallet sign-in logic here
      if (provider === 'metamask') {
        try {
          if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
            await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
            // Perform actions after the user connects with Metamask
            // You can implement this based on the Web3 library you are using (e.g., ethers.js, web3.js)
            router.push('/home'); // Redirect to home page after successful connection
          } else {
            console.error('Metamask is not installed.');
          }
        } catch (error) {
          console.error('Error connecting with Metamask:', error);
        }
      } else if (provider === 'trust') {
        try {
          if (typeof window.trustwallet !== 'undefined') {
            const web3 = new Web3(window.trustwallet);
            // Requesting the user to connect
            await web3.currentProvider.enable();
            // Perform actions after the user connects (e.g., interacting with contracts)
            // You can implement this based on the Web3 library you are using (e.g., ethers.js, web3.js)
            router.push('/home'); // Redirect to home page after successful connection
          } else {
            console.error('Trust Wallet is not installed.');
          }
        } catch (error) {
          console.error('Error connecting with Trust Wallet:', error);
        }
      } else if (provider === 'phantom') {
        try {
          if (typeof window.solana !== 'undefined') {
            const connection = new Connection('https://api.mainnet-beta.solana.com'); // Replace with the desired Solana network
            // Requesting the user to connect
            const publicKey = await window.solana.connect();
            const publicKeyString = publicKey.toBase58();
            // Perform actions after the user connects (e.g., interacting with Solana contracts)
            // You can implement this based on the @solana/web3.js library
            // Perform actions on the Polygon network (MATIC)
            const polygonWeb3 = new Web3(`https://rpc-mainnet.matic.network`); // Replace with the desired Polygon (MATIC) network
            // Example: Get the accounts on Polygon network
            const polygonAccounts = await polygonWeb3.eth.getAccounts();
            console.log('Connected Polygon Accounts:', polygonAccounts);
            // Example: Interact with a smart contract on Polygon network
            const contractAddress = '0x359c3AD611e377e050621Fb3de1C2f4411684E92'; // Replace with the address of the smart contract on Polygon network
            const contract = new polygonWeb3.eth.Contract(abi, contractAddress);
            // ... Perform contract interactions or other actions on Polygon (MATIC) network
            router.push('/home'); // Redirect to home page after successful connection
          } else {
            console.error('Phantom Wallet is not installed.');
          }
        } catch (error) {
          console.error('Error connecting with Phantom Wallet:', error);
        }
      } else if (provider === 'coinbase') {
        try {
          if (typeof window.web3 !== 'undefined' && window.web3.currentProvider.isCoinbaseWallet) {
            const web3 = new Web3(window.web3.currentProvider);
            // Requesting the user to connect
            await web3.currentProvider.enable();
            // Perform actions after the user connects (e.g., interacting with contracts)
            // You can implement this based on the Web3 library you are using (e.g., ethers.js, web3.js)
            router.push('/home'); // Redirect to home page after successful connection
          } else {
            console.error('Coinbase Wallet is not installed.');
          }
        } catch (error) {
          console.error('Error connecting with Coinbase Wallet:', error);
        }
      } else {
        console.error('Unsupported provider:', provider);
      }
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    if (session) {
      router.push('/home');
    } else {
      router.push('/');
    }
  }, [session, router]);

  const providerImages = {
    google: '/google.svg',
    github: '/github.svg',
    discord: '/discord.svg',
    metamask: '/metamask.png',
    trust: '/trust.png',
    phantom: '/phantom.png',
    coinbase: '/coinbase.png',
  };

  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleMenuItemClick = () => {
    closeMenu();
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <Link href="https://technicallyweb3.com" legacyBehavior>
            <a>
              <img src="/tweb3.png" alt="TechnicallyWeb3" width={50} height={40} />
            </a>
          </Link>
        </div>
        <p className="centered-text">TechnicallyWeb3 dApp</p>
        <div className="menu-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </div>
        {isMenuOpen && (
          <div className="menu-dropdown" onClick={handleMenuItemClick}>
            {session ? (
              <>
                {session.user?.image && (
                  <img src={session.user.image} alt="" width={38} height={38} style={{ borderRadius: '50%' }} />
                )}
                <div>
                  Hello, {capitalizeFirstLetter(session.user.name)}!<br />
                  <br />
                  <br />
                  <Link href="/home" legacyBehavior>
                    <a>
                      <div className="menu-item-container">
                        <img
                          src="/home.jpg"
                          alt="Home"
                          width={24}
                          height={24}
                          style={{ display: 'inline-block', marginLeft: '5px' }}
                        />
                        Home
                      </div>
                    </a>
                  </Link>
                  <li className="home-text">
                    <Link href="/js/profile" legacyBehavior>
                      <a>
                        <div className="menu-item-container">
                          <img
                            src="/profile.jfif"
                            alt="Profile"
                            width={20}
                            height={20}
                            style={{ display: 'inline-block', marginLeft: '8px' }}
                          />
                          Profile
                        </div>
                      </a>
                    </Link>
                  </li>
                  <Link href={'/lookup/lookup'} legacyBehavior>
                    <a>
                      <div className="menu-item-container">
                        <img
                          src="/lookup.png"
                          alt="LookUp"
                          width={20}
                          height={20}
                          style={{ display: 'inline-block', marginLeft: '8px' }}
                        />
                        LookUp
                      </div>
                    </a>
                  </Link>
                </div>

<br />
<h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>Connect Wallet</h1>
<br />
                <div className="menu-group">
                  <ul>
                    {['metamask', 'trust', 'phantom', 'coinbase'].map((wallet) => (
                      <li key={wallet}>
                        <a href="#" onClick={() => handleSignIn(wallet)}>
                          <div className="provider-item">
                            <img src={providerImages[wallet]} alt={wallet} width={24} height={24} />
                            <span>{capitalizeFirstLetter(wallet)}</span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleSignOut}
                    className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50 hover:bg-indigo-600"
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: '0 0 10px black',
                      borderRadius: '20px',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="menu-group">
                  <ul>
                    <li className="home-text">
                      <Link href="/" legacyBehavior>
                        <a>
                          <div className="menu-item-container">
                            <img src="/home.jpg" alt="Home" width={24} height={24} />
                            Home
                          </div>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
<div className="menu-group">
  <ul>
    {['google', 'github', 'discord'].map((provider) => (
      <li key={provider}>
        <a href="#" onClick={() => handleSignIn(provider)}>
          <div className="provider-item">
            <img src={providerImages[provider]} alt={provider} width={24} height={24} />
            <span>{capitalizeFirstLetter(provider)}</span>
          </div>
        </a>
      </li>
    ))}
  </ul>
</div>
              </>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        /* Ensure a consistent padding for the navigation bar */
        nav {
          background-color: transparent;
          padding: 10px;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Center the logo text and adjust its font size */
        .logo {
          font-size: 24px;
          font-weight: bold;
          display: flex;
          align-items: center;
        }

        /* Center the main title and adjust its font size */
        .centered-text {
          text-align: center;
          margin: 0;
          font-size: 20px;
          flex: 1; /* Expand to fill available space */
        }

        /* Increase the clickable area of the menu icon */
        .menu-icon {
          cursor: pointer;
          padding: 10px;
          display: flex;
          align-items: center;
        }

        .home-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: black;
          margin-left: 50px;
        }

        .menu-item-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .menu-dropdown {
          position: absolute;
          top: 70px;
          right: 20px;
          background-color: white;
          border: 1px solid #ddd;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          padding: 10px;
          z-index: 10;
          display: flex;
          flex-direction: column;
        }

        .menu-group {
          display: flex;
        }

        .menu-dropdown li {
          display: flex;
          align-items: center;
        }

        .menu-dropdown a {
          color: #333;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .home-item {
          margin-left: 30px;
          color: black;
        }

        .home-text {
          margin-right: 30px;
          color: black;
        }

        .provider-item {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-left: 5px;
        }

        .menu-group ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        .menu-group li {
          margin-bottom: 8px;
        }

        .menu-group a {
          color: #333;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        /* Use media queries for responsiveness */
        @media (max-width: 600px) {
          .logo {
            font-size: 18px; /* Adjust font size for smaller screens */
          }

          .centered-text {
            font-size: 16px; /* Adjust font size for smaller screens */
          }

          .menu-icon {
            padding: 5px; /* Reduce padding for smaller screens */
          }
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
