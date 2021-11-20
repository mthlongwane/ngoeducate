import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import Toast from 'react-native-root-toast';

import Video from 'react-native-video';
import {Button} from 'react-native-elements';
import Share from 'react-native-share';
import {createZipForShare, fileExists} from '../utils/utils';
import shareIcon from '../assets/share.png';
var RNFS = require('react-native-fs');

export default function VideoListScreen({route, navigation}) {
  const data = route.params.data;
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [currentFile, setCurrentFile] = React.useState();
  const [play, setPlay] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: data.title,
      headerRight: () => {
        return (
          <Pressable onPress={() => handleShare(data.files)}>
            <Image source={shareIcon} />
          </Pressable>
        );
      },
    });
  }, [navigation]);

  const handleShare = async file => {
    let files = data.files;

    if (file) {
      let fileIsOffline = await fileExists(file.fileName);
      if (!fileIsOffline) {
        alert('Only offline files could be shared!');
        return;
      }

      files = [file];
    }

    let toast = Toast.show('Creating Share file. Please wait...', {});
    createZipForShare(
      files.map(file => file.fileName),
      shareFilePath => {
        RNFS.copyFile(
          shareFilePath,
          RNFS.DownloadDirectoryPath + '/ngoshare.zip',
        )
          .then(() => {
            Toast.hide(toast);
            console.log('saved');
          })
          .catch(r => {
            console.error('not saved', r);
          });
        RNFS.readFile(shareFilePath, 'base64').then(value => {
          Share.open({
            title: 'Share playlist',
          })
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              err && console.log(err);
            });
        });
      },
    );
  };

  function videoSelect(file) {
    setPlay(true);
    setCurrentFile(file);
  }

  React.useEffect(() => {
    setCurrentFile(data.files[0]);
  }, []);

  React.useEffect(() => {
    if (currentFile && !currentFile.source) {
      getVideoSource();
    }
  }, [currentFile]);

  const getVideoSource = () => {
    if (!currentFile) return;

    if (currentFile) {
      let filePath = `${RNFS.DocumentDirectoryPath}/${currentFile.fileName}`;

      fileExists(currentFile.fileName).then(exists => {
        if (exists) {
          console.log(`Loaded file from local storage`, 'file://' + filePath);
          setCurrentFile(prv => ({...prv, source: 'file://' + filePath}));
        } else {
          console.log('Loading from url');
          setCurrentFile(prv => ({...prv, source: currentFile.url}));
        }
      });
    }
  };

  return (
    <View
      style={{
        flexDirection: 'column',
      }}>
      <View
        style={{
          height: 300,
        }}>
        {currentFile && currentFile.source && (
          <Video
            ref={video}
            style={styles.video}
            source={{uri: currentFile.source}}
            resizeMode="contain"
            shouldPlay={play}
            controls={true}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />
        )}
      </View>
      <ScrollView
        style={{
          marginHorizontal: 10,
        }}>
        {data.files.map((file, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginVertical: 10,
            }}>
            <View style={{flex: 1}}>
              <Button
                key={index}
                type="clear"
                containerStyle={
                  currentFile && currentFile.fileName === file.fileName
                    ? styles.buttonPlay
                    : styles.button
                }
                title={file.title}
                titleStyle={{
                  fontFamily: 'Quicksand-Bold',
                  color:
                    currentFile && currentFile.fileName === file.fileName
                      ? '#ffffff'
                      : 'black',
                }}
                onPress={() => videoSelect(file)}
              />
            </View>
            <View style={{marginHorizontal: 5}}>
              <Pressable onPress={() => handleShare(file)}>
                <Image source={shareIcon} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 5,
    padding: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderColor: '#E4E4E4',
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonPlay: {
    backgroundColor: '#158ECD',
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderColor: '#E4E4E4',
    borderWidth: 2,
  },
});
