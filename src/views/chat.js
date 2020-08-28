import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import { observer } from 'mobx-react';

import styles from '../styles/chatStyle';
import helper from '../controllers/helper';


const Chat = ({ navigation }) => {

    const [userMessage, setUserMessage] = useState('')

    const [time, setTime] = useState('')
    const [date, setDate] = useState('')
    const [inputHeight, setInputHeight] = useState('')

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
                <View style={{ backgroundColor: '#f5f5f5', maxWidth: '65%', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15 }}>
                    <Text style={[styles.message, { color: '#434343' }]}>{item.message}</Text>
                </View>
            </View>
        )
    }

    const sendMessage = (item) => {
        return (
            <View style={styles.sendMessageView}>
                <View style={{ backgroundColor: '#1ec897', maxWidth: '65%', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15 }}>
                    <Text style={[styles.message, { color: '#fff' }]}>{item.message}</Text>
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




    return (
        <View style={styles.container} >
            <Header />
            <FlatList
                contentContainerStyle={{ paddingTop: 25 }}
                data={helper.existingMesseges}
                renderItem={messageItem => messageItem.item.who === helper.username ? sendMessage(messageItem.item) : incomingMessage(messageItem.item)}
            />

            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.imageButton}>
                    <IconI name='image' size={40} color={'#999'} />
                </TouchableOpacity>
                <TextInput
                    value={userMessage}
                    onChangeText={text => setUserMessage(text)}
                    style={[styles.input, inputHeight > 50 && { borderRadius: 15 }]}
                    multiline
                    onContentSizeChange={(event) => {
                        setInputHeight(Math.floor((event.nativeEvent.contentSize.height)))
                    }}
                    placeholder={'Mesaj yaz...'} />
                <TouchableOpacity
                    onPress={sendMessageFunction}
                    style={styles.sendButton}>
                    <IconM name='send' size={20} color={'#fff'} />
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default observer(Chat);