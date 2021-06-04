import React, {useState, useEffect, useCallback, useContext} from 'react';
import {func, shape, number, bool} from 'prop-types';
import styled from 'styled-components/native';
import {Image, FlatList} from 'react-native';
import variables from '../../../components/styles/variables';
import LikeButton from '../../Search/components/Like.component';
import {useClipsByIds} from '../../../services/APIService/Clips.service';
import {AltClipItemCell} from './AltClipItemCell';
import {AltClipFooter}from './AltClipFooter';
import {GlobalContext} from '../../../util/GlobalContext';
const ITEM_HEIGHT = 50;

export const useAlternativeClips = ({ids, isActive}) => {
  const [alternativeIds, setAlternativeIds] = useState(ids);
  const [start, setStart] = useState(0);
  const [idsToFetch, setIdsToFetch] = useState(ids.slice(start, 5));

  const {data, loading} = useClipsByIds({ids: idsToFetch, skip: idsToFetch.length === 0 || !isActive});

  // sets the next ids
  useEffect(() => {
    if (start > 0) {
      const items = alternativeIds.slice(start, start + 5);
      setIdsToFetch(items.filter(item => typeof item === 'string'));
    }
  }, [start]);

  // handles response from api
  useEffect(() => {
    if (!loading && data) {
      setAlternativeIds((ids) => {
        return ids.map(id => {
          if (typeof id !== 'string') return id;
          const clip = data.clips.find(clip => clip.id === id);
          if (clip) return clip;
          return id;
        })
      });
    }
  }, [loading, data?.clips?.map(clip => clip.id).join('')]);

  const clips = alternativeIds.filter(id => typeof id !== 'string');
  const hasMore = alternativeIds.length > clips.length;

  const next = useCallback(() => {
    if (hasMore) {
      setStart((cur) => {
        return cur + 5;
      });
    }
  }, [hasMore]);


  return {data: { clips }, hasMore, loading, next};
};

export const ClipItem = ({item, size, isActive}) => {

  const {clipIds} = item;
  const [clip, setClip] = useState(item.clip);

  const {data, hasMore, next, loading } = useAlternativeClips({ids: clipIds, isActive});
  const imageUri = clip.episode.image.uri
    ? clip.episode.image.uri
    : clip.podcast.image.uri;

  const context = useContext(GlobalContext);

  const handlePressClip = useCallback(({ clip }) => {
    setClip(clip);
    const {podcast, episode} = clip;
    context.openTabBarPlayer({podcast, episode, clip}, {shouldPlay: false});
  }, []);

  return (<Wrapper>
    <ImgWrapper>
      <Img size={size + 6} source={{uri: imageUri}}/>
      <Bg size={size}>
        <Author>{clip.episode.title}</Author>
        <ClipText>
          {clip.transcription?.transcript?.trim()}
        </ClipText>
      </Bg>
      <ActionBar>
        <LikeButton clip={clip} size={24}/>
        <Title>
          {clip.title}
        </Title>
      </ActionBar>
    </ImgWrapper>
    <AlternativeClips>
      <FlatList
        data={data.clips}
        extraData={data.clips}
        renderItem={({item: altClip, index}) => {
          return <AltClipItemCell
            onPress={handlePressClip}
            item={altClip}
            isActive={altClip.id === clip.id}
            height={ITEM_HEIGHT}
            index={index}
          />;
        }}

        getItemLayout={(data, index) => (
          {length: (ITEM_HEIGHT), offset: (ITEM_HEIGHT) * index, index}
        )}
        ItemSeparatorComponent={() => (
          <AlternativeClipsSep />
        )}
        ListFooterComponent={() => (
          <AltClipFooter showBtn={hasMore} onPress={next} loading={loading} />
        )}
      />
    </AlternativeClips>
  </Wrapper>);
};

ClipItem.propTypes = {
  item: shape({}),
  size: number,
  onPress: func,
  isActive: bool
};

const Wrapper = styled.View`
`;

const AlternativeClips = styled.View`
margin: 0 6px;

border-width:1px;
border-color: ${variables.BORDER_COLOR_DARK};
background-color:${variables.LIGHT_BG};
flex:1
`;

const AlternativeClipsSep = styled.View`
height: 1px;
background-color: ${variables.BORDER_COLOR_DARK};
`;

const ImgWrapper = styled.View`
border-width:1px;
border-color: ${variables.BORDER_COLOR};
padding: ${variables.P_1}px;
`;

const ActionBar = styled.View`
  border-width: 1px;
  border-color: ${variables.BORDER_COLOR_DARK};
  background-color: ${variables.WHITE};
  border-top-width: 0;
  height: 40px;
  width: 100%;
  justify-content:center;
  padding: 0 10px;
  flex-direction: row;
  justify-content:flex-start;
  align-items:center;
`;

const Img = styled(Image)`
width: ${({size}) => size + 2}px;
height: ${({size}) => size + 2}px;
border-width:1px;
border-color: ${variables.BORDER_COLOR_DARK};
border-bottom-width:0;
`;

const Bg = styled.View`
position:absolute;
width: ${({size}) => size - 14}px;
height: ${({size}) => size - 14}px;
backgroundColor: rgba(0,0,0,0.7);
justify-content: flex-start;
top:10px
left:10px;
margin: 6px
padding: 10px;
`;

const Title = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
font-style: italic;
`;
const Author = styled.Text`
color: ${variables.LIGHT_BLUE};
font-size: ${variables.FONT_SIZE_H4}px;
`;

const ClipText = styled.Text`
margin-top:${variables.M_2}px;
color: ${variables.LIGHT_BLUE};
`;
