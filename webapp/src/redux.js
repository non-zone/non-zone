import { createStore } from 'redux';

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'USER':
            return { ...state, user: payload };
        case 'BALANCE':
            return { ...state, balance: payload };
        case 'PROFILE':
            return { ...state, profile: payload };
        default:
            return state;
    }
};

const initial = {
    user: undefined,
    wallet: undefined,
};

export const store = createStore(reducer, initial);
