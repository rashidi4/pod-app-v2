import React, {useState, useCallback, useContext, useRef } from 'react';
import {Animated, Platform, StatusBar} from 'react-native';
import styled from 'styled-components/native';
import {NavigationEvents} from 'react-navigation';
import {Gutter, PageWrapper, Spacer} from '../../components/styles';
import {Search, Title} from '../../components'
import variables from '../../components/styles/variables';
import PropTypes from 'prop-types';
import DropdownAlert from 'react-native-dropdownalert';
import {createStackNavigator} from 'react-navigation-stack';
import Podcast from '../Podcast/Podcast.component';
import Playing from '../Playing/Playing.component';
import FilterBar from './components/FilterBar.component';
import SortBar from './components/SortBar';
import EpisodeService from '../../services/APIService/Episode.service';
import BigLoader from '../../components/Loaders/Spinner.component';
import EpisodeItem from './components/EpisodeItem.component';
import Separator from './components/ItemSeparator.component';
import {GlobalContext} from '../../util/GlobalContext';

const SearchPage = (props) => {
  const [filter, setFilter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const {navigation} = props;

  const dropDownAlertRef = useRef(null);

  // const onPressItem = useCallback((e, podcastItem) => {
  //   navigation.navigate('Podcast', {podcastItem});
  // });

  const handleChange = useCallback(({data, variables, error}) => {

    if (error && dropDownAlertRef.current) {
      dropDownAlertRef.current.alertWithType('error', 'Error', error.toString());
    }
    if (data) {
      const buffer = variables.pagination.start > 0
        ? episodes
        : [];
      setEpisodes([
        ...buffer,
        ...data.browseEpisodes.episodes,
      ])
    }
    setLoaded(true);

  });

  const updateStatusBar = useCallback(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(variables.WHITE);
  }, []);


  const onRefresh = async (refetch) => {
    await refetch();
    setScrollY(new Animated.Value(0));
  };

  const onFilterChange = useCallback((value) => {
    setLoaded(false);
    setFilter(value);
  }, []);

  const context = useContext(GlobalContext);

  const onPressItem = useCallback(({episode}) => {
    const {podcast} = episode;
    context.openTabBarPlayer({podcast, episode});
  });

  const headerTranslate = Animated.diffClamp(scrollY, 0, 30)
    .interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1],
      extrapolateLeft: 'clamp',
    });
  const [term, setTerm] = useState('');// eslint-disable-line
  // @ todo logic for ios 11+ to have no space
  return (
    <>
      <NavigationEvents onDidFocus={updateStatusBar} />
      <PageWrapper bg={variables.WHITE}>
        <Spacer height={40}/>
        <Gutter>
          <Search placeholder="Search" onSubmit={(term) => setTerm(term)}/>
        </Gutter>
        <FilterBar onChange={onFilterChange}/>
        <ResultsWrapper>
          <EpisodeService onChange={handleChange} filter={filter} term={term}>
            {({called, loading, refetch}) => {
              if (loading || !loaded) {
                return (
                  <LoadingWrapper>
                    <BigLoader/>
                  </LoadingWrapper>
                );
              }

              if (called && episodes && episodes.length === 0) {
                return (
                  <>
                    <Center>
                      <Title>
                        <Title.PrimaryText>No episodes{filter ? `: "${filter}"` : ''}</Title.PrimaryText>
                        <Title.SubText>Try searching for a podcast</Title.SubText>
                      </Title>
                    </Center>
                  </>
                );
              }

              if (!episodes) return null;
              return (
                <ListWrapper>
                  <SearchFlatList
                    data={episodes}
                    scrollEventThrottle={1}
                    bounces={false}
                    onScroll={Animated.event(
                      [{nativeEvent: {contentOffset: {y: scrollY}}}]
                    )}
                    renderItem={({item, index}) => (
                      <EpisodeItem
                        style={{marginTop: index === 0 ? 30 : 0}}
                        onPress={onPressItem}
                        navigation={navigation}
                        episode={item}
                      />
                    )}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={Separator}
                  />
                  <SortBar refetch={() => onRefresh(refetch)} style={[{transform: [{translateY: headerTranslate}]}]}/>
                </ListWrapper>

              )
            }}
          </EpisodeService>
        </ResultsWrapper>

      </PageWrapper>
      <DropdownAlert
        showCancel={true}
        closeInterval={0}
        ref={dropDownAlertRef}
        inactiveStatusBarStyle="dark-content"
      />
    </>
  );

};


SearchPage.navigationOptions = () => ({
  headerShown: false
});

const SearchFlatList = styled(Animated.FlatList)`
`;

const ListWrapper = styled.View`
overflow:hidden;
`;

const SearchNavigator = createStackNavigator({
  Search: {
    screen: SearchPage,
  },
  Podcast: {
    screen: Podcast
  },
  Playing: {
    screen: Playing,
  }
}, {
  initialRouteName: 'Search',
  mode: 'modal'
});

export default SearchNavigator;

SearchPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    dispatch: PropTypes.func
  })
};


const ResultsWrapper = styled.View`
flex:1;

`;

const LoadingWrapper = styled.View`
  justify-content:center;
  align-items:center;
  height: 100%;
`;

const Center = styled.View`
justify-content: center;
align-items: center;
flex:1;
`;

// const styles = StyleSheet.create({
//   tabs: {
//     borderBottomWidth: 1,
//     borderBottomColor: variables.BORDER_COLOR_DARK,
//     marginBottom: variables.M_3
//   }
// });
