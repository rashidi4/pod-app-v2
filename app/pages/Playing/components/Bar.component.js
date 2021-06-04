import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
// import variables from '../../../components/styles/variables';
// import { Grid, Typography } from '../styles';


// const { Row, Col } = Grid;
// const {Title, PrimaryText } = Typography;



const Wrapper = styled.View`
${({ height = 20 }) => `height: ${height}px;`}
background-color: ${({ color }) => color};
margin-right:1px;
flex: 1;
`;

/*
border-right-color: ${variables.FONT_COLOR_LIGHT};
border-right-width: 0.5px;
border-top-color: ${variables.FONT_COLOR_LIGHT};
border-top-width: 1px;
border-left-width:0.5px;
border-left-color: ${variables.FONT_COLOR_LIGHT};

 */

class Bar extends Component {
  render() {
    const { index, color } = this.props;
    let height = index % 5 === 0 ? 30 : 10;
    height = index % 3 === 0 ? 15 : height;
    height = index % 7 === 0 ? 5 : height;
    height = index % 10 === 0 ? 40 : height;

    return (
      <Wrapper height={height} color={color} />
    );
  }
}

Bar.propTypes = {
  index: PropTypes.number,
  color: PropTypes.string
};
export default Bar;