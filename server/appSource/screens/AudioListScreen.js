import * as React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Audio} from 'expo-av';

export default function AudioListScreen({navigation, route}) {
  const data = route.params.data;
  const [sound, setSound] = React.useState();
  const [playing, setPlaying] = React.useState();
  const [soundStatus, setSoundStatus] = React.useState();
  const [duration, setDuration] = React.useState(0);
  const [interval, setIntervals] = React.useState();

  async function playSound(audio) {
    item = audio.title;
    if (item !== playing) {
      setSound();
      const {sound} = await Audio.Sound.createAsync(sound.content);
      const st = await sound.getStatusAsync();
      setDuration(st.durationMillis / 1000);
      setSound(sound);
      setPlaying(item);
      setSoundStatus(true);
      await sound.playAsync();
      soundTimer();
    } else if (soundStatus) {
      await sound.pauseAsync();
      setSoundStatus(false);
      clearInterval(interval);
    } else if (!soundStatus) {
      await sound.playAsync();
      setSoundStatus(true);
      soundTimer();
    }
  }

  function stopSound() {
    sound.unloadAsync();
    setSound();
    setSoundStatus(false);
    setDuration(0);
    clearInterval(interval);
  }

  function soundTimer() {
    setIntervals(
      setInterval(() => {
        setDuration(lastTimerCount => {
          if (lastTimerCount <= 1) {
            sound.unloadAsync();
            setSound();
            setSoundStatus(false);
            clearInterval(interval);
          }
          return lastTimerCount - 1;
        });
      }, 1000),
    );
  }

  function showTime(time) {
    let min = (time / 60).toString().split('.')[0];
    let sec = (time % 60).toString().split('.')[0];
    if (sec.length == 1) sec = '0' + sec;
    return min + ':' + sec;
  }

  React.useEffect(() => {
    return sound
      ? async () => {
          sound.unloadAsync();
          setSound();
          setSoundStatus(false);
          clearInterval(interval);
        }
      : undefined;
  }, [sound]);

  return (
    <ScrollView>
      {data.files.map((item, index) => {
        console.log('--->', data);
        return (
          <View key={index} style={styles.container}>
            <Text
              style={{
                fontFamily: 'Quicksand-Regular',
                fontSize: 20,
                alignSelf: 'center',
              }}>
              {item.title}
            </Text>
            <View style={{flexDirection: 'row', paddingRight: 20}}>
              <Ionicons
                name={
                  soundStatus && item.title === playing ? 'md-pause' : 'md-play'
                }
                size={25}
                color="#333333"
                onPress={() => playSound(item)}
              />
              {sound && item.title === playing ? (
                <View>
                  <Text>{showTime(duration)}</Text>
                </View>
              ) : undefined}
              {sound && item.title === playing ? (
                <View>
                  <Ionicons
                    name="md-stop"
                    size={25}
                    color="#333333"
                    onPress={stopSound}
                  />
                </View>
              ) : undefined}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 5,
    padding: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderColor: '#E4E4E4',
    borderRadius: 10,
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#7D00FF',
    margin: 5,
    padding: 5,
    color: '#ffffff',
    borderRadius: 10,
  },
});
