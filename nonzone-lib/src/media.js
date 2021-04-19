export const uploadToCloudinary = (
    image,
    preset = 'gallery_preset',
    cloudName = 'non-zone'
) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var data = new FormData();
    data.append('file', image);
    data.append('upload_preset', preset);
    data.append('cloud_name', cloudName);
    return fetch(url, {
        method: 'POST',
        body: data,
    }).then((res) => res.json());
};
export const uploadToTextile = (
    image
) => {
    var url = "https://api.non-zone.app/api/nft/image";
    var data = new FormData();
    data.append('image', image);
    return fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((res) => res.json());
}


export const sendAddress = (
    address
) => {
    var url = "https://api.non-zone.app/api/nft/address";
    var data = new FormData();
    return fetch(url, {
        method: 'POST',
        body: address,
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => res.json());
}

export const uploadJSON = async (
    props
) => {
    var url = "https://api.non-zone.app/api/nft";
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(props),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    return json;
}