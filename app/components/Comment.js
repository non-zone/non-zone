import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, Icon, Image } from 'react-native-elements';
import { useLoadUserPublicProfile } from 'nonzone-lib';
import dayjs from 'dayjs';

import Colors from '../constants/Colors';

const avatarSize = 25;

function Comment(props) {
    const { uid, ts, comment } = props.comment;
    const { data: profile } = useLoadUserPublicProfile(uid);
    return (
        <View
            style={{
                paddingVertical: 10,
                borderColor: '#8D8D8F',
                borderBottomWidth: 1,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                        size={avatarSize}
                        rounded
                        containerStyle={{
                            alignSelf: 'center',
                            borderColor: 'white',
                            borderWidth: 1,
                            marginRight: 10,
                            marginVertical: 5,
                        }}
                        renderPlaceholderContent={
                            profile?.photoURL ? (
                                <Image
                                    source={{
                                        uri: profile.photoURL,
                                    }}
                                    style={{
                                        height: avatarSize,
                                        width: avatarSize,
                                    }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Icon name="person" color="white" size={20} />
                            )
                        }
                    />
                    <Text style={{ color: Colors.tintColor, fontSize: 12 }}>
                        {profile?.nickname}
                    </Text>
                </View>
                <Text style={{ color: '#F2F6FC', fontSize: 10 }}>
                    {dayjs(ts).fromNow()}
                </Text>
            </View>
            <Text style={{ color: 'white' }}>{comment}</Text>
        </View>
    );
}

export default Comment;
