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
            .on('value', response => {
                fetch(`https://leo-assignment.firebaseio.com/chats/${helper.username}.json`, {
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => {
                    return response.json();
                }).then(responseData => {
                    const temp = []
                    for (let i in responseData) {
                        temp.push({
                            name: responseData[i].name
                        })
                    }
                    helper.userChatHistory = temp
                })
            })
    }, [])


    return (
        <View style={styles.container} >
            {
                helper.userChatHistory.length > 0 &&
                <FlatList
                    contentContainerStyle={{ paddingVertical: 20 }}
                    data={helper.userChatHistory}
                    renderItem={
                        item => <UserChatsList data={item} navigation={navigation} />
                    }
                />
            }
            {
                helper.userChatHistory.length <= 0 &&
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.startChatText}>Hemen sohbete başlamak için tıkla</Text>
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