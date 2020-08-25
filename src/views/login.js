import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from '../styles/loginStyle';


const Login = () => {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer} >
                <IconM style={styles.inputIcon} name='account' size={30} color='#fff' />
                <TextInput
                    placeholder='username...'
                    style={styles.input} />
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Giriş yap</Text>
            </TouchableOpacity>
        </View>
    )
};

export default Login;