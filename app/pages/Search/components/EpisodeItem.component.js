import React, { useCallback } from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {string, shape, func, any} from 'prop-types';
import styled from 'styled-components/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import variables from '../../../components/styles/variables';
import {Grid, Gutter, Typography} from '../../../components/styles';
import LikeButton from './Like.component';
import SubscribeBtn from '../../Podcast/components/Subscribe.component';


const {TinyBold} = Typography;
const {Row, Col} = Grid;

const EpisodeItem = ({ episode, navigation, onPress, style = style }) => {
  const imageUri = episode.image.uri
    ? episode.image.uri
    : episode.podcast.image.uri;

  const navigateToPodcast = useCallback(() => {
    const podcast = episode.podcast;
    navigation.navigate('Podcast', {podcast});
  });

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress({ episode });
    }
  });

  return (
    <Wrapper style={style}>
      <Header>
        <Gutter>
          <Row alignItems="center" style={styles.headerRow}>
            <Col style={styles.iconWrapper}>
              <MaterialCommunityIcons name="podcast" size={24}/>
            </Col>
            <Col flex={1}>
              <Row justifyContent="space-between">
                <Col flex={1} maxWidth="85%">
                  <TouchableOpacity onPress={navigateToPodcast}>
                    <Author>{episode.author} - {episode.podcast.title}</Author>
                    <Date>{episode.dateAsText}</Date>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TinyBold>{episode.durationClient}</TinyBold>
                </Col>
              </Row>
            </Col>
          </Row>
        </Gutter>
      </Header>
      <Content>
        <Gutter>
          <Row>
            <Col flex={1} style={{marginRight: 10}}>
              <TouchableOpacity onPress={handlePress}>
                <Title>{episode.title}</Title>
                <Description numberOfLines={3} ellipsizeMode="tail">{episode.clientCleanSummary}</Description>
              </TouchableOpacity>
            </Col>
            <Col>
              {imageUri && <Img size={100} source={{uri: imageUri}}/>}
            </Col>
          </Row>
        </Gutter>
      </Content>
      <Footer>
        <Row alignItems="center" justifyContent="space-between">
          <Col>
            <LikeButton episode={episode}/>
          </Col>
          <Col>
            <SubscribeBtn podcastId={episode.podcast.id} useBtn={false} textColor={variables.ACTIVE_COLOR} />
          </Col>
        </Row>
      </Footer>

    </Wrapper>
  )
};

EpisodeItem.propTypes = {
  episode: shape({
    title: string
  }),
  navigation: shape({
    navigate: func
  }),
  onPress: func,
  style: any
};

export default EpisodeItem;

const Wrapper = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${variables.BORDER_COLOR};
`;

// const IconWrapper = styled.View`
// padding: ${variables.M_2}px ${variables.M_2}px 0 0;
// `;

const Header = styled.View`
`;

const Img = styled(Image)`
width: 100px;
height: 100px;
border-radius: 5px;
border-color: ${variables.BORDER_COLOR_DARK};
border-width:1px;
`;

const Footer = styled.View`
height: 30px;
border-top-color: ${variables.BORDER_COLOR};
border-top-width:1px;
justify-content:center;
padding: 0 ${variables.P_2}px;
`;

const Content = styled.View`
margin-bottom: ${variables.M_2}px;
`;

const Title = styled.Text`
color: ${variables.FONT_COLOR_DARK};
margin-bottom: ${variables.M_2}px;
`;

const Author = styled.Text`
color: ${variables.FONT_COLOR_DARK};
`;
const Date = styled.Text`
font-size: ${variables.FONT_SIZE_H5};
color: ${variables.FONT_COLOR_SUBTLE};
`;

const Description = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H4}px;
`;

const styles = StyleSheet.create({
  headerRow: {
    marginTop: variables.M_2,
    marginBottom: variables.M_2
  },
  iconWrapper: {
    marginRight: variables.M_2
  }
});
