import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


const Chats = ({ navigation }) => {
    return (
        <View>
            <Text>Chats Page</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Chat')}><Text>go Chat page</Text></TouchableOpacity>
        </View>
    )
};

export default Chats;