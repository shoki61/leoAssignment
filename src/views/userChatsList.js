import React, { } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from '../styles/userChatsListStyle';

const UserChatsList = (props) => {

    const chatsList = props.data

    return (
        <TouchableOpacity
            onPress={() => props.navigation.navigate('Chat')}
            activeOpacity={.9}
            style={styles.chatItemContainer}>
            <View style={styles.userAvatar} >
                <Text style={styles.userAvatarText}>ZA</Text>
            </View>
            <View style={styles.messagesContainer}>
                <Text numberOfLines={1} style={styles.userName}>{chatsList.item.name}</Text>
                <Text numberOfLines={1} style={styles.userLastMessage}>{chatsList.item.message}</Text>
            </View>
        </TouchableOpacity>
    )
};

export default UserChatsList;
