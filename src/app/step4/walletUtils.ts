import React from 'react';
import { useWalletKit } from '@mysten/wallet-kit';




function Page() {
  const { signAndExecuteTransactionBlock } = useWalletKit();

  const sendTransaction = async () => {
    const { signAndExecuteTransactionBlock } = useWalletKit();
    console.log("start send transaction")
    const tx = new TransactionBlock();
    const NFT_address = "0xb56e1e0d840dadb7e7f45d6f8e638ac6bc9f9dfc2e0bc2d4171cfcdd72eadd00";
    tx.moveCall({
      target: `${NFT_address}::avatar::mint`,
      arguments: [
        tx.pure.string('testing'),
        tx.pure.string('testing 2'),
        tx.pure.string(
          'https://firebasestorage.googleapis.com/v0/b/ethtaipeihackathon.appspot.com/o/resources%2F0x4096d557ccaC4fDb47DAF862DF66fc7456e9ce36-1711252497751?alt=media&token=d119b19c-1038-4b26-8c90-8035ffaeec9e',
        ),
      ],
    });
    const result = await signAndExecuteTransactionBlock({ transactionBlock: tx });
    console.log(result)
  };

  return (
    <div>
      <button onClick={sendTransaction}>发送交易</button>
    </div>
  );
}

export default Page;