"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackendAPI } from '../utils/backend';
import { formatAddress } from '@mysten/sui.js/utils';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import { WalletKitProvider } from '@mysten/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const sleep = (milliseconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

function ConnectToWallet() {
  const { currentAccount } = useWalletKit();
  console.log(currentAccount);

  // Check if currentAccount exists before accessing its properties
  const connectedText = currentAccount ? `Connected: ${formatAddress(currentAccount.address)}` : 'Connect Wallet';
  return (
    <ConnectButton
      connectText={'Connect Wallet'}
      connectedText={connectedText}
    />
  );
}

const Step5: React.FC = () => {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [finishGenerate, setFinishGenerated] = useState<boolean>(false);
    const { signAndExecuteTransactionBlock } = useWalletKit();

    const handleStartClick = () => {
      router.push('/step2');
    };
  
    const handleSaveClick = () => {
      
    };
    
    const sendTransaction = async () => {
        const tx = new TransactionBlock();
        tx.moveCall({
          target: '0x2::devnet_nft::mint',
          arguments: [
            tx.pure.string('some name'),
            tx.pure.string('some description'),
            tx.pure.string(
              'https://cdn.britannica.com/94/194294-138-B2CF7780/overview-capybara.jpg?w=800&h=450&c=crop',
            ),
          ],
        });
        await signAndExecuteTransactionBlock({ transactionBlock: tx });
      };

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
    <WalletKitProvider>
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
                  <ConnectToWallet />
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
                  <button
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={sendTransaction}
                  >
                    Mint NFT
                  </button>
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
    </WalletKitProvider>
    );
  };
  
  export default Step5;
  