import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, } from 'react-native';
import { observer } from 'mobx-react';

import styles from '../styles/chatsStyle';
import UserChatsList from './userChatsList';
import helper from '../controllers/helper';


const Chats = ({ navigation }) => {





    useEffect(() => {
        setTimeout(() => {
            fetch(`https://leo-assignment.firebaseio.com/chats/${helper.username}.json`, {
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
                    helper.set('userChatHistory', temp)
                }
            })
        }, 500)
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
        </View>
    )
};

export default observer(Chats);