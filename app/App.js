import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import useCachedResources from './hooks/useCachedResources';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import ShowStoryScreen from './screens/ShowStoryScreen';
import CreateStoryScreen from './screens/CreateStoryScreen';
import MapScreen from './screens/MapScreen';
import WalletScreen from './screens/WalletScreen';

import { AuthProvider } from 'nonzone-lib';

import { YellowBox } from 'react-native';

const Stack = createStackNavigator();

import { ThemeProvider } from 'react-native-elements';
import colors from './constants/Colors';
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
                            <Stack.Navigator>
                                <Stack.Screen
                                    name="MapScreen"
                                    component={MapScreen}
                                    options={{
                                        headerShown: false,
                                        title: 'Map',
                                    }}
                                />
                                <Stack.Screen
                                    name="ShowStory"
                                    component={ShowStoryScreen}
                                    options={() => ({
                                        headerShown: false,
                                    })}
                                />
                                <Stack.Screen
                                    name="CreateStory"
                                    component={CreateStoryScreen}
                                    options={() => ({
                                        title: 'Create story',
                                    })}
                                />
                                <Stack.Screen
                                    name="WalletScreen"
                                    component={WalletScreen}
                                    options={{
                                        title: 'Zone Wallet',
                                    }}
                                />
                            </Stack.Navigator>
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
        backgroundColor: colors.background,
    },
});
