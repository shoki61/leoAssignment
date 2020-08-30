import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/FontAwesome5';
import IconFeather from 'react-native-vector-icons/Feather'
import database from '@react-native-firebase/database';
import { observer } from 'mobx-react';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import SImage from 'react-native-scalable-image';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import styles from '../styles/chatStyle';
import helper from '../controllers/helper';


const Chat = ({ navigation }) => {


    const replyListRef = useRef(null);

    const [userMessage, setUserMessage] = useState('')
    const [image, setImage] = useState(null)

    const [time, setTime] = useState('')
    const [date, setDate] = useState('')
    const [inputHeight, setInputHeight] = useState('')
    const [transferred, setTransferred] = useState(0);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

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
        setTime(('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2) + ":" + ('0' + today.getSeconds()).slice(-2))
        setDate(('0' + today.getDate()).slice(-2) + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getFullYear()).slice(-2))
    }, [helper.existingMesseges])


    const messageInputHandler = (enteredText) => {
        setUserMessage(enteredText);
    }


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

    const goMapPage = (location) => {
        helper.set('longitude', location.longitude)
        helper.set('latitude', location.latitude)
        navigation.navigate('MapPage')
    }

    const incomingMessage = (item) => {
        return (
            <View style={styles.incomingMessageView}>
                <View style={[item.message && { backgroundColor: '#f5f5f5', maxWidth: '65%', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15 }]}>
                    {
                        item.message &&
                        <Text style={[styles.message, { color: '#434343' }]}>{item.message}</Text>
                    }
                    {
                        item.imageURL &&
                        <SImage source={{ uri: item.imageURL }} width={200} borderRadius={10} />
                    }
                    {
                        item.location &&
                        <TouchableOpacity
                            onPress={() => goMapPage(item.location)}
                            style={{ borderWidth: 3, borderColor: '#00c3ff', overflow: 'hidden', borderRadius: 10, width: 250, height: 140 }}>
                            <MapView
                                toolbarEnabled={false}
                                scrollEnabled={false}
                                initialRegion={{
                                    latitude: item.location.latitude,
                                    longitude: item.location.longitude,
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.001
                                }}
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    width: null
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: item.location.latitude,
                                        longitude: item.location.longitude
                                    }}
                                >
                                    <IconI name='pin-sharp' size={35} color={'#ff4242'} />
                                </Marker>

                            </MapView>
                        </TouchableOpacity>
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
                        item.message &&
                        <Text style={[styles.message, { color: '#fff' }]}>{item.message}</Text>
                    }
                    {
                        item.imageURL &&
                        <SImage source={{ uri: item.imageURL }} width={200} borderRadius={10} />
                    }
                    {
                        item.location &&
                        <TouchableOpacity
                            onPress={() => goMapPage(item.location)}
                            style={{ borderWidth: 3, borderColor: '#00c3ff', overflow: 'hidden', borderRadius: 10, width: 250, height: 140 }}>
                            <MapView
                                toolbarEnabled={false}
                                scrollEnabled={false}
                                initialRegion={{
                                    latitude: item.location.latitude,
                                    longitude: item.location.longitude,
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.001
                                }}
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    width: null
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: item.location.latitude,
                                        longitude: item.location.longitude
                                    }}
                                >
                                    <IconI name='pin-sharp' size={35} color={'#ff4242'} />
                                </Marker>

                            </MapView>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

    const sendMessageFunction = (value, url) => {

        if (value === 'image') {
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
        }
        else if (value === 'location') {
            const refChatContentUser = database().ref(`chatContent/${helper.username}>${helper.userChatWith}/${time + ' ' + date}`);
            refChatContentUser.set({
                location: {
                    latitude: latitude,
                    longitude: longitude
                },
                who: helper.username
            })

            const refUserWith = database().ref(`chatContent/${helper.userChatWith}>${helper.username}/${time + ' ' + date}`);
            refUserWith.set({
                location: {
                    latitude: latitude,
                    longitude: longitude
                },
                who: helper.username
            })
        } else {
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
        setTransferred(0);

        const task = storage()
            .ref(`${helper.username}${helper.userChatWith}${filename}`)
            .putFile(uploadUri);

        const task1 = storage()
            .ref(`${helper.userChatWith}${helper.username}${filename}`)
            .putFile(uploadUri);


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


        setImage(null);

        const url = storage().ref(`${helper.username}${helper.userChatWith}${filename}`).getDownloadURL()
        setTimeout(() => {
            sendMessageFunction('image', url)
        }, 1000)

        setTransferred(0)


    };


    const sendLocation = async () => {
        await Geolocation.getCurrentPosition(
            async (info) => {
                await setLatitude(info.coords.latitude);
                await setLongitude(info.coords.longitude);
            },
            (error) => console.log(error),
            {
                enableHighAccuracy: true,
            },
        );
        if (latitude > 0 || longitude > 0) {
            setTimeout(() => {
                sendMessageFunction('location')
            }, 0)
        } else {
            alert('Lütfen konum servislerinizin açık olduğundan emin olun!')
        }

    }




    return (
        <View style={styles.container} >
            <Header />

            <FlatList
                ref={replyListRef}
                onContentSizeChange={() => {
                    replyListRef.current.scrollToEnd();
                }}
                contentContainerStyle={{ paddingTop: 15, paddingBottom: 5 }}
                data={helper.existingMesseges}
                renderItem={messageItem => messageItem.item.who === helper.username ? sendMessage(messageItem.item) : incomingMessage(messageItem.item)}
            />

            <View style={[styles.inputContainer, image !== null && { justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={getImage}
                        style={styles.inputContainerLeftIcon}>
                        <IconI name='image' size={35} color={'#ff8d12'} />
                    </TouchableOpacity>
                    {
                        image === null ?
                            <TouchableOpacity
                                onPress={sendLocation}
                                style={styles.inputContainerLeftIcon}>
                                <IconF name='map-marker-alt' size={27} color={'#ff7373'} />
                            </TouchableOpacity> :
                            <TouchableOpacity
                                onPress={() => setImage(null)}>
                                <IconFeather name='x' size={27} color={'#4099ff'} />
                            </TouchableOpacity>
                    }

                </View>

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
                            onChangeText={messageInputHandler}
                            style={[styles.input, inputHeight > 50 && { borderRadius: 15 }]}
                            multiline
                            onFocus={() => {
                                setTimeout(() => replyListRef.current.scrollToEnd(), 300)
                            }}
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