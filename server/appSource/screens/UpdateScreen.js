import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {updatePlaylists} from '../utils/utils';
import {useIsFocused} from '@react-navigation/native';
import UpdateImage from '../assets/update.png';
import ShareImage from '../assets/newshare.png';
import Download from './Download';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});

function UpdateScreen({navigation, route}) {
  const isFocused = useIsFocused();
  let {playlists, type} = route.params;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDownload, setStartDownload] = useState([]);

  let labels = {
    update: {
      icon: UpdateImage,
      submitTitle: 'Download for offline view',
      title: 'Updates Available',
      ignoreButtonTitle: 'No, thanks!',
    },
    share: {
      icon: ShareImage,
      submitTitle: 'Add selected files',
      title: 'New files received',
      ignoreButtonTitle: 'Ignore and delete',
    },
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: type === 'share' ? 'Files shared with you' : 'Updates available',
    });
  }, [navigation, type]);

  useEffect(() => {
    let files = {};
    playlists.forEach(pl => {
      if (!pl.ignore) {
        files[pl.id] = {};
      }
      pl.files.forEach(f => {
        if (!f.ignore) {
          files[pl.id][f.id] = true;
        }
      });
    });

    setSelectedFiles(files);
  }, [isFocused, playlists]);

  useEffect(() => {
    if (selectedFiles) {
      setIsLoading(false);
    }
  }, [selectedFiles]);

  const handleUpdate = ({download, type}) => {
    let addedFiles = updatePlaylists(selectedFiles, playlists);
    if (download && type !== 'share') {
      setStartDownload(addedFiles);
    } else {
      navigation.navigate('Home');
    }
  };

  const handleChange = (playlistId, fileId, value) => {
    let selected = {...selectedFiles};
    selected[playlistId][fileId] = value;
    setSelectedFiles(selected);
  };

  const handleDownloadCompleted = () => {
    setStartDownload([]);
    navigation.navigate('Home');
  };
  const getCheckboxValue = (playlistId, fileId) => {
    return selectedFiles[playlistId][fileId];
  };

  if (isLoading) {
    return null;
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 50,
      }}>
      <Image source={labels[type].icon} style={{width: 100, height: 100}} />
      <Text
        style={{
          fontSize: 25,
          marginBottom: 20,
          fontWeight: '500',
          fontFamily: 'Quicksand-Bold',
        }}>
        {labels[type].title}
      </Text>

      <View
        style={{
          flex: 1,
          paddingLeft: 30,
          marginTop: 15,
          alignSelf: 'flex-start',
        }}>
        {startDownload.length > 0 && (
          <Download
            isVisible={true}
            downloadItems={startDownload}
            onComplete={handleDownloadCompleted}
          />
        )}

        {playlists.map((item, index) => {
          if (item.ignore) {
            return null;
          }
          return (
            <View key={index}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 25,
                  marginBottom: 20,
                  fontWeight: '500',
                }}>
                Playlist: {item.title}
              </Text>
              {item.files.map((file, index) => {
                if (file.ignore) {
                  return null;
                }
                return (
                  <View style={styles.container} key={index}>
                    <CheckBox
                      disabled={false}
                      onCheckColor="purple"
                      tintColors={{true: '#2C3D55', false: 'gray'}}
                      value={getCheckboxValue(item.id, file.id)}
                      onValueChange={value =>
                        handleChange(item.id, file.id, value)
                      }
                    />
                    <Text style={{fontSize: 20, paddingLeft: 8}}>
                      {file.title}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>

      <View>
        <View>
          {type !== 'share' && (
            <View style={{marginBottom: 10}}>
              <Button
                color="#3E4C5E"
                onPress={() => handleUpdate({download: false})}
                title="Add to library (Online view)"
              />
            </View>
          )}

          <View style={{}}>
            <Button
              color="#3E4C5E"
              onPress={() => handleUpdate({download: true, type: 'share'})}
              title={labels[type].submitTitle}
            />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Button
            color={'gray'}
            onPress={() => {
              navigation.navigate('Home');
            }}
            title={labels[type].ignoreButtonTitle}
          />
        </View>
      </View>
    </View>
  );
}

export default UpdateScreen;
