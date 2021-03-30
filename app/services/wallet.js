import { ethers } from 'ethers';
import * as SecureStore from 'expo-secure-store';

export async function createWallet() {
    const result = await SecureStore.getItemAsync('wallet');
    if (!result) {
        const wallet = await ethers.Wallet.createRandom();
        await SecureStore.setItemAsync('wallet', JSON.stringify({
            mnemonic: wallet.mnemonic.phrase,
            addresdispatchs: wallet.address,
            privateKey: wallet.privateKey,
        }));
    }
}


export async function getWallet() {
    const result = await SecureStore.getItemAsync('wallet');
    if (result) {
        return JSON.parse(result);
    } else {
        throw Error('Wallet not created yet!');
    }
}
