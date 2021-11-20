import {MMKV} from 'react-native-mmkv';
import {PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import {zip, unzip} from 'react-native-zip-archive';
import {NativeModules} from 'react-native';
import config from "../appconfig";

function getStorage() {
  return new MMKV();
}

export const requestPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Downloads Folder Permissions',
        message: 'Access to Downloads for manage shares',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
    }
  } catch (err) {
    console.warn(err);
  }
};

/**
 * Returns an object of all playlists with playlist ids as keys
 */
export function getAllPlaylists() {
  const storage = getStorage();
  let playlists = [];
  storage
    .getAllKeys()
    .filter(key => key.includes('pl_'))
    .forEach(key => {
      let obj = JSON.parse(storage.getString(key));
      playlists.push(obj);
    });

  return playlists;
}

export function getVideoPlaylists() {
  const storage = getStorage();
  let videos = [];
  storage
    .getAllKeys()
    .filter(key => key.includes('vpl_'))
    .forEach(key => {
      let obj = JSON.parse(storage.getString(key));
      videos.push(obj);
    });
  return videos;
}

export function getAudioPlaylists() {
  const storage = getStorage();
  let videos = [];
  storage
    .getAllKeys()
    .filter(key => key.includes('apl_'))
    .forEach(key => {
      let obj = JSON.parse(storage.getString(key));
      videos.push(obj);
    });
  return videos;
}

export function initDB(callback) {
  const storage = getStorage();
  // storage.clearAll();
  if (storage.getBoolean('db_initialized') === true) {
    console.log('Db is already initilized; skipping');
    callback();
    return;
  }

  RNFS.readFileRes('playlist.json')
    .then(str => {
      let playlists = JSON.parse(str);
      playlists.forEach(pl => {
        if (pl.type === 'video') {
          storage.set('vpl_' + pl.id, JSON.stringify(pl));
        } else if (pl.type === 'audio') {
          storage.set('apl_' + pl.id, JSON.stringify(pl));
        }
      });
      storage.set('db_initialized', true);
      callback();
    })
    .catch(reason => {
      console.error('Failed to read playlist.json', reason);
    });
}

export function copyMediaFromAssets() {
  var RNFS = require('react-native-fs');

  RNFS.readDir(RNFS.DocumentDirectoryPath).then(items => {
    // Copy audio/videos from assets to document directory, if not added before
    getAllPlaylists().forEach(pl => {
      pl.files.forEach(file => {
        RNFS.readFileRes(file.fileName, 'base64')
          .then(value => {
            RNFS.writeFile(
              `${RNFS.DocumentDirectoryPath}/${file.fileName}`,
              value,
              'base64',
            );
          })
          .catch(err => {});
      });
    });
  });
}

export function getUpdates(navigation) {
  fetch(`${config.serverURL}/apps/all`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      filterUpdateList(json);

      json.playlists.forEach(pl => {
        // Show update screen if there is at least one playlist to update
        if (!pl.ignore) {
          navigation.navigate('Update', {
            playlists: json.playlists,
            type: 'update',
          });
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
}

const filterUpdateList = obj => {
  let playlists = getAllPlaylists();

  obj.playlists.forEach((updateListItem, index) => {
    if (updateListItem.files.length === 0) {
      delete obj.playlists[index];
    }
    let playlistToCompare = playlists.find(
      item => item.id == updateListItem.id,
    );
    // It's a new playlist, don't ignore any file
    if (!playlistToCompare) {
      return;
    }

    updateListItem.files.forEach((updateFile, fileIndex) => {
      if (
        playlistToCompare.files
          .map(file => `${file.id}`)
          .includes(`${updateFile.id}`)
      ) {
        obj.playlists[index].files[fileIndex].ignore = true;
      }
    });

    if (updateListItem.files.every(file => file.ignore == true)) {
      obj.playlists[index].ignore = true;
    }
  });

  return obj;
};
export function updatePlaylists(selected, playlists) {
  const storage = getStorage();
  let addedFiles = [];
  playlists.forEach((pl, plIndex) => {
    // If playlist is not in update list
    if (!selected[pl.id]) {
      return;
    }

    pl.files.forEach((file, index) => {
      if (selected[pl.id][file.id] === false) {
        pl.files.splice(index, 1);
        return;
      }
      if (selected[pl.id][file.id] === true) {
        addedFiles.push(file);
      }
    });

    // If playlist has no files selected, remove it
    if (pl.files.length == 0) {
      pl.splice(plIndex, 1);
      return;
    }

    if (pl.type == 'video') {
      storage.set('vpl_' + pl.id, JSON.stringify(pl));
    } else if (pl.type == 'audio') {
      storage.set('apl_' + pl.id, JSON.stringify(pl));
    }
  });

  return addedFiles;
}

export function createDataForShare(fileNames: any[]) {
  let playlists = getAllPlaylists();
  let data = [...playlists];
  playlists.forEach((playlist, plIndex) => {
    let files: any[] = playlist.files;
    playlists[plIndex].files = files.filter(file =>
      fileNames.includes(file.fileName),
    );
  });

  playlists = playlists.filter(pl => pl.files.length > 0);

  return playlists;
}

export function fileExists(fileName) {
  return new Promise(resolve => {
    RNFS.stat(`${RNFS.DocumentDirectoryPath}/${fileName}`)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

function copyFile(
  fileName: string,
  filePath: string,
  targetDir: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    RNFS.stat(filePath)
      .then(() => {
        RNFS.copyFile(filePath, targetDir + '/' + fileName)
          .then(() => {
            resolve(true);
          })
          .catch(reason => {
            reject();
            console.log('Failed to copy file', reason);
          });
      })
      .catch(() => {
        reject();
        console.error(`${filePath} not found`);
      });
  });
}

export function createZipForShare(fileNames: string[], callback) {
  let targetDir = `${RNFS.DocumentDirectoryPath}/share-temp-dir/`;
  let targetFile = `${RNFS.DocumentDirectoryPath}/ngoshare.zip`;

  RNFS.mkdir(targetDir);

  const data = createDataForShare(fileNames);

  // data.json includes info about playlists and filenames
  let writeJson = RNFS.writeFile(
    `${targetDir}/data.json`,
    JSON.stringify(data, null, 2),
  );

  writeJson.then(() => {
    // First move all files to a single folder (because zip function supports only directories as input)
    const copyTask = file => {
      let sourceFile = `${RNFS.DocumentDirectoryPath}/${file}`;
      return copyFile(file, sourceFile, targetDir);
    };
    Promise.all(fileNames.map(copyTask))
      .then(() => {
        zip(targetDir, targetFile)
          .then(() => {
            callback(targetFile);
            // Delete temporary directory used for zip
            RNFS.unlink(targetDir);
          })
          .catch(reason => {
            console.error('Failed to create archive for share file', reason);
          });
      })
      .catch(r => {
        console.error('Copying files for creating zip files failed.');
      });
  });
}

export function downloadFile({url, fileName}: {url: string; fileName: string}) {
  return RNFS.downloadFile({
    fromUrl: url,
    toFile: RNFS.DocumentDirectoryPath + '/' + fileName,
  }).promise;
}
export function checkShare(navigation) {
  const {NGOEducation} = NativeModules;
  // Check if any package(containing playlist) is received in download folder
  let zipPath = RNFS.DocumentDirectoryPath + '/ngoshare.zip';

  return new Promise((resolve, reject) => {
    RNFS.stat(zipPath)
      .then(path => {
        let source = zipPath;
        let target = RNFS.DocumentDirectoryPath + '/share-unzip/';
        unzip(source, target).then(path => {
          // data
          RNFS.readFile(`${path}/data.json`).then(str => {
            let data = JSON.parse(str);
            RNFS.unlink(zipPath);
            resolve(data);
          });
        });
      })
      .catch(err => {
        // File doesn't exists
        reject(err);
      });
  });
}
