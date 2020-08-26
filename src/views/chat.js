import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';


import styles from '../styles/chatStyle';
import helper from '../controllers/helper';


const Chat = ({ navigation }) => {


    const messages = [
        { id: 0, time: '18:40', message: 'Sokak köpeklerini besladim', sender: 'user' },
        { id: 3, time: '18:41', message: 'Merhaba Emirhan', sender: 'admin' },
        { id: 4, time: '18:41', message: 'Yaptığın iyilik onaylanmıştır ve hesapına 10 İP tanımlanmıştır. Sevgi paylaştıkça güzel!', sender: 'admin' },
        { id: 5, time: '18:56', message: 'Teşekkürler', sender: 'user' }
    ]


    useEffect(() => {
        helper.showTabNavigator = false;
        return function () {
            helper.showTabNavigator = true
        }
    })


    const Header = () => {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Chats')} style={styles.backButton}>
                    <IconI name='arrow-back-sharp' size={35} color='#fff' />
                </TouchableOpacity>

                <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>ZA</Text>
                </View>

                <View style={styles.userNameView}>
                    <Text style={styles.userName}>Zafer Ayan</Text>
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

    const MessageInput = () => {
        return (
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.imageButton}>
                    <IconI name='image' size={40} color={'#999'} />
                </TouchableOpacity>
                <TextInput style={styles.input} multiline placeholder={'Mesaj yaz...'} />
                <TouchableOpacity style={styles.sendButton}>
                    <IconM name='send' size={20} color={'#fff'} />
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View style={styles.container} >
            <Header />

            <FlatList
                contentContainerStyle={{ paddingTop: 25 }}
                data={messages}
                renderItem={data => data.item.sender === 'user' ? incomingMessage(data.item) : sendMessage(data.item)}
            />

            <MessageInput />
        </View>
    )
};

export default Chat;