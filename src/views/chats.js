import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, } from 'react-native';
import database from '@react-native-firebase/database';
import { observer } from 'mobx-react';
import IconI from 'react-native-vector-icons/Ionicons';

import styles from '../styles/chatsStyle';
import UserChatsList from './userChatsList';
import helper from '../controllers/helper';


const Chats = ({ navigation }) => {


    useEffect(() => {
        database()
            .ref(`chats/${helper.username}`)
            .on('value', () => {
                fetch(`https://leo-assignment.firebaseio.com/chats/${helper.username}.json`)//veri tabanında kullanıcıya ait sohbetleri çeker ve helper'de tanımlı "userChatHistory" dizisine eşitler
                    .then(response => {
                        return response.json();
                    }).then(responseData => {
                        const temp = []
                        for (let i in responseData) {
                            temp.push({
                                name: responseData[i].name,
                                lastMessage: responseData[i].lastMessage
                            })
                        }
                        helper.set('userChatHistory', temp)
                    })
            })
    }, [])

    useEffect(() => { // yukarıdaki useEffect sadece komponent run edildiğinde çalıştığı için buradaki useEffect ise helper da bulunan "userChatHistory" her değiştiğinde çalışır  
    }, [helper.userChatHistory])

    return (
        <View style={styles.container} >
            {
                helper.userChatHistory.length > 0 && //eğer kullanıcıya ait sohbet varsa gösterilir
                <FlatList
                    contentContainerStyle={{ paddingVertical: 20 }}
                    data={helper.userChatHistory}
                    renderItem={
                        item => <UserChatsList data={item} navigation={navigation} /> //her bir item'ı alır ve "UserChatsList" komponentine "data" adında props olarak gönderir
                    }
                />
            }
            {
                helper.userChatHistory.length <= 0 && //kullanıcıya ait sohbet yoksa gösterilir
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.startChatText}>Hemen sohbete başla</Text>
                    <TouchableOpacity style={styles.goUsersButton} onPress={() => navigation.navigate('Users')}>
                        <Text style={{ color: '#fff', fontSize: 17, marginRight: 5 }}>Contacts</Text>
                        <IconI name='arrow-forward' size={20} color='#fff' />
                    </TouchableOpacity>
                </View>
            }

        </View>
    )
};

export default observer(Chats);