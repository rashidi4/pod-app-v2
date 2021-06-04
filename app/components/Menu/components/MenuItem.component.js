import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import variables from '../../styles/variables';
import { Grid  } from '../../styles';

const { Row, Col } = Grid;


const Wrapper = styled(TouchableOpacity)`
padding: 15px 5px;
margin-left: 15px;
`;

const Title = styled.Text`
  font-size: ${variables.FONT_SIZE_H3};
  color: ${variables.FONT_COLOR_DARK};
  font-weight: bold;
`;
const SubTitle = styled.Text`
  font-size: ${variables.FONT_SIZE_H5};
  color: ${variables.FONT_COLOR_SUBTLE};
`;

const Separator = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${({color}) => color ? color : variables.SEPARATOR_COLOR};
  margin-left: 15px;
  height: 0.5px;
`;

// const iconStyle = {
//   color: variables.FONT_COLOR_SUBTLE
// };

export default class MenuItem extends Component {
  render() {
    const {title, subTitle, border, onPress} = this.props;
    return (<>
        <Wrapper onPress={onPress}>
          <Row>
            <Col flex={1}>
              <Title>{title}</Title>
              {subTitle && <SubTitle>{subTitle}</SubTitle>}
            </Col>
            {/*<Col justifyContent="center">*/}
            {/*  <FontAwesomeIcon size={20} icon={faChevronRight} style={iconStyle} />*/}
            {/*</Col>*/}
          </Row>

        </Wrapper>
      {border && <Separator/> }
      </>
    );
  }
}

MenuItem.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  border: PropTypes.bool,
  onPress: PropTypes.func,
};

MenuItem.defaultProps = {
  onPress: () => {},
  border: true,
};
