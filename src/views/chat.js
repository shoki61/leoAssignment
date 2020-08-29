import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import { observer } from 'mobx-react';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import SImage from 'react-native-scalable-image';

import styles from '../styles/chatStyle';
import helper from '../controllers/helper';


const Chat = ({ navigation }) => {

    const [userMessage, setUserMessage] = useState('')
    const [image, setImage] = useState(null)

    const [time, setTime] = useState('')
    const [date, setDate] = useState('')
    const [inputHeight, setInputHeight] = useState('')
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    useEffect(() => {
        helper.set('showTabNavigator', false);
        database()
            .ref()
            .on('value', () => {
                fetch(`https://leo-assignment.firebaseio.com/chatContent/${helper.username}>${helper.userChatWith}.json`, {
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => {
                    return response.json();
                }).then(responseData => {
                    if (responseData !== null) {
                        const temp = []
                        for (let key in responseData) {
                            temp.push(
                                responseData[key]
                            )
                        }
                        helper.set('existingMesseges', temp)
                    }
                })
            })
        return () => {
            helper.set('showTabNavigator', true)
            helper.set('existingMesseges', '')
        }

    }, [])

    useEffect(() => {
        let today = new Date()
        setTime(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())
        setDate(today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear())
    }, [helper.existingMesseges])


    const Header = () => {
        const userAvatarName = helper.userChatWith[0].toUpperCase() + helper.userChatWith[1].toUpperCase()
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Chats')} style={styles.backButton}>
                    <IconI name='arrow-back-sharp' size={35} color='#fff' />
                </TouchableOpacity>

                <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>{userAvatarName}</Text>
                </View>

                <View style={styles.userNameView}>
                    <Text style={styles.userName}>{helper.userChatWith}</Text>
                </View>
            </View>
        )
    }


    const incomingMessage = (item) => {
        return (
            <View style={styles.incomingMessageView}>
                <View style={[item.message && { backgroundColor: '#f5f5f5', maxWidth: '65%', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15 }]}>
                    {
                        item.message ?
                            <Text style={[styles.message, { color: '#434343' }]}>{item.message}</Text> :
                            <SImage source={{ uri: item.imageURL }} width={200} borderRadius={10} />
                    }
                </View>
            </View>
        )
    }

    const sendMessage = (item) => {
        return (
            <View style={styles.sendMessageView}>
                <View style={[item.message && styles.messageContainer]}>
                    {
                        item.message ?
                            <Text style={[styles.message, { color: '#fff' }]}>{item.message}</Text> :
                            <SImage source={{ uri: item.imageURL }} width={200} borderRadius={10} />
                    }
                </View>
            </View>
        )
    }

    const sendMessageFunction = () => {
        setUserMessage('')
        const refChatContentUser = database().ref(`chatContent/${helper.username}>${helper.userChatWith}/${time + ' ' + date}`);
        refChatContentUser.set({
            message: userMessage,
            who: helper.username
        })

        const refUserWith = database().ref(`chatContent/${helper.userChatWith}>${helper.username}/${time + ' ' + date}`);
        refUserWith.set({
            message: userMessage,
            who: helper.username
        })

        const refChatsUser = database().ref(`chats/${helper.username}/${helper.userChatWith}`);
        refChatsUser.set({
            name: helper.userChatWith
        })

        const refChatsUserWith = database().ref(`chats/${helper.userChatWith}/${helper.username}`);
        refChatsUserWith.set({
            name: helper.username
        })
    }

    const getImage = async () => {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                setImage(source)

            }
        });

    }

    const uploadImage = async () => {
        const { uri } = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);
        setTransferred(0);

        const task = storage()
            .ref(`${helper.username}${helper.userChatWith}${filename}`)
            .putFile(uploadUri);

        const task1 = storage()
            .ref(`${helper.userChatWith}${helper.username}${filename}`)
            .putFile(uploadUri);


        // set progress state
        task.on('state_changed', snapshot => {
            setTransferred(
                Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
            );
        });
        try {
            await task;
            await task1;
        } catch (e) {
            console.error(e);
        }

        setUploading(false);

        setImage(null);

        const url = storage().ref(`${helper.username}${helper.userChatWith}${filename}`).getDownloadURL()
        setTimeout(() => {
            const refChatContentUser = database().ref(`chatContent/${helper.username}>${helper.userChatWith}/${time + ' ' + date}`);
            refChatContentUser.set({
                imageURL: url._W,
                who: helper.username
            })
            const refUserWith = database().ref(`chatContent/${helper.userChatWith}>${helper.username}/${time + ' ' + date}`);
            refUserWith.set({
                imageURL: url._W,
                who: helper.username
            })
        }, 500)




    };





    return (
        <View style={styles.container} >
            <Header />
            <FlatList
                contentContainerStyle={{ paddingTop: 15, paddingBottom: 5 }}
                data={helper.existingMesseges}
                renderItem={messageItem => messageItem.item.who === helper.username ? sendMessage(messageItem.item) : incomingMessage(messageItem.item)}
            />

            <View style={[styles.inputContainer, image !== null && { justifyContent: 'space-between' }]}>
                <TouchableOpacity
                    onPress={getImage}
                    style={styles.imageButton}>
                    <IconI name='image' size={40} color={'#999'} />
                </TouchableOpacity>

                {
                    image !== null ?

                        <View>
                            <SImage source={image} width={200} borderRadius={10} />
                            <View style={{ marginTop: 5 }}>
                                <Progress.Bar
                                    color='#1ec897'
                                    borderRadius={100}
                                    progress={transferred}
                                    width={200} />
                            </View>
                        </View>
                        :
                        <TextInput
                            value={userMessage}
                            onChangeText={text => setUserMessage(text)}
                            style={[styles.input, inputHeight > 50 && { borderRadius: 15 }]}
                            multiline
                            onContentSizeChange={(event) => {
                                setInputHeight(Math.floor((event.nativeEvent.contentSize.height)))
                            }}
                            placeholder={'Mesaj yaz...'} />
                }

                <TouchableOpacity
                    onPress={image !== null ? uploadImage : sendMessageFunction}
                    style={styles.sendButton}>
                    <IconM name='send' size={20} color={'#fff'} />
                </TouchableOpacity>
            </View>
        </View >
    )
};

export default observer(Chat);