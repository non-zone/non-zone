import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import WalletScreen from '../screens/WalletScreen';
import MapScreen from '../screens/MapScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Map';

export default function BottomTabNavigator({ navigation, route }) {
    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    navigation.setOptions({
        headerTitle: getHeaderTitle(route),
        headerTransparent: true,
    });

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    title: 'Map',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name="md-map" />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={WalletScreen}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name="md-person" />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
}

function getHeaderTitle(route) {
    const routeName =
        route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Map':
            return null;
        default:
            return routeName;
    }
}
