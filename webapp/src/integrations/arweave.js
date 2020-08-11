import Arweave from 'arweave';
import { nanoid } from 'nanoid';
import Geohash from '@geonet/geohash';
import { and, or, equals } from 'arql-ops';

const arweave = Arweave.init();
const appName = 'NonZone-Test';
const initialTags = {
    'App-Name': appName,
    'App-Version': '0.0.1',
};

const getWallet = () =>
    JSON.parse(window.sessionStorage.getItem('arweave_wallet'));

/** *
 * kind: story|place
 * type: memory|search|story
 * loc: {latitude: number, longitude: number}
 */
const saveObject = async ({
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
    const tags = {
        ...initialTags,
        'Nonzone-Id': id || nanoid(),
        'Nonzone-Author': uid,
        'Nonzone-Type': kind,
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
        // uid,
        // kind,
        kind: type,
        loc,
        title,
        description: description || '',
        image,
    };
    if (!id) {
        data.created = timestamp;
    }
    const key = getWallet();

    console.log('post', key, tags, data);
    // return 0;

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
        return tags['Nonzone-Id'];
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

const savePartialObject = async (id, data) => {
    throw new Error('Not implemented');
    // return firebase.database().ref(`/objects/`).child(id).update(data);
};
const getName = (tag) => tag?.get('name', { decode: true, string: true });
const getVal = (tag) => tag?.get('value', { decode: true, string: true });

const restoreTagsInfo = {
    id: 'Nonzone-Id',
    uid: 'Nonzone-Author',
    kind: 'Nonzone-Type',
    status: 'Nonzone-Status',
    version: 'Version',
    timestamp: 'Timestamp',
};

const loadObjectByTxId = async (txId) => {
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
            data[key] = getVal(tagsObj[restoreTagsInfo[key]]) || 'n/a';
        }
        console.log(data, tagsObj);

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
    return objects[0];
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
    return objects.filter((o) => !!o);
};
const loadObjectsByUser = async (uid, publishedOnly = true) => {
    // TODO
    return [];
};

const saveProfile = async (uid, data) => {
    if (!uid) throw new Error('uid empty');
    // TODO
    throw new Error('Not implemented');
};

export default {
    saveObject,
    savePartialObject,
    loadObjectById,
    loadObjectsByRegion,
    loadObjectsByUser,
    saveProfile,
};