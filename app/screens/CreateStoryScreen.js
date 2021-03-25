import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { createStory } from '../contracts';
import {
    Input,
    Button,
    Image,
    Icon,
    Text,
    ButtonGroup,
} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Biconomy } from "@biconomy/mexa";

import {
    saveObject,
    publishObject,
    useAuth,
    uploadToCloudinary,
    uploadJSON
} from 'nonzone-lib';

import { useWalletConnect } from "react-native-walletconnect";
import WalletScreen from './WalletScreen';
import Colors from '../constants/Colors'
import { ethers } from 'ethers';

const { width } = Dimensions.get('window');

let config = {
    contract: {
        address: "0x880176EDA9f1608A2Bf182385379bDcC1a65Dfcf",
        abi: [{ "inputs": [{ "internalType": "string", "name": "newQuote", "type": "string" }], "name": "setQuote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_forwarder", "type": "address" }], "name": "setTrustedForwarder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "forwarder", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "getQuote", "outputs": [{ "internalType": "string", "name": "currentQuote", "type": "string" }, { "internalType": "address", "name": "currentOwner", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "forwarder", "type": "address" }], "name": "isTrustedForwarder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "quote", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedForwarder", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "versionRecipient", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }]
    },
    apiKey: {
        test: "cNWqZcoBb.4e4c0990-26a8-4a45-b98e-08101f754119",
        prod: "8nvA_lM_Q.0424c54e-b4b2-4550-98c5-8b437d3118a9"
    }
}
export default function CreateStoryScreen({ route, navigation }) {
    const position = route.params;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const { user } = useAuth();
    let [kindIndex, setKindIndex] = useState(0);
    const [userAddress, setUserAddress] = useState('0x2CEF62C91Dd92FC35f008D1d6Ed08EADF64306bc');
    const [contractInterface, setContractInterface] = useState();


    useEffect(() => {
        const getPermission = async () => {
            if (Constants.platform.ios) {
                const { status } = await Permissions.askAsync(
                    Permissions.CAMERA_ROLL
                );
                if (status !== 'granted') {
                    alert(
                        'Sorry, we need camera roll permissions to make this work!'
                    );
                }
            }
            if (Constants.platform.android) {
                const { status } = await Permissions.askAsync(
                    Permissions.CAMERA
                );
                if (status !== 'granted') {
                    alert(
                        'Sorry, we need camera permissions to make this work!'
                    );
                }
            }


        };

        const biconomySetup = async () => {
            const biconomy = new Biconomy(jsonRpcProvider, {
                walletProvider: window.ethereum,
                apiKey: config.apiKey.prod,
                debug: true
            });

            // We're creating biconomy provider linked to your network of choice where your contract is deployed
            let jsonRpcProvider = new ethers.providers.JsonRpcProvider("https://kovan.infura.io/v3/d126f392798444609246423b06116c77");

            const userAddress = '0x2CEF62C91Dd92FC35f008D1d6Ed08EADF64306bc'
            setUserAddress(userAddress);

            biconomy.onEvent(biconomy.READY, async () => {

                // Initialize your dapp here like getting user accounts etc
                contract = new ethers.Contract(
                    config.contract.address,
                    config.contract.abi,
                    biconomy.getSignerByAddress(userAddress)
                );

                const contractInt = new ethers.utils.Interface(config.contract.abi);
                setContractInterface(contractInt);
                // getQuoteFromNetwork();
            }).onEvent(biconomy.ERROR, (error, message) => {
                // Handle error while initializing mexa
                console.log(message);
                console.log(error);
            });
        }
        getPermission();
        biconomySetup();
    }, []);

    const createNFT = async (address, props) => {
        createStory(
            address,
            props,
            true
        );
    }

    const _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
                base64: true,
            });
            if (!result.cancelled) {
                setImage('data:image/jpeg;base64,' + result.base64);
            }
        } catch (E) {
            console.log(E);
        }
    };

    const _captureImage = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
                base64: true,
            });
            if (!result.cancelled) {
                setImage('data:image/jpeg;base64,' + result.base64);
            }
        } catch (E) {
            console.log(E);
        }
    };

    const _saveStory = async (address) => {
        if (image) {
            const uploadedImage = await uploadToCloudinary(image);

            const data = {
                id: null,
                kind: kindIndex == 0 ? 'memory' : 'fiction',
                type: 'story',
                loc: position,
                uid: user.uid,
                title,
                description,
                image: uploadedImage.secure_url,
            };

            const json = await uploadJSON({
                name: title,
                description,
                image: uploadedImage.secure_url,
                lat: position.latitude,
                long: position.longitude,
                isMemory: kindIndex == 0
            });
            await createNFT(address, json.url)

            const id = await saveObject(data);
            data.id = id;
            await publishObject(data);

            if (id) {
                alert('Story saved!');
                navigation.navigate('MapScreen');
            } else {
                alert('something went wrong!');
            }
        }
    };

    const {
        createSession,
        session,
        signTransaction
    } = useWalletConnect();
    const address = session[0].accounts[0];


    const callContract = async () => {
        let functionSignature = contractInterface.encodeFunctionData("setQuote", [newQuote]);

        let rawTx = {
            to: config.contract.address,
            data: functionSignature,
            from: userAddress
        };

        let signedTx = await signTransaction(rawTx);
        // should get user message to sign for EIP712 or personal signature types
        const forwardData = await biconomy.getForwardRequestAndMessageToSign(signedTx);
        console.log(forwardData);

        let data = {
            signature: signature,
            forwardRequest: forwardData.request,
            rawTransaction: signedTx,
            signatureType: biconomy.EIP712_SIGN,
        };

        let provider = biconomy.getEthersProvider();
        // send signed transaction with ethers
        // promise resolves to transaction hash                  
        let txHash = await provider.send("eth_sendRawTransaction", [data]);
        showInfoMessage(`Transaction sent. Waiting for confirmation ..`)
        let receipt = await provider.waitForTransaction(txHash);
        setTransactionHash(txHash);
        showSuccessMessage("Transaction confirmed on chain");
        console.log(receipt);
    }
    return user ? (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon
                        size={24}
                        name="close"
                        color="white"
                        style={{ marginRight: 10 }}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Title: Between 3 and 5 words"
                        inputStyle={{ color: Colors.background }}
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                    <Input
                        placeholder="Description"
                        inputStyle={{
                            color: Colors.background,
                            textAlignVertical: 'top',
                            paddingTop: 0,
                        }}
                        inputContainerStyle={{
                            borderBottomColor: 'transparent',
                        }}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        multiline
                        numberOfLines={10}
                        maxLength={600}
                    />
                    <Text
                        style={{
                            color: Colors.tintColor,
                            textAlign: 'right',
                            marginRight: 10,
                            fontSize: 11,
                        }}
                    >
                        {600 - description.length + ' characters left'}
                    </Text>
                </View>
                <View style={styles.buttonBox}>
                    <Button
                        containerStyle={{ flex: 1, paddingRight: 5 }}
                        buttonStyle={{ backgroundColor: 'white' }}
                        titleStyle={{ color: 'black' }}
                        icon={{ name: 'folder', size: 30, color: 'black' }}
                        title="Browse"
                        onPress={_pickImage}
                    />
                    <Button
                        containerStyle={{ flex: 1, paddingLeft: 5 }}
                        buttonStyle={{ backgroundColor: 'white' }}
                        titleStyle={{ color: 'black' }}
                        icon={{ name: 'camera-alt', size: 30, color: 'black' }}
                        title="Capture"
                        onPress={_captureImage}
                    />
                </View>

                <Text
                    style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}
                >
                    Story type
                </Text>

                <ButtonGroup
                    buttons={['#Memory', '#Fiction']}
                    buttonStyle={{
                        backgroundColor: '#00404C',
                        borderRadius: 5,
                    }}
                    textStyle={{ color: '#F2F6FC' }}
                    selectedButtonStyle={{
                        backgroundColor: 'white',
                        borderRadius: 5,
                    }}
                    selectedTextStyle={{ color: '#8D8D8F' }}
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        width: '100%',
                        alignSelf: 'center',
                    }}
                    innerBorderStyle={{ width: 10, color: 'transparent' }}
                    selectedIndex={kindIndex}
                    onPress={(selectedIndex) => setKindIndex(selectedIndex)}
                />

                {image && (
                    <Image
                        source={{ uri: image }}
                        style={{
                            height: 244,
                            width: width - 20,
                            resizeMode: 'contain',
                        }}
                    />
                )}
                <Button
                    title="Publish"
                    buttonStyle={{
                        backgroundColor: Colors.tintColor,
                        width: '50%',
                        alignSelf: 'center',
                        marginVertical: 20,

                    }}
                    disabled={session[0].accounts[0] == undefined}
                    onPress={() => _saveStory(session[0].accounts[0])}

                />
                <Button
                    title="Connect wallet"
                    buttonStyle={{
                        backgroundColor: Colors.tintColor,
                        width: '50%',
                        alignSelf: 'center',
                        marginVertical: 20,
                    }}
                    disabled={session[0].accounts[0] !== undefined}
                    onPress={callContract}
                />

            </ScrollView>
        </View>
    ) : (
        <WalletScreen />
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.tintBackground,
        flex: 1,
    },
    contentContainer: {
        marginHorizontal: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    description: {
        marginVertical: 10,
    },
    inputContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 10,
    },
    buttonBox: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },
});
