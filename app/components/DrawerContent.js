import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View } from 'react-native';
import { Avatar, Icon, Image } from 'react-native-elements';
import { signOut, useAuth } from 'nonzone-lib';

const Item = (props) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: 0,
                marginRight: 20,
            }}
        >
            <DrawerItem
                label={props.text}
                onPress={props.onPress}
                {...drawerItemOptions}
            />
            <Icon color="#00FFE0" size={24} name={props.icon} />
        </View>
    );
};

const drawerItemOptions = {
    activeTintColor: '#2C887D',
    inactiveTintColor: '#2C887D',
    style: {
        alignSelf: 'flex-end',
    },
    labelStyle: {
        textDecorationLine: 'underline',
        fontSize: 18,
    },
};

function DrawerContent(props) {
    const { user } = useAuth();
    return (
        <DrawerContentScrollView {...props}>
            <Avatar
                size={63}
                rounded
                onPress={() => {
                    props.navigation.toggleDrawer();
                }}
                containerStyle={{
                    marginRight: '5%',
                    marginTop: '5%',
                    alignSelf: 'flex-end',
                    borderColor: 'white',
                    borderWidth: 3,
                }}
                renderPlaceholderContent={
                    user ? (
                        <Image
                            source={{
                                uri: user && user.photoURL,
                            }}
                            style={{ height: 63, width: 63 }}
                            resizeMode="contain"
                        />
                    ) : (
                        <Icon name="person" color="white" size={50} />
                    )
                }
            />
            <View style={{ marginTop: 20 }}>
                <Item
                    text="Zone Wallet"
                    icon="account-balance-wallet"
                    onPress={() =>
                        user
                            ? props.navigation.navigate('WalletScreen')
                            : props.navigation.navigate('ProfileScreen')
                    }
                />

                {user && (
                    <View>
                        <Item
                            text="Settings"
                            icon="settings"
                            onPress={() => {
                                props.navigation.navigate('ProfileScreen');
                            }}
                        />
                        <Item
                            text="Log out"
                            icon="exit-to-app"
                            onPress={() => {
                                signOut();
                                props.navigation.closeDrawer();
                            }}
                        />
                    </View>
                )}
            </View>
        </DrawerContentScrollView>
    );
}

export default DrawerContent;
