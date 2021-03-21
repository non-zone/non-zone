
import '@ethersproject/shims';

import { ethers } from 'ethers';

import Wallet from '../constants/wallet';

const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-mainnet.maticvigil.com/v1/e1f46c82a85057bf8ea6c4e20e7ce2584a61954a'
  );

// Wallet connected to a provider
const senderWalletMnemonic = ethers.Wallet.fromMnemonic(
  Wallet.mnemonic,
  "m/44'/60'/0'/0/0"
);

let signer = senderWalletMnemonic.connect(provider);

export { provider, ethers, signer };