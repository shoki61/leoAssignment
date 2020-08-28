import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';

import styles from '../styles/userChatsListStyle';
import helper from '../controllers/helper';

const UserChatsList = (props) => {

    const chatsList = props.data;
    const userAvatarName = chatsList.item.name[0].toUpperCase() + chatsList.item.name[1].toUpperCase();


    const goToChat = () => {
        helper.set('userChatWith', chatsList.item.name)
        props.navigation.navigate('Chat')
    }


    return (
        <TouchableOpacity
            onPress={goToChat}
            activeOpacity={.9}
            style={styles.chatItemContainer}>
            <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>{userAvatarName}</Text>
            </View>
            <View style={styles.messagesContainer}>
                <Text numberOfLines={1} style={styles.userName}>{chatsList.item.name}</Text>
                <Text numberOfLines={1} style={styles.userLastMessage}>{chatsList.item.message}</Text>
            </View>
        </TouchableOpacity>
    )
};

export default observer(UserChatsList);
