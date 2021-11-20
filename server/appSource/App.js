/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useRef} from 'react';
import type {Node} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UpdateScreen from './screens/UpdateScreen';
import HomeScreen from './screens/HomeScreen';
import AudioPlayListScreen from './screens/AudioPlaylistScreen';
import VideoPlayListScreen from './screens/VideoPlaylistScreen';
import VideoListScreen from './screens/VideoListScreen';
import AudioListScreen from './screens/AudioListScreen';
import {
  copyMediaFromAssets,
  initDB,
  requestPermissions,
} from './utils/utils';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  useEffect(() => {
    initDB(() => {
      copyMediaFromAssets();
      requestPermissions();
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Home'}
        screenOptions={{
          headerTitleStyle: {fontFamily: 'Quicksand-Bold', color: '#333333'},
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}>
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Videos"
          options={{title: 'Video playlists'}}
          component={VideoPlayListScreen}
        />
        <Stack.Screen
          name="Audios"
          options={{title: 'Audio playlists'}}
          component={AudioPlayListScreen}
        />
        <Stack.Screen
          name="VideoList"
          component={VideoListScreen}
          options={({route, navigation}) => ({title: route.params.data.title})}
        />
        <Stack.Screen
          name="AudioList"
          component={AudioListScreen}
          options={({route}) => ({title: route.params.data.title})}
        />
        <Stack.Screen
          name="Update"
          component={UpdateScreen}
          options={{title: 'Update Available'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
