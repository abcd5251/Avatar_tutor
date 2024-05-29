"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackendAPI, uploadToIPFS } from '../utils/backend';
import { useWallet } from '@suiet/wallet-kit';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { WalletProvider, ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

const sleep = (milliseconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };



function Page() {
    const wallet = useWallet();

    useEffect(() => {
      if (!wallet.connected) return;
      console.log('connected wallet name: ', wallet.name)
      console.log('account address: ', wallet.account?.address)
      console.log('account publicKey: ', wallet.account?.publicKey)
    }, [wallet.connected])

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [finishGenerate, setFinishGenerated] = useState<boolean>(false);
    const [twitterAccount, setTwitterAccount] = useState<string>("");
    const [showMintButton, setShowMintButton] = useState<boolean>(false);
    
    const handleTwitterAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const account = event.target.value;
        setTwitterAccount(account);
        setShowMintButton(account !== "");
    };

    const handleStartClick = () => {
      router.push('/step2');
    };
  
    const handleSaveClick = () => {
      
    };
    const sendTransaction = async () => {
        let url_nft = "";
        try {
          const respond = await uploadToIPFS('test');
          url_nft = await respond;
        } catch (error) {
          console.error('Error：', error);
        }
        console.log("Result", url_nft);
        console.log("start send transaction");
        
        const tx = new TransactionBlock();
        const packageObjectId = "0xb56e1e0d840dadb7e7f45d6f8e638ac6bc9f9dfc2e0bc2d4171cfcdd72eadd00";
        tx.moveCall({
          target: `${packageObjectId}::avatar::mint`,
          arguments: [
            tx.pure.string('testing'),
            tx.pure.string('testing 2'),
            tx.pure.string(
              url_nft,
            ),
          ],
        });
        const result = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
        console.log("Sign result", result);
    }

    const handleStartGenerated = async () => {
      setLoading(true);
      
      try {
          const blobData = await BackendAPI.generateAiAvatarVideo({username: 'test'})
          const blob = new Blob([blobData], { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          console.log(url)
          setVideoUrl(url);
      } catch (error) {
          console.error('Error generating audio:', error);
      } finally {
          setFinishGenerated(true)
          setLoading(false);
      }};

  
return (
    <WalletProvider>
      <html lang="en">
      <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Please upload your image</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
          <style>{`
            body {
              font-family: 'Inter', sans-serif;
            }
            .logo {
              width: 70px;  // Set the width of the logo
              height: 70px;  // Maintain aspect ratio
              margin-bottom: 0px;  // Add margin to the bottom
              margin-left: 0px;
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
                <img src="/logo.png" alt="Logo" className="logo" />
                <li>Step 1: Start</li>
                <li>Step 2: Avatar Image</li>
                <li>Step 3: Audio</li>
                <li className="bg-blue-500 text-white px-4 py-2 rounded-md">Step 4: Preview</li>
              </ul>
            </div>
            <div className="w-3/4 flex flex-col items-center">
              <h1 className="text-6xl font-bold mb-8">Here is your AI avatar video</h1>
              {!!videoUrl && <video controls src={videoUrl} className="mb-4" width="480" height="360"/>}
              {!loading && finishGenerate ? (
                <div className="flex justify-center gap-4">
                  <input
                    type="text"
                    placeholder="Enter Twitter Account"
                    className="border-2 border-gray-400 rounded px-4 py-2 mb-4"
                    value={twitterAccount}
                    onChange={handleTwitterAccountChange}
                    />
                    {showMintButton && (
                        <button
                            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={sendTransaction}
                        >
                            Mint NFT
                        </button>
                    )}
                  <button
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={handleSaveClick}
                  >
                    Upload to Twitter
                  </button>
                  <button
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={handleStartClick}
                  >
                    Generate again
                  </button>
                </div>
              ) : !loading && !finishGenerate ? (
                <button
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={handleStartGenerated}
                >
                  Start generated 
                </button>
              ) : (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 mx-auto my-4"></div>
              )}
            </div>
          </div>
        </body>
      </html>
    </WalletProvider>
    );
  };
  
export default function App() {
    return (
      <WalletProvider>
        <Page/>
      </WalletProvider>
    );
  }