import colors from './Colors';

export const navigationTheme = {
    dark: false,
    colors: {
        primary: colors.tintColor,
        background: colors.background,
        card: colors.background,
        text: colors.tintColor,
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
};
