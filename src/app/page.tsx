"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletProvider } from "@suiet/wallet-kit";
import {ConnectButton} from '@suiet/wallet-kit';
import "@suiet/wallet-kit/style.css";


const App: React.FC = () => {
    const router = useRouter();

    const handleStartClick = () => {
        router.push('/step2');
    };

    return (
        <WalletProvider>
            <html lang="en">
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title></title>
                    <script src="https://cdn.tailwindcss.com"></script>
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
                                    <ConnectButton/>
                                </div>
                                <img src="/logo.png" alt="Logo" className="logo" />
                                <li className="bg-blue-500 text-white px-4 py-2 rounded-md">Step 1: Start</li>
                                <li>Step 2: Avatar Image</li>
                                <li>Step 3: Audio</li>
                                <li>Step 4: Preview</li>
                            </ul>
                        </div>
                        <div className="w-3/4 flex flex-col items-center container">
                            <h1 className="text-6xl font-bold mb-8">Campaign theme: "Zero Knowledge"</h1>
                            <h3 className="text-2xl mb-8">Let's create an engaging Talking Avatar video of it</h3>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-8 mt-8" onClick={handleStartClick}>
                                Start
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-8 mt-8" onClick={handleStartClick}>
                               Check Req
                            </button>
                        </div>
                    </div>
                </body>
            </html>
        </WalletProvider>
    );
};

export default App;
