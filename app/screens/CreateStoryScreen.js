import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Input, Button, Image, Text } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {
    saveObject,
    publishObject,
    useAuth,
    uploadToCloudinary,
} from 'nonzone-lib';

import ProfileScreen from './ProfileScreen';

const { width } = Dimensions.get('window');

export default function CreateStoryScreen({ route, navigation }) {
    const position = route.params;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const getPermission = async () => {
            if (Constants.platform.ios) {
                const { status } = await Permissions.askAsync(
                    Permissions.CAMERA_ROLL
                );
                if (status !== 'granted') {
                    alert(
                        'Sorry, we need camera roll permissions to make this work!'
                    );
                }
            }
            if (Constants.platform.android) {
                const { status } = await Permissions.askAsync(
                    Permissions.CAMERA
                );
                if (status !== 'granted') {
                    alert(
                        'Sorry, we need camera permissions to make this work!'
                    );
                }
            }
        };

        getPermission();
    }, []);

    const _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
                base64: true,
            });
            if (!result.cancelled) {
                setImage('data:image/jpeg;base64,' + result.base64);
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };

    const _captureImage = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
                base64: true,
            });
            if (!result.cancelled) {
                setImage('data:image/jpeg;base64,' + result.base64);
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };

    const _saveStory = async () => {
        if (image) {
            const uploadedImage = await uploadToCloudinary(image);
            console.log(uploadedImage);

            const data = {
                id: null,
                kind: 'story',
                type: 'story',
                loc: position,
                uid: user.uid,
                title,
                description,
                image: uploadedImage.secure_url,
            };
            const id = await saveObject(data);
            console.log('save object result', id);
            data.id = id;
            await publishObject(data);

            if (id) {
                alert('Story saved!');
                navigation.navigate('Root');
            } else {
                alert('something went wrong!');
            }
        }
    };

    return user ? (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Input
                placeholder="Title"
                value={title}
                onChangeText={(text) => setTitle(text)}
            />
            <Input
                placeholder="Description"
                value={description}
                onChangeText={(text) => setDescription(text)}
                multiline
            />
            <View style={styles.buttonBox}>
                <Button
                    containerStyle={{ flex: 1, paddingRight: 5 }}
                    icon={{ name: 'folder', size: 30, color: 'white' }}
                    title="Browse"
                    onPress={_pickImage}
                />
                <Button
                    containerStyle={{ flex: 1, paddingLeft: 5 }}
                    icon={{ name: 'camera', size: 30, color: 'white' }}
                    title="Capture"
                    onPress={_captureImage}
                />
            </View>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{
                        height: width / 1.5,
                        resizeMode: 'contain',
                        marginVertical: 20,
                    }}
                />
            )}
            <Button title="Create story" onPress={_saveStory} />
        </ScrollView>
    ) : (
        <ProfileScreen />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    contentContainer: {
        paddingVertical: 15,
    },
    buttonBox: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },
});
