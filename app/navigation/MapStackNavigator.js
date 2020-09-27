import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Icon } from 'react-native-elements';

import WalletScreen from '../screens/WalletScreen';
import MapScreen from '../screens/MapScreen';
import ShowStoryScreen from '../screens/ShowStoryScreen';
import CreateStoryScreen from '../screens/CreateStoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Map';

export default function MapStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName={INITIAL_ROUTE_NAME}
            screenOptions={{
                headerBackImage: () => <Icon name="arrow-back" color="white" />,
            }}
        >
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
                    headerShown: false,
                })}
            />
            <Stack.Screen
                name="WalletScreen"
                component={WalletScreen}
                options={{
                    title: 'Zone Wallet',
                }}
            />
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                }}
            />
        </Stack.Navigator>
    );
}
