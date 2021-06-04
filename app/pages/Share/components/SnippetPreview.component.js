import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import styled from 'styled-components/native';
import {Grid} from '../../../components/styles';
import variables from '../../../components/styles/variables';
import PlayPauseBtn from '../../Playing/components/PlayPauseBtn.component';

const {Row, Col} = Grid;

const SnippetPreview = ({text, onPressDelete}) => {

  return <Wrapper>
    <Row>
      <Col alignItems="center" justifyContent="center" minWidth={80}>
        <PlayPauseBtn/>
      </Col>
      <Col flex={1}>
        <LyricsWrapper>
          <LyricsText>
            {text}
          </LyricsText>
        </LyricsWrapper>
      </Col>
      <Col>
        <EditBtn onPress={onPressDelete}>
          <MaterialCommunityIcons size={20} name="delete-outline" color={variables.BORDER_COLOR_DARK} />
        </EditBtn>
      </Col>

    </Row>
  </Wrapper>
};

SnippetPreview.propTypes = {
  text: PropTypes.string,
  onPressDelete: PropTypes.func,
};

SnippetPreview.defaultProps = {
  onPressDelete: () => {}
};

export default SnippetPreview;

const Wrapper = styled.View`
border: 1px;
border-color: ${variables.BORDER_COLOR_DARK};
border-radius: 5px;
background-color: ${variables.BACKGROUND_BG};
margin: ${variables.M_1}px;
`;

const LyricsWrapper = styled(ScrollView)`
border-left-color: ${variables.BORDER_COLOR_DARK};
border-left-width: 1px;
padding-left:${variables.P_2}px;
padding-right:${variables.P_2}px;
margin-top: ${variables.P_2}px;
margin-bottom: ${variables.P_2}px;
max-height: 100px;
`;

const LyricsText = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H5}px;
font-style: italic;
`;

const EditBtn = styled(TouchableOpacity)`
padding: ${variables.P_1}px;
`;

