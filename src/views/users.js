import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import database from '@react-native-firebase/database';
import { observer } from 'mobx-react';

import styles from '../styles/usersStyle';
import helper from '../controllers/helper';


const Users = ({ navigation }) => {


    useEffect(() => {
        database()
            .ref('user')
            .on('value', () => {
                fetch('https://leo-assignment.firebaseio.com/users.json')// veritabanda mevcut kullanıcıları fetch ile eşzamanlı olarak çeker
                    .then(response => {
                        return response.json();
                    }).then(responseData => {
                        if (responseData !== null) {
                            const temp = []
                            for (let key in responseData) {
                                temp.push(
                                    responseData[key]
                                )
                            }
                            helper.set('users', temp)// veritabanından çekilen kullanıcı bilgilerini helper daki users dizisine eşitler
                        }
                    })
            })
    }, [])



    const usersList = (item) => { //gelen her bir kullanıcı verisini dönderen fonksiyon
        const userAvatarName = item.item.name[0].toUpperCase() + item.item.name[1].toUpperCase(); //kullanıcı adının ilk iki harfini alarak ve büyük harfe dönüştürerek "userAvatarName" e eşitler

        const goToChat = () => { //sohbet etmek istediği kullanıcı adını helperde tanımlı "userChatWith" değişkenine eşitleyen ve "Chat" sayfasına yönlendiren fonksiyon
            helper.set('userChatWith', item.item.name)
            navigation.navigate('Chat')
        }

        return (
            item.item.name !== helper.username && // uygulamaya giriş yapan kullanıcının, kullanıcılar listesinde görünmemesini sağlar.
            <TouchableOpacity
                onPress={goToChat}
                activeOpacity={.9}
                style={styles.chatItemContainer}>
                <View style={styles.userAvatar} >
                    <Text style={styles.userAvatarText}>{userAvatarName}</Text>
                </View>
                <View style={styles.messagesContainer}>
                    <Text numberOfLines={1} style={styles.userName}>{item.item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <View style={styles.container}>
            <FlatList                         // bütün kullanıcıları uygulamanın "contacts" bölümünde liste olarak gösterir
                contentContainerStyle={{ paddingVertical: 15 }}
                data={helper.users}
                renderItem={item => usersList(item)}
            />
        </View>
    )
};

export default observer(Users);