import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Player from '../../../components/Player';
import {Gutter} from '../../../components/styles';
import {BottomSheet} from '../../../components';
import variables from '../../../components/styles/variables';
import SnippetPreview from '../../Share/components/SnippetPreview.component';
import {millisToString, millisToStringLong, roundSecondsDown} from '../../../util';
import SnippetCreating from './Share/SnippetCreating.component';
import SnippetForm from '../../Share/components/SnippetForm.component';


const initialState = {
  currentMinute: '00:00:00',
  selections: ['', ''],
  isOpen: false,
  selection: [[], []],
  startMillis: null,
  endMillis: null,
  snippetStatus: 'CREATING',
  text: null
};

class Share extends Component {
  state = initialState;

  ref = React.createRef();
  managerRef = React.createRef();

  componentDidMount() {
    Player.on(this.updateCurrentMinute);
  }

  componentWillUnmount() {
    Player.off(this.updateCurrentMinute);
  }

  updateCurrentMinute = (playbackStatus) => {
    if (!playbackStatus.isLoaded) {
      return;
    }
    const {positionMillis} = playbackStatus;
    const {endMillis, startMillis, isOpen} = this.state;

    const currentMinute = roundSecondsDown(
      millisToString(positionMillis, true)
    );

    if (currentMinute !== this.state.currentMinute) {
      this.setState({currentMinute});
    }

    if (!isOpen) return;
    if (typeof endMillis !== 'number') return;
    if (typeof startMillis !== 'number') return;
    if (!positionMillis) return;

    if (positionMillis >= endMillis) {
      Player.pause().then(() => {
        Player.setPosition(startMillis);
      });
    }
  };

  onSelectionChange = (selection, {startMillis, endMillis, text}) => {
    this.setState({selection, startMillis, endMillis, text});
  };

  open = () => {
    Player.loadBucketPath();
    this.ref.current.snapTo(0);
  };

  close = () =>{
    this.resetSnippet(() => {
      this.ref.current.snapTo(1);
    });
  };

  onOpenEnd = () => {
    this.setState({isOpen: true});
  };

  onCloseEnd = () => {
    Player.unloadBucketPath();
    this.setState({isOpen: false});
  };

  resetSnippet = (cb) => {
    this.setState({
      isOpen: false,
      selection: [[], []],
      startMillis: null,
      endMillis: null,
      snippetStatus: 'CREATING',
    }, cb);
    if (this.managerRef.current) {
      this.managerRef.current.resetSnippets();
    }
  };

  getClipData = () => {
    const {episode} = Player;
    const {startMillis, endMillis, text} = this.state;

    if (typeof startMillis !== 'number' && typeof endMillis !== 'number') return {};

    const duration = endMillis - startMillis;

    const minute = millisToStringLong(startMillis);
    return {
      startMillis,
      endMillis,
      duration,
      episode,
      minute,
      text
    }
  };

  onPressCutClip = () => {
    this.setState({snippetStatus: 'PREVIEWING'});
  };

  onPressEdit = () => {
    this.setState({snippetStatus: 'CREATING'});
  };

  onSuccess = () => {
    this.close();
  };


  render() {
    const {episode} = Player;
    const {podcast} = this.props;
    const {currentMinute, snippetStatus} = this.state;
    const {minute, duration, startMillis, text} = this.getClipData();

    return (
      <BottomSheet forwardedRef={this.ref} {...this.props} onOpenEnd={this.onOpenEnd} onCloseEnd={this.onCloseEnd}>
        <Wrapper>
          <Gutter flex={1}>
            <Toolbar>
              <TitleWrapper>
                <Title>Create Clip</Title>
              </TitleWrapper>
            </Toolbar>
            <SnippetCreating
              forwardedRef={this.managerRef}
              episode={episode}
              isOpen={this.state.isOpen}
              currentMinute={currentMinute}
              visible={snippetStatus === 'CREATING'}
              onPressCutClip={this.onPressCutClip}
              onSelectionChange={this.onSelectionChange}
            />
            <SnippetPreview
              visible={snippetStatus === 'PREVIEWING'}
              minute={minute}
              duration={duration}
              startMillis={startMillis}
              text={text}
              onPressEdit={this.onPressEdit}
            />
            {snippetStatus === 'PREVIEWING' && <SnippetForm
              visible
              minute={minute}
              episode={episode}
              podcast={podcast}
              duration={duration}
              startMillis={startMillis}
              onSuccess={this.onSuccess}
            />}
          </Gutter>
        </Wrapper>
      </BottomSheet>
    )
  }
}

Share.propTypes = {
  forwardRef: PropTypes.any,
  podcast: PropTypes.any,
};


export default Share;


const Wrapper = styled.View`
flex: 1;
`;
const TitleWrapper = styled.View`
flex: 1;
justify-content:center;
padding-left: ${variables.P_1}px;
`;

const Title = styled.Text`;
font-size: ${variables.FONT_SIZE_H3};
font-weight: bold;
color: ${variables.FONT_COLOR_DARK};

`;


const Toolbar = styled.View`
justify-content: center;
align-items: center;
flex-direction: row;
margin-bottom: ${variables.M_3}px;
`;
