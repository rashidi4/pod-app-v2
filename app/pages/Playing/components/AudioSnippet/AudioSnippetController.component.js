import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import MarkerController from './components/MarkerController.component';
import variables from '../../../../components/styles/variables';
import SnippetScroller from './components/SnippetScroller.component';
import {User} from '../../../../services';
import Player from '../../../../components/Player';

class AudioSnippetControllerComponent extends Component {
  state = {
    activeClip: this.props.clip,
    barWidth: null
  };
  onPressClip = ({ clip }) => {

    this.setState({activeClip: clip}, () => {
      if (!Player.bucketLoaded) {
        Player.loadBucketPath({ positionMillis: clip.startMillis, shouldPlay: true });
      } else {
        Player.seekTo(clip.startMillis);
      }

    });

  };
  playerListener = (playbackStatus) => {
    const {activeClip} = this.state;
    if (!activeClip) return;
    const {positionMillis} = playbackStatus;
    if (positionMillis > activeClip.startMillis + activeClip.duration) {
      this.setState({activeClip: null });
    } else if (positionMillis < activeClip.startMillis - 100) {//100 is buffer
      this.setState({activeClip: null });
    }
  };

  componentDidMount() {
    Player.on(this.playerListener);
  }

  componentWillUnmount() {
    Player.off(this.playerListener);
  }

  onBarLayout = ({nativeEvent}) => {
    const {layout: {width}} = nativeEvent;
    this.setState({barWidth: width});
  };

  render() {
    const {episode} = this.props;
    const {activeClip, barWidth} = this.state;

    const {durationMillis} = episode.audio;
    return (<Wrapper>
      <User.Clips episodeId={episode.id}>
        {({data: {userClips} = {}, loading, error}) => {
          return (
            <>
              {error && <ErrorText>{error.toString()}</ErrorText>}
              {loading && <LoadingText>Loading Clips...</LoadingText>}
              {userClips && <SnippetScroller userClips={userClips.clips} onPress={this.onPressClip} activeClip={activeClip}/>}
              <Bar onLayout={this.onBarLayout}>
                {(userClips && userClips.clips || [])
                  .map(clip => <MarkerController
                    key={clip.id}
                    clip={clip}
                    durationMillis={durationMillis}
                    activeClip={activeClip}
                    barWidth={barWidth}
                  />)
                }
              </Bar>
            </>);
        }}
      </User.Clips>
    </Wrapper>);
  }
}

AudioSnippetControllerComponent.propTypes = {};


AudioSnippetControllerComponent.propTypes = {
  episode: PropTypes.shape({
    id: PropTypes.string,
    audio: PropTypes.shape({
      uri: PropTypes.string,
      durationMillis: PropTypes.number,
    })
  }),
  podcast: PropTypes.shape({
    feedUri: PropTypes.string,
  }),
  clip: PropTypes.shape({})
};

export default AudioSnippetControllerComponent;


const Wrapper = styled.View`
  
`;

const LoadingText = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H5}px;
margin-bottom: ${variables.M_3}px;
`;

const ErrorText = styled.Text`
color: ${variables.RED};
font-size: ${variables.FONT_SIZE_H5}px;
margin-bottom: ${variables.M_3}px;
`;

const Bar = styled.View`
background-color: ${variables.ACTIVE_COLOR};
flex-direction: row;
border-radius: 6px;
width: 100%;
height:12px;
align-items: flex-start;
margin-bottom: ${variables.M_1}px;
`;
