import React from 'react';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/components/Login';
import Signup from './src/components/SignUp';
import ForgetPassword from './src/components/ForgetPassword';
import ChangePassword from './src/components/ChangePassword';
import Home from './src/components/Home';
import HomeAdmin from './src/components/HomeAdmin';
import Publication from './src/components/Publication'
import PublicationAdmin from './src/components/PublicationAdmin'
import ChatScreen from './src/components/Chat'
import Privacy from './src/components/Privacy'
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Settings from './src/components/Settings'
import SettingsAdmin from './src/components/SettingsAdmin'


const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
       <NavigationContainer>
          <Stack.Navigator>
          <Stack.Screen
              name="Login"
              component={Login}
            />
          <Stack.Screen
              name="Signup"
              component={Signup}
            />
          <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
          />
          <Stack.Screen
              name="ForgetPassword"
              component={ForgetPassword}
          />
          <Stack.Screen
              options={{headerShown: true}}
              name="Home"
              component={Home}
            />
            <Stack.Screen
              options={{headerShown: true}}
              name="HomeAdmin"
              component={HomeAdmin}
            />
            <Stack.Screen
              name="Publication"
              component={Publication}
            />
            <Stack.Screen
              name="PublicationAdmin"
              component={PublicationAdmin}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
            />
            <Stack.Screen
              name="Privacy"
              component={Privacy}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
            />
            <Stack.Screen
              name="SettingsAdmin"
              component={SettingsAdmin}
            />
            
          </Stack.Navigator>
        </NavigationContainer>
    </Provider>
  );
}

