import Arweave from 'arweave';
import {
    createContractFromTx,
    selectWeightedPstHolder,
    readContract,
} from 'smartweave';
import { nanoid } from 'nanoid';
import Geohash from '@geonet/geohash';
import { and, or, equals } from 'arql-ops';
import React from 'react';
import { KeyfileLogin } from './KeyfileLogin';
import { getNonzoneEnv } from '../config';

const isProduction = getNonzoneEnv() === 'production';
const appName = isProduction ? 'Non-Zone' : 'NonZone-Test';

const prodPST = 'HY90ZjK1tAxlm_Shau7hAJNH0jPmLCYqejERjVQ0MGw';
const testPST = 'iIgf7-B9bRLGpP6ccQjJV0Kv2J2ogCBJL3mx1Sf0ns0';
// used for tipping Nonzone app shareholders
const nonzonePSTContractId = isProduction ? prodPST : testPST;

const nonzonePublicWalletAddress =
    '35a5He4pYjHIlgWMDVj23IQFnGvV5UMavjgL5FpdyTg';

// used for creating Stories PST contracts
const arweaveSourcePSTContract = 'ff8wOKWGIS6xKlhA8U6t70ydZOozixF5jQMp4yjoTc8';

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
});
const initialTags = {
    'App-Name': appName,
    'App-Version': '0.0.1',
};

export const Login = ({ onCancel, onSignedIn }) => (
    <KeyfileLogin
        onCancel={onCancel}
        onFileUpload={async (file) => {
            try {
                await signInWithFile(file);
                onSignedIn();
            } catch (err) {
                console.error(err);
            }
        }}
    />
);

const getWallet = () => JSON.parse(window.sessionStorage.getItem('wallet'));

const getContractInitialState = (userAddress, ticker) => ({
    ticker,
    balances: {
        [userAddress]: 9000000,
        [nonzonePublicWalletAddress]: 1000000,
    },
});

const assertValidObject = (obj) => {
    const { title, description, loc } = obj;
    if (!title || !description || !loc || !loc.latitude || !loc.longitude)
        throw new Error('Invalid object');
};

const filterEmpty = (arr) => arr.filter((it) => !!it);

/** *
 * kind: memory|search|story
 * type: story|place
 * loc: {latitude: number, longitude: number}
 */
export const publishObject = async ({
    id,
    kind,
    type,
    loc,
    uid,
    title = '',
    description = '',
    image = null,
    version,
}) => {
    console.log('save object', loc, title, description);
    if (!uid) throw new Error('uid empty');
    if (!loc || !(loc.latitude || loc.longitude))
        throw new Error('Coordinates are not detected');

    const timestamp = new Date().toISOString();
    const nonzoneId = id || nanoid();
    const tags = {
        ...initialTags,
        'Nonzone-Id': nonzoneId,
        'Nonzone-Author': uid,
        'Nonzone-Type': type,
        'Nonzone-Kind': kind,
        'Nonzone-Status': 'published',
        Version: version ? version + 1 : 1,
        // 'Content-Type': 'text/html',
        'Content-Type': 'application/json',
        Timestamp: timestamp,
    };
    let precision = 10;
    const geohash = Geohash.encode(loc.longitude, loc.latitude, precision);
    for (; precision >= 1; --precision) {
        tags[`Geohash-${precision}`] = geohash.substr(0, precision);
    }

    const data = {
        loc,
        title,
        description: description || '',
        image,
    };

    assertValidObject(data);

    const key = getWallet();
    if (!key) throw new Error('Wallet must be set');

    if (!id) {
        data.created = timestamp;

        // Create PST contract
        const address = await arweave.wallets.jwkToAddress(key);
        const initState = getContractInitialState(
            address,
            `NONZONE_STORY_${nonzoneId}`
        );
        const contractId = await createContractFromTx(
            arweave,
            key,
            arweaveSourcePSTContract,
            JSON.stringify(initState)
        );
        console.log('Created contract', contractId, initState);
        tags['Nonzone-Contract-Id'] = contractId;
    }

    console.log('post', key, tags, data);

    // '<html><head><meta charset="UTF-8"><title>Hello, world!</title></head><body><div>Hello, world!</div></body></html>',
    let transaction = await arweave.createTransaction(
        {
            data: JSON.stringify(data),
        },
        key
    );
    for (const [key, value] of Object.entries(tags)) {
        transaction.addTag(key, value);
    }
    console.log('Transaction:', transaction);
    await arweave.transactions.sign(transaction, key);
    console.log('Signed:', transaction);

    const response = await arweave.transactions.post(transaction);

    console.log('Response:', response);
    // HTTP response codes (200 - ok, 400 - invalid transaction, 500 - error)
    if (response.status >= 200 && response.status < 300) {
        return nonzoneId;
    }
    throw new Error(response.statusText);

    // let uploader = await arweave.transactions.getUploader(transaction);
    // console.log('Got uploader');

    // while (!uploader.isComplete) {
    //     await uploader.uploadChunk();
    //     console.log(
    //         `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    //     );
    // }
    // console.log('Completed');
};

export const saveObject = async (id, data) => {
    throw new Error('Not implemented');
    // return firebase.database().ref(`/objects/`).child(id).update(data);
};
const getName = (tag) => tag?.get('name', { decode: true, string: true });
const getVal = (tag) => tag?.get('value', { decode: true, string: true });

const restoreTagsInfo = {
    id: 'Nonzone-Id',
    uid: 'Nonzone-Author',
    type: 'Nonzone-Type',
    kind: 'Nonzone-Kind',
    status: 'Nonzone-Status',
    version: 'Version',
    timestamp: 'Timestamp',
    contractId: 'Nonzone-Contract-Id',
};

export const loadObjectByTxId = async (txId) => {
    console.log('loadObjectByTxId', txId);
    try {
        const tx = await arweave.transactions.get(txId);

        const dataStr = await arweave.transactions.getData(txId, {
            decode: true,
            string: true,
        });
        const data = JSON.parse(dataStr);
        const tagsObj = {};
        for (const tag of tx.tags) {
            // const name = tag.getName()
            tagsObj[getName(tag)] = tag;
        }
        for (const key in restoreTagsInfo) {
            data[key] = getVal(tagsObj[restoreTagsInfo[key]]) || '';
        }
        if (data.status === 'published') data.published = true;
        console.log(data, tagsObj);
        console.log(
            Object.entries(tagsObj).map(([key, tag]) => [key, getVal(tag)])
        );

        assertValidObject(data);

        return data;
    } catch (err) {
        console.log(
            'Error loading',
            txId,
            err,
            err.message,
            JSON.stringify(err)
        );
        return null;
    }
};

const loadObjectById = async (id) => {
    console.log('loadObjectById', id);
    const query = and(equals('App-Name', appName), equals('Nonzone-Id', id));

    const txids = await arweave.arql(query);
    console.log('txids', txids);
    if (!txids?.length) return null;

    const objects = await Promise.all(txids.map((id) => loadObjectByTxId(id)));
    console.log('objects', objects);
    return filterEmpty(objects)[0];
};
export const subscribeToObjectById = (id, onData, onError) => {
    loadObjectById(id).then(onData).catch(onError);
    return () => {}; // dummy unsub
};

const generateHashes = (bounds, precision) => {
    return new Promise((done) => {
        const hashes = [];
        new Geohash.GeohashStream({ ...bounds, precision })
            .on('data', (d) => hashes.push(d.toString()))
            .on('end', () => done(hashes));
    });
};
const detectPrecisionAndHashes = async (bounds) => {
    let prevHashes;
    for (let precision = 1; precision <= 10; ++precision) {
        const hashes = await generateHashes(bounds, precision);
        console.log(hashes);
        if (hashes.length > 10)
            return { hashes: prevHashes, precision: precision - 1 };
        prevHashes = hashes;
    }
};

const loadObjectsByRegion = async (bounds) => {
    console.log('Load data by region', bounds);
    const { hashes, precision } = await detectPrecisionAndHashes(bounds);

    const geohashName = `Geohash-${precision}`;
    const query = and(
        equals('App-Name', appName),
        or(...hashes.map((hash) => equals(geohashName, hash)))
    );
    console.log(query);
    const txids = await arweave.arql(query);
    console.log('txids', txids);
    if (!txids?.length) return [];

    const objects = await Promise.all(txids.map((id) => loadObjectByTxId(id)));
    console.log('objects', objects);
    return filterEmpty(objects);
};
export const subscribeToObjectsByRegion = (bounds, onData, onError) => {
    loadObjectsByRegion(bounds).then(onData).catch(onError);
    return () => {}; // dummy unsub
};

export const loadTipInfoByTxId = async (txId) => {
    console.log('loadTipInfoByTxId', txId);
    try {
        const tx = await arweave.transactions.get(txId);
        // console.log('tip tx:', tx);

        if (!tx.target || !tx.quantity) throw new Error('Invalid object');

        return tx;
    } catch (err) {
        console.log(
            'Error loading',
            txId,
            err,
            err.message,
            JSON.stringify(err)
        );
        return null;
    }
};

const loadObjectAdditionalData = async (objectId) => {
    console.log(
        'subscribeToObjectAdditionalData - load once tips for object',
        objectId
    );

    const query = and(
        equals('App-Name', appName),
        equals('Nonzone-Ref-Id', objectId),
        equals('Nonzone-Type', 'tip')
    );

    const txids = await arweave.arql(query);
    console.log('subscribeToObjectAdditionalData tips txids', txids);
    if (!txids?.length) return null;

    const data = await Promise.all(txids.map((id) => loadTipInfoByTxId(id)));
    console.log('Object', objectId, 'tip transactions:', data);
    const validTipsArr = filterEmpty(data);
    if (!validTipsArr.length) return null;
    const ownerPublicAddresses = await Promise.all(
        validTipsArr.map((tx) => arweave.wallets.ownerToAddress(tx.owner))
    );
    const tips = validTipsArr.reduce((obj, it, idx) => {
        obj[it.id] = {
            amount: arweave.ar.winstonToAr(it.quantity),
            ts: '', // not sure if possible to extract some sort of timestamp
            uid: ownerPublicAddresses[idx],
        };
        return obj;
    }, {});
    console.log('Object', objectId, 'additional tips data:', tips);
    return { tips };
};
export const subscribeToObjectAdditionalData = (objectId, onData, onError) => {
    loadObjectAdditionalData(objectId).then(onData).catch(onError);
    return () => {};
};

export const loadObjectsByUser = async (uid, publishedOnly = true) => {
    console.log('loadObjectsByUser', uid);

    const query = and(
        equals('App-Name', appName),
        equals('Nonzone-Author', uid),
        equals('Nonzone-Type', 'story')
    );

    const txids = await arweave.arql(query);
    console.log('txids', txids);
    if (!txids?.length) return null;

    const objects = await Promise.all(txids.map((id) => loadObjectByTxId(id)));
    console.log('user objects', objects);
    return filterEmpty(objects);
};

export const saveProfile = null; // TODO

const wallet2data = async (wallet) => {
    const address = await arweave.wallets.jwkToAddress(wallet);
    console.log('JWK', { wallet, address });
    const balanceWinston = await arweave.wallets.getBalance(address);
    const balance = arweave.ar.winstonToAr(balanceWinston);
    const user = {
        uid: address,
        photoURL: 'user.jpg',
    };
    const profile = {
        nickname: address, // temp
    };
    return { user, balance, profile };
};

let refreshUserDataCb;

export const subscribeToUserService = async (cb) => {
    refreshUserDataCb = cb;
    console.log('Check wallet');
    const walletStr = sessionStorage.getItem('wallet');
    if (walletStr) {
        console.log('Found stored wallet', walletStr);
        try {
            const wallet = JSON.parse(walletStr);
            const data = await wallet2data(wallet);
            return cb(data);
        } catch (err) {
            cb(null, err);
        }
    } else {
        cb(null);
    }
};
export const checkInitialBalance = () => {
    // noop
};

export const signInWithFile = async (wallet) => {
    try {
        const data = await wallet2data(wallet);
        sessionStorage.setItem('wallet', JSON.stringify(wallet));
        refreshUserDataCb(data);
    } catch (err) {
        refreshUserDataCb(null, err);
    }
};

export const signOut = () => {
    sessionStorage.removeItem('wallet');
    refreshUserDataCb(null);
};

export const getCurrency = () => 'AR';
export const getPublishPrice = async (data) => {
    const enc = JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
    });
    // just in case add a bit more, somehow the actual transaction data is bigger than this
    const size = 64 + arweave.utils.stringToBuffer(enc).byteLength;
    const price = await arweave.transactions.getPrice(size);
    console.log('Size:', size);
    console.log('Price (winston):', price);
    console.log('Price (AR):', arweave.ar.winstonToAr(price));
    return arweave.ar.winstonToAr(price);
};
export const isPrepublishSupported = () => false;

export const sendTip = async (contractId, amountAR, refId) => {
    console.log('send tip', { contractId, amount: amountAR });
    const key = getWallet();
    if (!key) throw new Error('Wallet must be set');

    const contract = await readContract(arweave, contractId);
    // pick up one of story's PST shareholders
    let target = selectWeightedPstHolder(contract.balances);
    console.log('selectWeightedPstHolder:', target);

    if (target === nonzonePublicWalletAddress) {
        console.log('target is NonZone app, select one of its shareholders');
        // if the shareholder is nonzone app, pick one of nonzone app PST shareholders
        const nonzonePSTContract = await readContract(
            arweave,
            nonzonePSTContractId
        );
        target = selectWeightedPstHolder(nonzonePSTContract.balances);
        console.log('App PST selectWeightedPstHolder:', target);
    }

    const quantity = arweave.ar.arToWinston(amountAR);

    const tags = {
        ...initialTags,
        'Nonzone-Type': 'tip',
        'Nonzone-Ref-Id': refId,
    };
    const data = {
        target,
        quantity,
    };

    console.log('post', key, tags, data);

    // '<html><head><meta charset="UTF-8"><title>Hello, world!</title></head><body><div>Hello, world!</div></body></html>',
    let transaction = await arweave.createTransaction(data, key);
    for (const [key, value] of Object.entries(tags)) {
        transaction.addTag(key, value);
    }
    console.log('Transaction:', transaction);
    await arweave.transactions.sign(transaction, key);
    console.log('Signed:', transaction);

    const response = await arweave.transactions.post(transaction);

    console.log('Response:', response);
    // HTTP response codes (200 - ok, 400 - invalid transaction, 500 - error)
    if (response.status >= 200 && response.status < 300) {
        return transaction.id;
    }
    throw new Error(response.statusText);
};

export const subscribeToMyTips = async (uid, onData, onError) => {
    console.log('subscribeToMyTips', uid);
    const query = and(
        equals('App-Name', appName),
        equals('Nonzone-Type', 'tip'),
        equals('Nonzone-Author', uid)
    );

    const txids = await arweave.arql(query);
    console.log('txids', txids);
    if (!txids?.length) return null;

    const objects = await Promise.all(txids.map((id) => loadObjectByTxId(id)));
    console.log('my tips', objects);
    return filterEmpty(objects);
};

export const likeObject = null; // currently not supported

export const leaveComment = null; // currently not supported

export const bookmarkObject = null; // currently not supported
export const clearBookmarkObject = null; // currently not supported
export const subcribeToUserBookmarks = null; // currently not supported
