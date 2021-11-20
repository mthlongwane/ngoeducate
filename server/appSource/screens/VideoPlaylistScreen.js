import * as React from 'react';
import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import {Button} from 'react-native-elements';
import { getVideoPlaylists } from '../utils/utils';

export default function VideoPlayListScreen({navigation}) {
  let list = getVideoPlaylists();
  return (
    <ScrollView>
      {list.length == 0 && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
            flex: 1,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Quicksand-Bold',
              color: '#666666',
              fontSize: 20,
            }}>
            This playlist is empty!
          </Text>
          <Button
            type="clear"
            containerStyle={styles.button}
            title="Return"
            titleStyle={{
              color: '#333333',
              fontFamily: 'Quicksand-Bold',
            }}
            onPress={() => navigation.goBack(null)}
          />
        </View>
      )}
      {list.map((item, index) => (
        <View key={index} style={styles.container}>
          <Image
            source={require('../assets/video.png')}
            style={{
              alignSelf: 'center',
            }}
          />
          <View style={{marginTop: 10, flex: 1, marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#696969'}}>{item.title}</Text>

              {/* {!item.embedded && (
                <Ionicons
                  style={{paddingLeft: 3}}
                  name={'cloud-download-outline'}
                  size={18}
                  color="#000000"
                />
              )} */}
            </View>
            <Text style={{color: '#8f8f8f', fontFamily: 'Quicksand-Regular'}}>
              {item.files.length} Videos
            </Text>
          </View>
          <Button
            type="clear"
            containerStyle={styles.button}
            title="Watch"
            titleStyle={{
              color: '#333333',
              fontFamily: 'Quicksand-Bold',
            }}
            onPress={() => navigation.navigate('VideoList', {data: item})}
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
    width: '40%',
    marginVertical: 10,
    borderRadius: 8,
  },
});
