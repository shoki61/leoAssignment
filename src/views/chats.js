import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from '../styles/chatsStyle';

import UserChatsList from './userChatsList';
import { FlatList } from 'react-native-gesture-handler';


const Chats = ({ navigation }) => {

    const data = [
        { id: 0, name: 'Ahmet', message: 'Merhaba' },
        { id: 1, name: 'Zafer', message: 'Merhaba nasılsın?' },
        { id: 2, name: 'Yavuz', message: 'evet dediğin gibi' },
        { id: 3, name: 'Gülşah', message: 'görüşürüz' }
    ]

    return (
        <View style={styles.container} >
            <FlatList
                contentContainerStyle={{ paddingVertical: 20 }}
                data={data}
                renderItem={
                    item => <UserChatsList data={item} navigation={navigation} />
                }
            />
        </View>
    )
};

export default Chats;