import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import IconsI from 'react-native-vector-icons/Ionicons';
import { observer } from 'mobx-react';

import Login from './src/views/login';
import Chats from './src/views/chats';
import Chat from './src/views/chat';
import Users from './src/views/users';
import helper from './src/controllers/helper';
import MapPage from './src/views/mapPage';


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
        name='Chats'
        component={Chats} />

      <Stack.Screen
        name='Chat'
        component={Chat} />
      <Stack.Screen
        name='MapPage'
        component={MapPage} />
    </Stack.Navigator>
  )
}
const ChatWith = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name='Users'
        component={Users} />
    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <>
      <StatusBar
        hidden={
          helper.statusBarHidden  //konum haritada gösterildiğinde "StatusBar" gizlenmesi için
        }
        backgroundColor='#1ec897' />

      {
        helper.username !== '' ?  //kullanıcı giriş yaparsa uygulamada gezinmeye izin verilir yoksa login sayfasında kalır
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                  let iconName;

                  if (route.name === 'ChatNavigation') {
                    iconName = focused ? 'chatbubble-ellipses-sharp' : 'chatbubble-ellipses-sharp';
                  } else if (route.name === 'Users') {
                    iconName = focused ? 'person-circle-sharp' : 'person-circle-sharp';
                  }
                  return <IconsI name={iconName} size={27} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: '#1ec897',
                inactiveTintColor: '#b3b3b3',
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
                name='ChatNavigation'
                component={ChatNavigation} />

              <Tab.Screen
                options={{
                  title: 'Contacts'
                }}
                name='Users'
                component={ChatWith} />
            </Tab.Navigator>
          </NavigationContainer> :
          <Login />
      }
    </>
  )
};

export default observer(App);