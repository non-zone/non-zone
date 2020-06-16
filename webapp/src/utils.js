const LAST_LOCATION_NAME = 'nonzone-last-location';
export const storeLastLocation = (loc) => {
    window.localStorage.setItem(LAST_LOCATION_NAME, JSON.stringify(loc));
};
export const restoreLastLocation = () => {
    const locStr = window.localStorage.getItem(LAST_LOCATION_NAME);
    return locStr ? JSON.parse(locStr) : null;
};
