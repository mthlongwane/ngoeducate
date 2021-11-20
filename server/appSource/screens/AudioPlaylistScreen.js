import * as React from 'react';
import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import { getAudioPlaylists } from '../utils/utils';

let {audioList} = getAudioPlaylists()

export default function AudioPlayListScreen({navigation}) {
  return (
    <ScrollView>
      <Text
        style={{
          fontFamily: 'Quicksand-Bold',
          fontSize: 30,
          textAlign: 'center',
          paddingVertical: 10,
        }}>
        Audio Playlists
      </Text>
      {audioList.map((item, index) => (
        <View key={index} style={styles.container}>
          <Image
            source={require('../assets/audio.png')}
            style={{
              alignSelf: 'center',
            }}
          />
          <View style={{marginTop: 10, flex: 1, marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#333333',
                  fontFamily: 'Quicksand-Regualr',
                  fontSize: 20,
                }}>
                {item.title}
              </Text>
            </View>
            <Text style={{color: '#8f8f8f', fontFamily: 'Quicksand-Regular'}}>
              {item.files.length} Files
            </Text>
          </View>
          <Button
            type="clear"
            containerStyle={styles.button}
            title="Listen..."
            titleStyle={{
              color: '#333333',
              fontFamily: 'Quicksand-Bold',
            }}
            onPress={() => navigation.navigate('AudioList', {data: item})}
          />
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 5,
    padding: 10,
    justifyContent: 'space-between',
    borderColor: '#E4E4E4',
    borderRadius: 10,
    borderWidth: 2,
  },
  button: {
    borderColor: '#333333',
    borderWidth: 2,
    margin: 5,
    width: '50%',
    marginVertical: 10,
    borderRadius: 8,
  },
});
