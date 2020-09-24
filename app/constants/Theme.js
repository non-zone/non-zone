import colors from './Colors';

export const navigationTheme = {
    dark: true,
    colors: {
        primary: colors.tintColor,
        background: colors.background,
        card: colors.background,
        text: colors.textColor,
        border: colors.background,
        notification: colors.tintColor,
    },
};

export const generalTheme = {
    Text: {
        style: {
            color: colors.textColor,
            fontSize: 14,
        },
    },
    Button: {
        titleStyle: {
            color: 'white',
        },
        buttonStyle: {
            backgroundColor: colors.tintColor,
            marginTop: 10,
        },
    },
    Input: {
        inputStyle: {
            color: colors.textColor,
        },
    },
};
