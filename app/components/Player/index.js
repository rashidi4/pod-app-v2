import {useEffect, useCallback, useState} from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import {millisToString, roundSecondsDown} from '../../util';

export const useCurrentMinute = () => {

  let positionMillis = 0;
  if (Player.playbackStatus && Player.playbackStatus.positionMillis) {
    positionMillis = Player.playbackStatus.positionMillis;
  }
  const initialMinute = roundSecondsDown(
    millisToString(positionMillis, true)
  );
  const [currentMinute, setCurrentMinute] = useState(initialMinute);
  const updateMinute = useCallback((playbackStatus) => {
    if (!playbackStatus.isLoaded) {
      return;
    }
    const { positionMillis } = playbackStatus;
    const updatedMinute = roundSecondsDown(
      millisToString(positionMillis, true)
    );

    if (currentMinute !== updatedMinute) {
      setCurrentMinute(updatedMinute);
    }
  }, []);
  useEffect(() => {
    Player.on(updateMinute);
    return () => {
      Player.off(updateMinute);
    }
  }, []);
  return currentMinute;
};


const { bucketName } = Constants.manifest.extra.storage;

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  playThroughEarpieceAndroid: false
});


// function timeout(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

let to = null;
function debounce(fn, timeout = 200) {
  if (to) clearTimeout(to);
  return new Promise(resolve => {
    to = setTimeout(() => {
      resolve(fn());
    }, timeout);
  });
}


const eventHandler = playbackStatus => {

  Player.playbackUpdates.forEach(fn => {
    fn(playbackStatus);
  });

  // load
  if (Player.playbackStatus.shouldPlay !== playbackStatus.shouldPlay ||
    Player.playbackStatus.isPlaying !== playbackStatus.isPlaying ) {
    Player.playerEvents.onLoad.forEach(fn => {
      fn(playbackStatus.shouldPlay === playbackStatus.isPlaying);
    });
  }

  // shouldPlay
  if (Player.playbackStatus.shouldPlay !== playbackStatus.shouldPlay) {
    Player.playerEvents.shouldPlay.forEach(fn => {
      fn(playbackStatus);
    });
  }

  // play event
  if (!Player.playbackStatus.isPlaying && playbackStatus.isPlaying) {
    Player.playerEvents.play.forEach(fn => {
      fn(playbackStatus);
    });
  }

  // pause event
  if (Player.playbackStatus.isPlaying && !playbackStatus.isPlaying) {
    Player.playerEvents.pause.forEach(fn => {
      fn(playbackStatus);
    });
  }
  // justDidFinish
  if (playbackStatus.didJustFinish) {
    Player.playerEvents.didJustFinish.forEach(fn => {
      fn(playbackStatus);
    });
  }

  const diff = Math.abs(playbackStatus.positionMillis - Player.playbackStatus.lastThirtyPositionMillis);
  if (diff > 30 * 1000 || typeof Player.playbackStatus.lastThirtyPositionMillis === 'undefined') {
    playbackStatus.lastThirtyPositionMillis = playbackStatus.positionMillis;
    Player.playerEvents.thirtySecond.forEach(fn => {
      fn(playbackStatus);
    });
  }


  Player.playbackStatus = {
    lastThirtyPositionMillis: Player.playbackStatus.lastThirtyPositionMillis,
    ...playbackStatus
  };

};
export default class Player {
  static playbackObject = Player.playbackObject || new Audio.Sound();//eslint-disable-line
  static playbackUpdates = [];
  static playbackStatus = {};
  static playerEvents = {
    pause: [],
    play: [],
    didJustFinish: [],
    shouldPlay: [],
    onLoad: [],
    thirtySecond: [],
    loadBucket: [],
    unloadBucket: [],

  };
  static episode;

  static setItem(episode){
    Player.episode = episode;
  }

  static on(cb) {
    // const exists = this.playbackUpdates.indexOf(cb);
    // if (exists > -1) return;
    Player.off(cb);
    Player.playbackUpdates.push(cb)
  }

  static off(cb) {
    const exists = Player.playbackUpdates.indexOf(cb);
    if (exists > -1) {
      Player.playbackUpdates.splice(exists, 1);
    }
  }

  static offEvent(eventName, cb) {
    if (Player.playerEvents[eventName]) {
      const exists = Player.playerEvents[eventName].indexOf(cb);
      if (exists > -1) {
        Player.playerEvents[eventName].splice(exists, 1);
      }
    }
  }

  static onEvent(eventName, cb) {
    if (Player.playerEvents[eventName]) {
      Player.offEvent(eventName, cb);
      Player.playerEvents[eventName].push(cb);
    }
  }


  static async loadClipAsync({ clip, episode }, opts ={}) {

    if (Player?.clip?.id === clip.id) {
      return;
    }
    if (Player.clip) {
      // await Player.pause();
    }
    await Player.unloadAsync();

    Player.episode = episode;//eslint-disable-line
    Player.clip = clip;//eslint-disable-line
    const { filepath } = clip;
    const uri = `https://storage.googleapis.com/${bucketName}/${filepath}`;
    return Player.playbackObject.loadAsync({ uri }, opts)
      .catch(err => {
        console.log('urrrr', err);
      });
  }

  static async loadAsync({ episode, clip }, opts = {}, { forceUnload = false, debounceTO = 200 } = {} ) {

    return debounce(async () => {
      //
      // let forceUpdate = false;
      if (Player.episode) {
        if (Player.episode.id !== episode.id) {
          await Player.pause();
          Player.episode = episode;//eslint-disable-line
        }
        await Player.unloadAsync();
      }
      Player.episode = episode;//eslint-disable-line
      if (clip) {
        return Player.loadClipAsync({clip, episode}, opts);
      }
      Player.clip = null;// eslint-disable-line
      if (forceUnload) {
        await Player.unloadAsync();
        Player.episode = episode;//eslint-disable-line
      }
      const {audio, isDownloaded, id} = Player.episode;// isDownloaded is local download to fs for offline play
      if (audio.uri) {
        // need to fetch first to check for redirects
        // mainly assume for ads but one audio.uri
        // can redirect to many differt versions of the audio file
        // so get the version first and updated the episode


        // let redirectUri = audio.uri;
        // if (!isDownloaded) {
        //   try {
        //     console.log('getting url');
        //     redirectUri = await getRedirectUrl(audio.uri);
        //     console.log('redurectiru', redirectUri);
        //     if (redirectUri && redirectUri !== audio.uri) {
        //       Player.episode.audio.redirectUri = redirectUri;//eslint-disable-line
        //     }
        //   } catch (e) {
        //     console.log(e);
        //   }
        // }

        const uri = isDownloaded
          ? `${FileSystem.documentDirectory}${id}.mp3`
          : audio.uri;
        return Player.playbackObject.loadAsync({uri}, opts)
          .then(playbackStatus => {
            Player.episode.audio.durationMillis = playbackStatus.durationMillis;
            return playbackStatus;
          })
          .catch(err => {
            console.log('WHAT', err);
            if (isDownloaded) {
              // remove the download
              // this should probably be donw withe a mutation
              Player.episode.isDownloaded = false;
              FileSystem.deleteAsync(uri);
            }
          });
      }

      return Promise.resolve();
    }, debounceTO);
  }

  static unloadAsync() {
    return Player.playbackObject.unloadAsync().then(() =>{
      Player.episode = null;
      Player.clip = null;
    });
  }

  static play(){
    return Player.playbackObject.setStatusAsync({ shouldPlay: true });
  }

  static pause(){
    return Player.playbackObject.pauseAsync();
  }

  static setStatusAsync(...args) {
    return Player.playbackObject.setStatusAsync(...args);
  }

  static seek(n) {
    const { positionMillis } = this.playbackStatus;
    const millis = n * 1000;
    return debounce(() => {
      return Player.playbackObject.playFromPositionAsync(positionMillis + millis)
    });
  }
  static seekTo(millis) {
    return debounce(() => {
      return Player.playbackObject.playFromPositionAsync(millis);
    });

  }

  static setPosition(millis) {
    return Player.playbackObject.setPositionAsync(millis);
  }

  static async loadBucketPath({ positionMillis: optsPositionMillis, shouldPlay = false } = {}) {

    const { episode, playbackStatus } = Player;
    const { bucketPath } = episode.audio;
    if (bucketPath && playbackStatus) {
      const positionMillis = typeof optsPositionMillis !== 'undefined'
        ? optsPositionMillis
        : Player.playbackStatus.positionMillis;

      // pod-audio-clips-stage/episodes/5e470af89ea7e1895d332898/podcasts/5e470af89ea7e1895d332912/full.mp3
      const uri = `https://storage.googleapis.com/${bucketName}/${bucketPath}`;

      await Player.playbackObject.unloadAsync();
      await Player.playbackObject.loadAsync(
        { uri },
        { positionMillis, shouldPlay });

      Player.bucketLoaded = true; //eslint-disable-line
      Player.playerEvents.loadBucket.forEach(fn => fn());
    }
  }

  static async unloadBucketPath() {

    const { episode, playbackStatus = {}, bucketLoaded } = Player;
    if (!bucketLoaded) {
      return;
    }
    const { positionMillis = 0 } = playbackStatus;
    await Player.playbackObject.unloadAsync();
    await Player.loadAsync({ episode }, {positionMillis});
    Player.playbackStatus = playbackStatus;//eslint-disable-line
    Player.bucketLoaded = false; //eslint-disable-line
    Player.playerEvents.unloadBucket.forEach(fn => fn());


  }
}

Player.playbackObject.setOnPlaybackStatusUpdate(eventHandler);
