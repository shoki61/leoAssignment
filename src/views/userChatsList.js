import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';

import styles from '../styles/userChatsListStyle';
import helper from '../controllers/helper';

const UserChatsList = (props) => {

    const chatsList = props.data;
    const userAvatarName = chatsList.item.name[0].toUpperCase() + chatsList.item.name[1].toUpperCase();  //kullanıcı adının ilk iki harfini alarak ve büyük harfe dönüştürerek "userAvatarName" e eşitler

    const goToChat = () => {
        helper.set('userChatWith', chatsList.item.name)  //sohbetler kısmında sohbet etmek istediği kullanıcı adını helperde tanımlanan "userChatWith" değişkenine eşitleyen ve "Chat" sayfasına yönlendiren fonksiyon
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
                <Text
                    numberOfLines={1}
                    style={styles.userName}>
                    {chatsList.item.name}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[styles.userLastMessage, chatsList.item.lastMessage === 'resim gönderildi' && { fontStyle: 'italic' }, chatsList.item.lastMessage === 'konum gönderildi' && { fontStyle: 'italic' }]}>
                    {chatsList.item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    )
};

export default observer(UserChatsList);
