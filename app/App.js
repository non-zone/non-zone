import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import useCachedResources from './hooks/useCachedResources';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import DrawerContent from './components/DrawerContent';

import MapStackNavigator from './navigation/MapStackNavigator';

import { AuthProvider } from 'nonzone-lib';

import { YellowBox } from 'react-native';

const Drawer = createDrawerNavigator();

import { ThemeProvider } from 'react-native-elements';
import Colors from './constants/Colors';
import { navigationTheme, generalTheme } from './constants/Theme';

export default function App() {
    YellowBox.ignoreWarnings(['Setting a timer']);
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <AuthProvider>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" />
                    <ThemeProvider theme={generalTheme}>
                        <NavigationContainer
                            theme={navigationTheme}
                            linking={LinkingConfiguration}
                        >
                            <Drawer.Navigator
                                drawerPosition="right"
                                drawerType="front"
                                drawerContent={(props) => (
                                    <DrawerContent {...props} />
                                )}
                            >
                                <Drawer.Screen
                                    name="Home"
                                    component={MapStackNavigator}
                                />
                            </Drawer.Navigator>
                        </NavigationContainer>
                    </ThemeProvider>
                </View>
            </AuthProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
});
