import React, { Component } from 'react';
import styled from 'styled-components/native';
import Bar from './Bar.component';
import variables from '../../../components/styles/variables';
import Player from '../../../components/Player';



// const { Row, Col } = Grid;
// const {Title, PrimaryText } = Typography;

const Wrapper = styled.View`
flex-direction: row;
height: 40px;
justify-content: space-between;
align-items: flex-end;
border-bottom-color: ${variables.FONT_COLOR_LIGHT};
border-bottom-width: 1px;
margin: 0 15px;
`;

export function getMinutes(millis) {
  return Math.floor(millis / (1000 * 60));
}

class Equalizer extends Component {

  constructor(props) {
    super(props);
    this.playbackStatus = {
      ...Player.playbackStatus
    };

    this.state = {
      positionMillis: Player.playbackStatus.positionMillis
    }
  }

  componentDidMount() {
    Player.on(this.handlePlayer);
  }

  componentWillUnmount() {
    Player.off(this.handlePlayer);
  }

  to = null;
  shouldUpdate = () => {
    if (typeof this.state.positionMillis === 'undefined') return true;
    if (typeof this.playbackStatus.positionMillis === 'undefined') return false;
    const diff = Math.abs(this.playbackStatus.positionMillis - this.state.positionMillis);
    return diff > 1000 * 10;

  };
  handlePlayer = (playbackStatus) => {
    if (!playbackStatus) return;

    this.playbackStatus = playbackStatus;
    if (this.shouldUpdate()) {
      this.setState({ positionMillis: this.playbackStatus.positionMillis });
    }


  };

  getBarColor = (minute) => {
    const { positionMillis } = this.state;
    const CURRENT_MINUTE = getMinutes(positionMillis);

    if (minute < CURRENT_MINUTE) {
      return variables.BORDER_COLOR_DARK;
    } else if (minute === CURRENT_MINUTE) {
      return variables.ACTIVE_COLOR;
    }
    return variables.LIGHT_BLUE;
  };

  render() {

    const TOTAL_MINUTES = getMinutes(this.playbackStatus.durationMillis);

    if (isNaN(TOTAL_MINUTES)) return null;
    const minutes = new Array(TOTAL_MINUTES).fill('');
    return (
      <Wrapper>
        {minutes.map((value,index) => <Bar
          key={index}
          index={index}
          color={this.getBarColor(index)}
        />)}
      </Wrapper>
    );
  }
}

Equalizer.propTypes = {
};
export default Equalizer;
