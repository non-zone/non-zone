import io from './io';

export * from './auth';
export * from './media';
export * from './object';

export const Login = io.Login;

export const getCurrency = io.getCurrency;
export const getPublishPrice = async (data) => io.getPublishPrice(data);
export const isPrepublishSupported = () => io.isPrepublishSupported();

export const sendTip = (contractId, amount, refId) =>
    io.sendTip(contractId, amount, refId);

export const setBookmarkObject = io.setBookmarkObject;
export const clearBookmarkObject = io.clearBookmarkObject;
export const subcribeToUserBookmarks = io.subcribeToUserBookmarks;
