import React from 'react';
import Layout from '../constants/Layout';
import { Text } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import Line from './Line';
import { useAuth, useMyWallet } from 'nonzone-lib';

function WelcomeBlock() {
    const { user } = useAuth();
    let { balance } = useMyWallet(user?.uid);
    return (
        <View
            style={{
                width: Layout.window.width - 50,
                marginTop: 20,
                marginHorizontal: 25,
            }}
        >
            <Text style={styles.text}>
                Welcome to <Text style={styles.bold}>Non-zone</Text>
            </Text>
            <Text style={styles.text}>
                This is your <Text style={styles.bold}>secret place</Text>, let
                us
                {'\n'}
                make it <Text style={styles.bold}>more personal</Text> for you.
            </Text>
            <Line />

            <Text style={styles.balanceText}>
                Your balance is {balance} SPACE
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        color: Colors.textColor,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.textColor,
    },
    balanceText: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.textColor,
    },
});

export default WelcomeBlock;
