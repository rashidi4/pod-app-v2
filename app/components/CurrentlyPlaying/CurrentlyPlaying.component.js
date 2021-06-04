import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {LinearGradient} from 'expo-linear-gradient';
import variables from '../styles/variables';
import {Grid, Typography, Gutter} from '../styles';
import Player from '../Player';
import TabBar from './components/TabBar';
import Tracker from './components/Tracker.component';
import PlayPauseBtn from '../../pages/Playing/components/PlayPauseBtn.component';
import {trim} from '../../util';
import {User} from '../../services/';
import TrackPlay from '../Telemetry/TrackPlay';
import {GlobalContext} from '../../util/GlobalContext';

const {Row, Col} = Grid;
const {Title, PrimaryText} = Typography;

export default class CurrentlyPlaying extends Component {
  static contextType = GlobalContext;
  state = {
    playing: false,
    isHidden: true,
    durationMillis: null,
    positionMillis: null,
    bounceValue: new Animated.Value(100),
    podcast: null,
    clip: null,
    timeLeft: 'loading...'
  };

  componentDidMount() {

    if (this.context) {
      this.context.openTabBarPlayer = this.openView;
      this.context.closeTabBarPlayer = this.closeView;
      this.context.bindTabBarPress= this.bindPress;
      this.context.unBindTabBarPress = this.unBindPress;
      this.context.tabBarLoad();
    }

    Player.on(this.onPlayerUpdate);
    Player.onEvent('didJustFinish', this.onJustDidFinish);
  }

  componentWillUnmount() {
    Player.on(this.onPlayerUpdate);
    Player.offEvent('didJustFinish', this.onJustDidFinish);
  }

  shouldUpdate = (playbackStatus) => {
    if (playbackStatus.durationMillis && !this.state.durationMillis) return true;
    if (playbackStatus.positionMillis && !this.state.positionMillis) return true;
    if (playbackStatus.durationMillis !== this.state.durationMillis) return true;

    const diff = Math.abs(this.state.positionMillis - playbackStatus.positionMillis);

    return (diff > 1000 * 60);
  };

  onJustDidFinish = async () => {
    await Player.pause();
    await Player.setPosition(0);
  };

  onPlayerUpdate = (playbackStatus) => {

    const {timeLeft} = this.state;
    // important note, `isHidden` is currently used as flag
    // to not pause when the Playing page is up
    // this needs to be refactored into its own logic
    // as its using a UI flag to determine if the player
    // should stop or not. Business rule is currently
    // two let the clip continue if the Player page
    // is open.


    if (this.shouldUpdate(playbackStatus)) {
      this.setState({
        durationMillis: playbackStatus.durationMillis,
        positionMillis: playbackStatus.positionMillis
      });
    }

    const tl = getTimeLeft(playbackStatus);
    if (tl !== timeLeft) {
      this.setState({timeLeft: tl});
    }
  };

  openView = ({episode, podcast, clip} = {}, {shouldPlay = true} = {}) => {
    const {isHidden} = this.state;
    let positionMillis;
    const inProgressEpisode = this.getProgressEpisode({episode});
    if (clip) {
      const {startMillis} = clip;
      positionMillis = startMillis;
    } else if (inProgressEpisode) {
      positionMillis = inProgressEpisode.currentPositionMillis;
    }

    if (episode) {
      this.setState({episode, podcast, clip}, (() => {
        if (!isHidden) {
          this.flash()
        } else {
          this.toggleView();
        }
      }));
      Player.loadAsync({episode, clip}, {
        shouldPlay,
        positionMillis: clip ? 0 : positionMillis
      }, { debounceTO: 1000});
    } else {
      if (!isHidden) {
        this.flash()
      } else {
        this.toggleView();
      }
    }
  };

  closeView = () => {
    const {isHidden} = this.state;
    if (isHidden) return;
    this.toggleView();
  };

  toggleView = () => {
    const {isHidden = false} = this.state;

    const toValue = isHidden ? 0 : 250;
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: toValue,
        velocity: 3,
        tension: 7,
        friction: 5,
      }
    ).start();
    this.setState({isHidden: !isHidden});
  };

  flash = () => {
    Animated.sequence([
      Animated.spring(this.state.bounceValue, {
        toValue: -10,
        velocity: 40,
        bounciness: 20,
        speed: 300,
      }),
      Animated.spring(this.state.bounceValue, {
        toValue: 0,
        velocity: 40,
        bounciness: 20,
        speed: 20,
      })
    ]).start();
  };

  onPress = async () => {
    const {episode} = Player;
    const {podcast, clip} = this.state;

    if (this.fn) {
      this.fn({podcast, episode, clip});
    }
  };

  bindPress = (fn) => {
    this.fn = fn;
  };

  unBindPress = () => {
    this.fn = null;
  };

  getProgressEpisode = ({episode}) => {
    const {progress = []} = this;
    if (!episode) return null;

    const ep = progress.find(e => e && e.episode && e.episode.id === episode.id);
    if (!ep) return null;
    return ep.episode;
  };

  handleProgressUpdate = ({data}) => {
    if (data && data.progress) {
      const {progress} = data;
      this.progress = progress;
    }
  };
  hide;

  chooseMediaType = () => {
    // const {podcast, clip, timeLeft} = this.state;
  };

  render() {

    const {podcast, clip, timeLeft, isHidden, episode} = this.state;
    const timeleft = clip
      ? clip.startToFinish
      : timeLeft;


    return (
      <Wrapper>
        {episode && <TrackPlay episodeId={episode?.id}/>}
        <User.Progress onLoad={this.handleProgressUpdate}/>
        {episode && !isHidden && <>
          <Tracker episode={episode} podcast={podcast}/>
          <PlayerWrapper>
            <Gradient colors={[variables.LIGHT_BEIGE, variables.BACKGROUND_BG]}>
              <Gutter>
                <Row>
                  <Col alignItems="center" justifyContent="center">
                    <TouchableOpacity onPress={this.onPress}>
                      {podcast && podcast.image && <AlbumCover source={{uri: podcast.image.uri}}/>}
                    </TouchableOpacity>
                  </Col>
                  <Col flex={1} style={{marginLeft: 15}}>
                    <TouchableOpacity onPress={this.onPress}>
                      <Title ellipsizeMode="tail" numberOfLines={1}>
                        {clip && `Clip: ${clip.title}`}
                        {!clip && episode.title}
                      </Title>
                      <PrimaryText>{timeleft ? timeleft : 'loading...'}</PrimaryText>
                      {clip && <PrimaryText>{trim(episode.title)}</PrimaryText>}
                      {!clip && podcast && <PrimaryText>{trim(podcast.title, 40)}</PrimaryText>}
                    </TouchableOpacity>
                  </Col>
                  <Col alignItems="center" justifyContent="center">
                    <PlayPauseBtn small onPress={this.chooseMediaType}/>
                  </Col>
                </Row>
              </Gutter>
            </Gradient>
          </PlayerWrapper>
        </>}

        <TabBar {...this.props} borderTop={isHidden} />
      </Wrapper>
    );
  }
}


CurrentlyPlaying.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  isHidden: PropTypes.bool
};


function getTimeLeft(playbackStatus) {

  if (!playbackStatus) return null;

  let totalDuration = playbackStatus.durationMillis;

  const millis = totalDuration - playbackStatus.positionMillis;

  if (isNaN(millis)) return null;

  const seconds = Math.floor((millis / 1000) % 60);
  const minutes = Math.floor((millis / (1000 * 60)) % 60);
  const hours = Math.floor((millis / (1000 * 60 * 60)) % 24);


  // if (hours > 0) {
  //   return `${hours} hours left`;
  // }

  if (minutes > 0) {
    return `${minutes + (hours * 60)} minutes left`;
  }

  return `${seconds} seconds left`;
}

const Wrapper = styled.View`
`;

const PlayerWrapper = styled.View`
  width: 100%;
  justify-content: center;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-top-color: ${variables.SEPARATOR_COLOR};
  border-bottom-color: ${variables.SEPARATOR_COLOR};
`;

const Gradient = styled(LinearGradient)`
padding: ${variables.P_2}px;
`;
const IMAGE_SIZE = 45;

const AlbumCover = styled(Image)`
  width: ${IMAGE_SIZE}px;
  height: ${IMAGE_SIZE}px;
  border-radius: ${variables.BORDER_RADIUS}px;
`;
