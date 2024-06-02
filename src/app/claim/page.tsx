"use client"
import React, { useState, useEffect } from 'react';
import Script from 'next/script'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useWallet } from '@suiet/wallet-kit';
import { WalletProvider, ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

function Page() {
    const router = useRouter();
    const wallet = useWallet();
    const [tweet, setTweet] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (!wallet.connected) return;
        console.log('connected wallet name: ', wallet.name);
        console.log('account address: ', wallet.account?.address);
        console.log('account publicKey: ', wallet.account?.publicKey);
    }, [wallet.connected]);

    const sleep = (milliseconds: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    const handleStartClick = async () => {
        router.push('../');
    };

    const calculateScore = async () => {
        setLoading(true);
        
        // for demo 
        // const requirement = await axios.post('http://127.0.0.1:8005/check', { tweet });
        
        if (tweet.includes("allen")) {
            try {
                console.log("address", address)
                const response = await axios.post('http://127.0.0.1:8005/claim', { address });
                console.log(response.data);
                setMessage(`Meet requirements, reward has sent to your address : ${address}`);
            } catch (error) {
                setMessage(`Sorry, you didn't meet the requirements!`);
            }
        } else {
            setMessage(`Sorry, you didn't meet the requirements!`);
        }
        setLoading(false);
    };

    const handleTweetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTweet(event.target.value);
        setMessage("");
    };

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
        setMessage("");
    };

    return (
        <WalletProvider>
            <html lang="en">
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Claim Reward</title>
                    <Script src="https://cdn.tailwindcss.com"></Script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
                    <style>{`
                        body {
                            font-family: 'Inter', sans-serif;
                        }
                        .logo {
                            width: 70px;
                            height: 70px;
                            margin-bottom: 5px;
                            margin-left: 0px;
                        }
                        .container {
                            position: relative;
                        }
                    `}</style>
                </head>
                <body className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center">
                    <div className="flex flex-row justify-between items-start w-full px-10">
                        <div className="w-1/4">
                            <ul className="space-y-2">
                                <div>
                                    <ConnectButton />
                                </div>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-8 mt-8" onClick={handleStartClick}>
                                    Back to Start
                                </button>
                            </ul>
                        </div>
                        <div className="w-3/4 flex flex-col items-center container">
                            <h1 className="text-6xl font-bold mb-8">Claim Reward Requirement</h1>
                            <h3 className="text-4xl mb-8">Tweet has at least 1 like</h3>

                            <p>Enter your information</p>
                            {!loading && !message && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Enter your Sui Address"
                                        className="border-2 border-gray-400 rounded px-4 py-2 mb-2 mt-4"
                                        value={address}
                                        onChange={handleAddressChange}
                                        style={{ color: 'black' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Enter your Tweet"
                                        className="border-2 border-gray-400 rounded px-4 py-2 mb-8 mt-4"
                                        value={tweet}
                                        onChange={handleTweetChange}
                                        style={{ color: 'black' }}
                                    />
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-8" onClick={calculateScore}>
                                        Start Analysis
                                    </button>
                                </>
                            )}
                            {loading && <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 mx-auto my-4"></div>}
                            {message && <p className="text-2xl mt-4">{message}</p>}
                        </div>
                    </div>
                </body>
            </html>
        </WalletProvider>
    );
}

export default function App() {
    return (
        <WalletProvider>
            <Page />
        </WalletProvider>
    );
}
