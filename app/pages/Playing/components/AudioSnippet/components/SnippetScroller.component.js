import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, TouchableOpacity} from 'react-native'
import styled from 'styled-components/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import variables from '../../../../../components/styles/variables';


const SnippetScroller = ({ userClips, onPress, activeClip }) => {
  return (
    <Wrapper>
      {!!userClips && !!userClips.length &&
      <ScrollWrapper horizontal>
        {userClips.map(clip => (
          <SnippetBox key={clip.id} onPress={() => onPress({ clip })}>
            <SnippetBoxTitle active={activeClip && activeClip.id === clip.id}>{clip.title}</SnippetBoxTitle>
            <SnippetBoxTime>Skip to {clip.minuteAsText}</SnippetBoxTime>
          </SnippetBox>
        ))}
      </ScrollWrapper>
      }

      {userClips && userClips.length === 0 &&
      <NoClipsWrapper>
        <MaterialCommunityIcons name="scissors-cutting" size={32} color={variables.FONT_COLOR_SUBTLE}/>
        <NoClipsText>No clips have been created!</NoClipsText>
      </NoClipsWrapper>
      }
    </Wrapper>
  )
};

SnippetScroller.propTypes = {
  userClips: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  activeClip: PropTypes.shape({
    id: PropTypes.string
  }),
  onPress: PropTypes.func,
};

SnippetScroller.defaultProps = {
  onPress: () => {
  }
};

export default SnippetScroller;

const Wrapper = styled.View`
margin-bottom: ${variables.M_2}px;
`;

const ScrollWrapper = styled(ScrollView)`
`;

const SnippetBox = styled(TouchableOpacity)`
        width: 100px;
        border-right-width: 1px;
        border-right-color: ${variables.BORDER_COLOR_DARK};
        height: 40px;
        justify-content: space-between;
        padding-left: ${variables.P_1}px;
        padding-right: ${variables.P_1}px;
        `;
const SnippetBoxTitle = styled.Text`
color: ${({ active }) => active ? variables.ACTIVE_COLOR : variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H5};
font-weight: ${({ active }) => active ? 'bold' : 'normal' };
`;

const SnippetBoxTime = styled.Text`
        color: ${variables.ACTIVE_COLOR};
        font-size: ${variables.FONT_SIZE_TINY}
        `;

const NoClipsWrapper = styled.View`
justify-content: center;
align-items:center;
width: 100%;
`;

const NoClipsText = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE}  
`;
