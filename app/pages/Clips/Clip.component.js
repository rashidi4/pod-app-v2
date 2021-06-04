import React, {useContext, useState, useEffect, useCallback} from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import {shape, func} from 'prop-types';
import variables from '../../components/styles/variables';
import {GlobalContext} from '../../util/GlobalContext';
import {useClipsService} from '../../services/APIService/Clips.service';
import {ClipItem} from './components/ClipItem';

const ItemLoader = () => {
  return <ItemLoaderWrapper />
};

const ClipPage = ({navigation}) => {
  const clip = navigation.getParam('clip', {});
  const clips = navigation.getParam('clips', []);
  const filter = navigation.getParam('filter', {});
  const index = navigation.getParam('index', 1);
  const term = navigation.getParam('term', '');
  const [hasMore, setHasMore] = useState(true);
  const [clipIndex] = useState(navigation.getParam('index', 0));
  // carousel item.
  const [currentItem, setCurrentItem] = useState(index);
  //initial load is 3 (prev and next)
  const [pagination, setPagination] = useState({ start:  clipIndex, limit: 1 });

  const [results, setResults] = useState(clips);

  const {width} = Dimensions.get('window');
  const size = (width) - 20;

  const context = useContext(GlobalContext);

  useEffect(() => {
    const {podcast, episode} = clip;
    context.openTabBarPlayer({podcast, episode, clip}, {shouldPlay: false});
  }, []);


  const {data, loading} = useClipsService({ term, filter, pagination, skip: pagination.limit === 1 });

  useEffect(() => {
    if (data?.browseClips?.id) {
      const len = data.browseClips.clips.length;
      const hasMore = len === pagination.limit;
      setHasMore(hasMore);
    }
  },[loading, pagination.limit]);

  useEffect(() => {
    // update carousel state
    if (data?.browseClips?.clips) {
      const newResults = [...results];
      if (currentItem !== 0) {
        setResults([...newResults, ...data?.browseClips?.clips])
      } else {
        setResults([...data?.browseClips?.clips, ...newResults]);
      }
    }
  }, [data?.browseClips?.id]);

  const handleScroll = useCallback(({ viewableItems }) => {
    const { index, item } = viewableItems[0];
    setCurrentItem(index);
    const {podcast, episode} = item;
    context.openTabBarPlayer({podcast, episode, clip: item}, {shouldPlay: false});
  }, []);

  useEffect(() => {
    if (currentItem === results.length - 1) {
      if (hasMore) {
        setPagination({ start: currentItem + 1, limit: 8});
      }
    } else if (currentItem === 0) {
      // const start = pagination.start - 1;
      // if (start > 0) {
      //   setPagination({ start, limit: 8});
      // }
    }
  }, [currentItem]);

  return (
    <Wrapper>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1000}
        decelerationRate="fast"
        pagingEnabled
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        initialNumToRender={results.length}
        initialScrollIndex={clipIndex}
         onViewableItemsChanged={handleScroll}
        getItemLayout={(data, index) => (
          {length: size + 20, offset: (size + 20) * index, index}
        )}
        data={results}
        extraData={results}
        keyExtractor={( item, index ) => item ? `${item.clip.id}` : `${index}`}
        renderItem={({item, index}) => {
          if (item?.tmp || !item) return <ItemLoader />;
          return (
            <ClipItem
              isActive={currentItem === index}
              size={size}
              item={item}
              index={index}
            />
          );
        }}
      >
      </ScrollView>
    </Wrapper>
  )
};


ClipPage.navigationOptions = ({ navigation }) => {
  const clip = navigation.getParam('clip', {});
  return {
    title: clip?.podcast?.title
  }
};

const Wrapper = styled.View`
align-items:center;
padding-top:5px;
background-color: ${variables.BACKGROUND_BG};
flex:1
`;
// const Text = styled.Text`
// `;

const ScrollView = styled.FlatList`

`;


const ItemLoaderWrapper = styled.View`
width: 100px;
border-width:1px;
`;


ClipPage.propTypes = {
  navigation: shape({
    getParam: func,
  })
};

export default ClipPage;
