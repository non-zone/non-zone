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
