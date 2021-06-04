import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {NavigationEvents} from 'react-navigation';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import styled from 'styled-components/native';
import Player from '../../components/Player';
import {HideableContent, getFall} from '../../components/BottomSheet';
import variables from '../../components/styles/variables';
import AudioSnippetController from './components/AudioSnippet/AudioSnippetController.component';
import {PageWrapper, WebOnlyHeightHack, Img, Gutter, Grid} from '../../components/styles';
import {getMinutes} from './components/Equalizer.component';
import Duration, {Text as DurationText} from './components/Duration.component';
import PlayPauseBtn from './components/PlayPauseBtn.component';
import Description from './components/Description.component';
import {millisToString} from '../../util';
import Download from './components/Download.component';
import {GlobalContext} from '../../util/GlobalContext';

const {Row, Col} = Grid;
const windowHeight = Dimensions.get('window').height;
const HEADER_MAX_HEIGHT = Math.min(
  Math.floor(windowHeight * 0.35),
  340,
);
const IMAGE_HEIGHT = HEADER_MAX_HEIGHT - 40;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


const to = {
  pointer: null,
  count: 0
};
const debounceSeek = (n, cb) => {
  to.count++;
  if (to.pointer) {
    clearTimeout(to.pointer);
  }
  to.pointer = setTimeout(() => {
    cb(n * to.count);
    to.count = 0;
    to.pointer = null;
  }, 200);
};

class Playing extends Component {

  static navigationOptions = ({navigation}) => {
    const item = Player.episode || navigation.getParam('item', {});
    const podcast = navigation.getParam('podcast', {});
    return {
      headerShown: true,
      title: podcast && podcast.title || item && item.title || 'Now Playing',
      headerStyle: {
        backgroundColor: variables.YELLOW,
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        boxShadow: 'none'
      },
      headerRight: () => {
        const style = {
          marginRight: 15
        };
        return (
          <TouchableOpacity
            style={style}
            onPress={() => navigation.navigate('Podcast', {item, podcast})}
            title="Details"
          >
            <DetailsText>
              Details
            </DetailsText>
          </TouchableOpacity>
        );
      },
    };
  };

  static contextType = GlobalContext;

  constructor(props) {
    super(props);

    this.playbackStatus = {
      ...Player.playbackStatus
    };
    this.state = {
      scrollY: new Animated.Value(0),
    };
    this.fall = getFall();
  }

  async componentDidMount() {
    const { episode, clip } = Player;
    this.context.closeTabBarPlayer();
    if (clip) {
      const { startMillis = 0} = clip;
      Player.loadAsync({episode}, { positionMillis: startMillis, shouldPlay:false }, true);
    }
    Player.on(this.onPlayerUpdate);
    Player.onEvent('unloadBucket', () => {
      this.forceUpdate();
    });
    // hack to prevent freezing on android
    setTimeout(() => {
      this.forceUpdate();
    }, 200)
  }

  componentWillUnmount() {
    //this.player.unloadAsync();
    this.context.openTabBarPlayer();
    Player.off(this.onPlayerUpdate);
  }

  onPlayerUpdate = (playbackStatus) => {
    /*
      {
      "didJustFinish": false,
      "durationMillis": 11907160,
      "hasJustBeenInterrupted": false,
      "isBuffering": false,
      "isLoaded": true,
      "isLooping": false,
      "isMuted": false,
      "isPlaying": false,
      "pitchCorrectionQuality": "Varispeed",
      "playableDurationMillis": 32052,
      "positionMillis": 0,
      "progressUpdateIntervalMillis": 500,
      "rate": 1,
      "shouldCorrectPitch": false,
      "shouldPlay": false,
      "uri": "http://traffic.libsyn.com/joeroganexp/mmashow083.mp3?dest-id=19997",
      "volume": 1,
    }
    */

    const update = this.shouldUpdate(playbackStatus);

    this.playbackStatus = playbackStatus;
    if (update) {
      this.forceUpdate();
    }

  };

  shouldUpdate = (playbackStatus) => {
    if (this.playbackStatus.isLoaded !== playbackStatus.isLoaded) {
      return true;
    }
    if (this.playbackStatus.isBuffering !== playbackStatus.isBuffering) {
      return true;
    }

    return this.playbackStatus.durationMillis !== playbackStatus.durationMillis;

  };

  overlayRefs = {
    share: React.createRef(),
    tag: React.createRef()
  };

  to = null;

  onValueChange = (minute) => {
    if (this.to) {
      clearTimeout(this.to);
    }

    this.to = setTimeout(() => {
      Player.seekTo(minute * 60 * 1000);
    }, 500);
  };

  handleClick = (page) => {
    const {navigation} = this.props;
    navigation.navigate(page);
  };

  handlePress = (type) => {
    const {navigation} = this.props;

    return () => {
      const episodeFromProps = navigation.getParam('episode', {});
      const {episode = episodeFromProps} = Player;
      const podcast = navigation.getParam('podcast', {});
      if (type === 'share') {
        Player.pause().then(() => {
          navigation.navigate('SharePage', {episode, podcast});
        });
      } else {
        this.overlayRefs[type].current.snapTo(0);
      }

    }
  };

  seek = (n) => {
    const {playbackStatus} = Player;

    if (playbackStatus.isLoaded) {
      debounceSeek(n, (v) => {
        Player.seek(v);
      });
    }
  };

  getMinutes = () => {
    const {positionMillis = 0, durationMillis = 0} = Player.playbackStatus;
    return {
      totalMinutes: getMinutes(durationMillis),
      currentMinute: getMinutes(positionMillis)
    };
  };

  onPressDownloads = () => {
    const {navigation} = this.props;
    // navigation.popToTop();
    // setTimeout(() => {
    //
    // }, 200);
    navigation.navigate('Downloads', {tab: 'downloaded'});
  };

  updateStatusBar = () => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(variables.YELLOW);
  };


  render() {
    const {navigation} = this.props;
    const episodeFromProps = navigation.getParam('episode', {});
    const {episode = episodeFromProps} = Player;
    const {playbackStatus = {}} = Player;
    const podcast = navigation.getParam('podcast', {});
    const clip = navigation.getParam('clip', null);
    if (!episode) return null;

    const imageUri = episode.image && episode.image.uri
      ? episode.image.uri
      : podcast.image.uri;

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 10, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });

    const titleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE - 50, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });
    const titleOpacityStart = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -50],
      extrapolate: 'clamp',
    });
    return (
      <PageWrapper>
        <NavigationEvents
          onDidFocus={this.updateStatusBar}
          onWillBlur={payload => {
            /*
             if screen is about to change this will be triggred
             In screen 'MyScreen2' you can get it with navigation.params
            */
            // hack cause when there is switch between tab navigators
            // params gets lost. this will navigate again, but param will work
            // second time.
            if (payload.action.routeName === 'Downloads') {
              this.props.navigation.navigate('Downloads', {tabIndex: 1, once: new Date().getTime()});
              // console.log(this, this.props);
            }

          }}
        />
        <HideableContent fall={this.fall}>
          <WebOnlyHeightHack>
            <Body>
              <Gutter style={styles.fill}>
                <ScrollView
                  bounces={false}
                  style={styles.fill}
                  scrollEventThrottle={16}
                  onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                  )}
                >
                  <TrackInfo style={styles.scrollViewContent}>
                    <Animated.View style={[styles.bar, {opacity: titleOpacityStart}]}>
                      <TrackName>{episode.title}</TrackName>
                      <Time>{millisToString(playbackStatus.durationMillis)}</Time>
                    </Animated.View>
                    {episode.description && <Description html={episode.description}/>}
                  </TrackInfo>
                </ScrollView>
                <LinearGradient
                  start={[0, 0]}
                  end={[0, 0.5]}
                  colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                  style={styles.linearGradient}
                />
                <Animated.View style={[styles.header, {height: headerHeight}]}>
                  <View style={{alignItems: 'center', justifyContent: 'flex-start'}}>
                    <View style={styles.headerBG}/>
                    <Animated.View
                      style={[
                        styles.coverImage,
                        {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},
                      ]}
                    >
                      <Img
                        size={IMAGE_HEIGHT}
                        borderRadius={15}
                        source={{uri: imageUri}}
                      />
                    </Animated.View>
                  </View>
                  <Animated.View style={[styles.bar, {opacity: titleOpacity}]}>
                    <Text numberOfLines={1} style={styles.title}>{episode.title}</Text>
                    <Time>{millisToString(playbackStatus.durationMillis)}</Time>
                  </Animated.View>
                </Animated.View>
              </Gutter>
              <AlignBottom>
                <Gutter>
                  <AudioSnippetController episode={episode} podcast={podcast} clip={clip}/>
                  <Row justifyContent="space-between">
                    <Col>
                      <Duration/>
                    </Col>
                    <Col>
                      <DurationText>{millisToString(playbackStatus.durationMillis)}</DurationText>
                    </Col>
                  </Row>
                  <ActionWrapper>
                    <SpeedButton>
                      <SpeedButtonText>1x</SpeedButtonText>
                    </SpeedButton>
                    <CenterControls>
                      <Pill>
                        <PillItem>
                          <Rewind onPress={() => this.seek(-10)}>
                            <MaterialIcons size={30} name="replay-10"/>
                          </Rewind>
                        </PillItem>
                        <PillItem>
                          <FastForward onPress={() => this.seek(30)}>
                            <MaterialIcons size={30} name="forward-30"/>
                          </FastForward>
                        </PillItem>
                      </Pill>
                      <PlayPauseBtn style={{marginTop: -65}} comp="playing"/>
                    </CenterControls>
                    <Empty size={50}/>
                  </ActionWrapper>
                  <ActionWrapper>

                    <OpenShareBtn
                      onPress={this.handlePress('share')}
                      disabled={!Player.episode.audio.bucketPath}
                    >
                      <MaterialCommunityIcons name="scissors-cutting" size={30} color={variables.BORDER_COLOR_DARK}/>
                    </OpenShareBtn>
                    <Download episode={episode} podcast={podcast} onPressDownloads={this.onPressDownloads}/>
                  </ActionWrapper>
                </Gutter>
              </AlignBottom>
            </Body>
          </WebOnlyHeightHack>
        </HideableContent>
      </PageWrapper>
    );
  }
}

Playing.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func
  })
};


export default Playing;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    justifyContent: 'flex-start'
  },
  headerBG: {
    position: 'absolute',
    top: 0,
    height: HEADER_MAX_HEIGHT / 2,
    backgroundColor: variables.YELLOW,
    left: 0,
    right: 0
  },
  coverImage: {
    top: 20,
    width: 300,
    height: 300,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.33,
    shadowRadius: 5.5,
    elevation: 9,
    alignItems: 'center'

  },
  bar: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1
  },
  title: {
    backgroundColor: 'transparent',
    color: variables.FONT_COLOR_DARK,
    fontSize: 18,
    textAlign: 'center',
    paddingLeft: variables.P_3,
    paddingRight: variables.P_3
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  linearGradient: {
    backgroundColor: 'rgba(255,255,255,0)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 10
  }
});

const Body = styled.View`
          flex:1;
          justify-content: space-between;
          background-color: ${variables.WHITE}
          `;

const TrackName = styled.Text`
          font-size: ${variables.FONT_SIZE_H1};
          color: ${variables.FONT_COLOR_DARK};
          margin-bottom: ${variables.M_1}px;
          text-align:center;
          `;


const TrackInfo = styled.View`
          align-items:center;
          margin-top: ${variables.M_3}px;
          `;

const Time = styled.Text`
          color: ${variables.FONT_COLOR_SUBTLE};
          `;

const AlignBottom = styled.View`
          margin-bottom: ${variables.M_3}px;
          border: 1px;
          border-color: ${variables.BORDER_COLOR_DARK};
          border-radius: 5px;
          background-color: ${variables.BACKGROUND_BG};
          padding-top:${variables.P_3}px;
          padding-bottom:${variables.P_1}px;
          margin-left: 5px;
          margin-right:5px;
          `;

const ActionWrapper = styled.View`
          margin-top: ${variables.M_3}px;
          flex-direction: row;
          justify-content: space-between;
          `;

const Pill = styled.View`
          background-color: ${variables.WHITE};
          width: 200px;
          height: 50px;
          flex-direction: row;
          display:flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 25px;
          `;

const PillItem = styled.View`
          `;


const Rewind = styled(TouchableOpacity)`
          margin-left: 20px;
          `;

const FastForward = styled(TouchableOpacity)`
          margin-right: 20px
          `;

const SpeedButton = styled(TouchableOpacity)`
          background-color: ${variables.WHITE};
          height: 50px;
          width: 50px;
          justify-content: center;
          align-items:center;
          border-radius: 25px;
          `;

const SpeedButtonText = styled.Text`
          font-size: ${variables.FONT_SIZE_H3};
          font-weight: bold;
          color: ${variables.BORDER_COLOR_DARK};
          margin-left: -1px;
          `;

const CenterControls = styled.View`
          align-items:center;
          `;

const Empty = styled.View`
          width: ${({size}) => size}px;
          `;

const DetailsText = styled.Text`
          color: ${variables.ACTIVE_COLOR};

          `;
const OpenShareBtn = styled(TouchableOpacity)`
opacity: ${({disabled}) => disabled ? 0.3 : 1};
`;

