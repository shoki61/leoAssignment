import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';

import styles from '../styles/loginStyle';
import helper from '../controllers/helper';


const Login = () => {


    const [username, setUsername] = useState('');
    const [showError, setShowError] = useState(false);

    const loginHandler = () => {     // kullanıcı adının en az iki karakter olup olmadıgını kontrol eden fonksiyon
        if (username.length >= 2) {
            helper.set('username', username);
            const ref = database().ref(`users/${username}`)   // veritabanına kullanıcı adını kaydeder
            ref.set({
                name: username
            })
        } else {
            setShowError(true)  // kullanıcı adı hatalıysa hata mesajını gösterir
        }

    }

    const setUsernameHandler = (name) => {
        setUsername(name)
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer} >
                <IconM style={styles.inputIcon} name='account' size={30} color='#fff' />
                <TextInput
                    value={username}
                    onChangeText={setUsernameHandler}
                    placeholder='username...'
                    style={styles.input} />
            </View>
            {
                showError &&
                <Text style={styles.errorMessage}>Username must be at least two letters</Text>
            }
            <TouchableOpacity
                onPress={loginHandler}
                style={styles.button}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Giriş yap</Text>
            </TouchableOpacity>
        </View>
    )
};

export default Login;