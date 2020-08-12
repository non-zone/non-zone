import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Input, Button, Image, Text } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { useAuth } from '../services/auth';
import { saveObject } from '../services/db';

const REACT_APP_CLOUDINARY_CLOUD_NAME = 'ocm-cloud';

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

    const uploadToCloudinary = (cloudName, image) => {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        let data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'gallery_preset');
        data.append('cloud_name', cloudName);
        return fetch(url, {
            method: 'POST',
            body: data,
        }).then((res) => res.json());
    };

    const _saveStory = async () => {
        if (image) {
            const uploadedImage = await uploadToCloudinary(
                REACT_APP_CLOUDINARY_CLOUD_NAME,
                image
            );
            console.log(uploadedImage);

            const result = await saveObject({
                id: null,
                kind: 'story',
                type: 'story',
                loc: position,
                uid: user.uid,
                title,
                description,
                image: uploadedImage.secure_url,
            });
            console.log(result);
            if (result) {
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
            <Button
                title="Pick an image from camera roll"
                onPress={_pickImage}
            />
            <Button title="Take a photo" onPress={_captureImage} />
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200 }}
                />
            )}
            <Button
                titleStyle={styles.buttonTitle}
                buttonStyle={styles.button}
                title="Create story"
                onPress={_saveStory}
            />
        </ScrollView>
    ) : (
        <View style={styles.contentContainer}>
            <Text>Please login first</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 15,
    },
    button: {
        backgroundColor: '#212121',
    },
    buttonTitle: {
        color: '#55d4c3',
    },
});
