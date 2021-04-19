import { ethers } from 'ethers';
import * as SecureStore from 'expo-secure-store';

import {
    sendAddress
} from 'nonzone-lib';

export async function createWallet() {
    const result = await SecureStore.getItemAsync('wallet');
    console.log(result);
    if(!result) {
        const wallet = await ethers.Wallet.createRandom();
        result.address = wallet.address;
        await SecureStore.setItemAsync('wallet', JSON.stringify({
            mnemonic: wallet.mnemonic.phrase,
            address: wallet.address,
            privateKey: wallet.privateKey,
        }));
        sendAddress(wallet.address)
    }

}


export async function deleteWallet() {
    await SecureStore.deleteItemAsync('wallet');
    await SecureStore.deleteItemAsync('wallet2');
}


export async function getWallet() {
    const result = await SecureStore.getItemAsync('wallet');
    console.log(result);
    if (result) {
        return JSON.parse(result);
    } else {
        throw Error('Wallet not created yet!');
    }
}
