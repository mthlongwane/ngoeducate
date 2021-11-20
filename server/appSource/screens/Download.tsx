import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect, useState} from 'react';
import {downloadFile} from '../utils/utils';

interface DownloadItem {
  url: string;
  title: string;
  fileName: string;
}

const Download = ({
  downloadItems,
  onComplete,
}: {
  downloadItems: DownloadItem[];
  onComplete: Function;
}) => {
  const [downloaded, setDownloaded] = useState<number>(0);
  useEffect(() => {
    downloadItems.forEach(async (item, index) => {
      downloadFile(item).then(() => {
        setDownloaded(prv => prv + 1);
      });
    });
  }, []);

  useEffect(() => {
    if (downloaded === downloadItems.length) {
      onComplete();
    }
  }, [downloaded]);

  return (
    <Modal isVisible={true}>
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.title}>
          Downloading {downloadItems.length} files...
        </Text>

        <Text style={styles.fileTitle}>
          {downloaded}/{downloadItems.length} Done
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  fileTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
});
export default Download;
