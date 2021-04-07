
import '@ethersproject/shims';

import { ethers } from 'ethers';

import { getWallet } from '../services/wallet';

const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-mainnet.maticvigil.com/v1/e1f46c82a85057bf8ea6c4e20e7ce2584a61954a'
  // 'https://rpc-mumbai.maticvigil.com/v1/e1f46c82a85057bf8ea6c4e20e7ce2584a61954a'
);


async function getSigner() {
  const wallet = await getWallet();
  const senderWalletMnemonic = ethers.Wallet.fromMnemonic(
    'slender elevator work family remain tank bridge multiply cigar enjoy group pear',
    "m/44'/60'/0'/0/0"
  );

  let signer = senderWalletMnemonic.connect(provider);
  return signer;
}

async function getUserAddress() {
  const wallet = await getWallet();
  if (wallet.address)
    return wallet.address
  else
    return wallet.addresdispatchs
}

export { provider, ethers, getSigner, getUserAddress };
