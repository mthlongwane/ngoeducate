import React, {useEffect} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {
  getUpdates,
  checkShare,
  getVideoPlaylists,
  getAudioPlaylists,
} from '../utils/utils';
import appConfig from "../appconfig"

export default function Home({navigation}) {
  let audioList = getAudioPlaylists();
  let videoList = getVideoPlaylists();

  useEffect(() => {
    getUpdates(navigation);
    checkShare().then(data => {
      navigation.navigate('Update', {playlists: data, type: 'share'});
    });
  }, []);


  return (
    <View>
      <Image
        source={require('../assets/logo.png')}
        style={{
          alignSelf: 'center',
          marginTop: 40,
          width: 150,
          height: 150,
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          fontSize: 30,
          fontFamily: 'Quicksand-Bold',
        }}>
        {appConfig.appName}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 17,
          marginBottom: 30,
          color: 'grey',
          fontFamily: 'Quicksand-Regular',
        }}></Text>

      {[
        {
          image: require('../assets/video.png'),
          list: videoList,
          title: 'Videos',
          navigateTo: 'Videos',
        },
        {
          image: require('../assets/audio.png'),
          list: audioList,
          title: 'Audios',
          navigateTo: 'Audios',
        },
      ].map((item, index) => (
        <View style={styles.container} key={index}>
          <Image
            style={{
              alignSelf: 'center',
            }}
            source={item.image}
          />
          <View style={{marginTop: 10, flex: 1, marginLeft: 10}}>
            <Text style={styles.playlistTitle}>{item.title}</Text>
            <Text style={{color: '#8f8f8f', fontFamily: 'Quicksand-Regular'}}>
              {item.list.length} Items
            </Text>
          </View>
          <Button
            type="clear"
            containerStyle={styles.button}
            title="View Playlists"
            titleStyle={styles.playlistButton}
            onPress={() => navigation.navigate(item.navigateTo)}
          />
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 5,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderColor: '#E4E4E4',
    borderRadius: 10,
    borderWidth: 2,
  },
  playlistTitle: {
    color: '#385157',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  playlistButton: {
    color: '#333333',
    fontWeight: '500',
    fontSize: 15,

    paddingRight: 20,
    paddingLeft: 20,
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
