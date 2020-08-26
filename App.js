import React, { } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import IconsM from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';

import Login from './src/views/login';
import Chats from './src/views/chats';
import Chat from './src/views/chat';
import Users from './src/views/users';
import helper from './src/controllers/helper';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const ChatNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Chats"
        component={Chats} />

      <Stack.Screen
        name="Chat"
        component={Chat} />
    </Stack.Navigator>
  )
}


const App = () => {
  return (
    <>
      <StatusBar backgroundColor='#1ec897' />
      {
        true &&
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color }) => {
                let iconName;

                if (route.name === 'ChatNavigation') {
                  iconName = focused ? 'chat-processing' : 'chat-processing';
                } else if (route.name === 'Users') {
                  iconName = focused ? 'account-circle' : 'account-circle';
                }

                return <IconsM name={iconName} size={27} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: '#1ec897',
              inactiveTintColor: 'grey',
              labelStyle: {
                fontSize: 13,
                paddingBottom: 3
              },
            }}
          >
            <Tab.Screen
              options={{
                title: 'Chats',
                tabBarVisible: helper.showTabNavigator
              }}
              name="ChatNavigation"
              component={ChatNavigation} />

            <Tab.Screen
              options={{
                title: 'Contacts'
              }}
              name="Users"
              component={Users} />
          </Tab.Navigator>
        </NavigationContainer>
      }
    </>
  )
};

export default observer(App);