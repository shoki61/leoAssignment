import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

import styles from '../styles/usersStyle';


const Users = () => {

    const data = [
        { id: 0, name: 'Ahmet' },
        { id: 1, name: 'Zafer' },
        { id: 2, name: 'Yavuz' },
        { id: 3, name: 'Gülşah' }
    ]

    const usersList = (item) => {
        return (
            <TouchableOpacity
                activeOpacity={.9}
                style={styles.chatItemContainer}>
                <View style={styles.userAvatar} >
                    <Text style={styles.userAvatarText}>ZA</Text>
                </View>
                <View style={styles.messagesContainer}>
                    <Text numberOfLines={1} style={styles.userName}>{item.item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={{ paddingVertical: 15 }}
                data={data}
                renderItem={item => usersList(item)}
            />
        </View>
    )
};

export default Users;