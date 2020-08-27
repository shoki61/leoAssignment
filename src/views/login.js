import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from '../styles/loginStyle';
import helper from '../controllers/helper';


const Login = () => {


    const [username, setUsername] = useState('');
    const [showError, setShowError] = useState(false);

    const handlerLogin = () => {
        if (username.length >= 2) {
            helper.set('username', username);

            fetch('https://leo-assignment.firebaseio.com/users.json', {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                return response.json();
            }).then(responseData => {

                let temp = []
                for (let key in responseData) {
                    temp.push(
                        responseData[key].name
                    )
                }

                const createID = 'abcdefghijklmnopqrstuvwxyz1234567890'
                let id = ''
                for (let i = 0; i <= 20; i++) {
                    id += createID[parseInt(Math.random() * (createID.length))]
                }

                if (temp.indexOf(username) === -1) {

                    fetch('https://leo-assignment.firebaseio.com/users.json', {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: username,
                            id: id
                        })
                    })
                    helper.set('userID', id)
                }
            })
        } else {
            setShowError(true)
        }

    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer} >
                <IconM style={styles.inputIcon} name='account' size={30} color='#fff' />
                <TextInput
                    value={username}
                    onChangeText={name => setUsername(name)}
                    placeholder='username...'
                    style={styles.input} />
            </View>
            {
                showError &&
                <Text style={styles.errorMessage}>Username must be at least two letters</Text>
            }
            <TouchableOpacity
                onPress={handlerLogin}
                style={styles.button}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Giriş yap</Text>
            </TouchableOpacity>
        </View>
    )
};

export default Login;