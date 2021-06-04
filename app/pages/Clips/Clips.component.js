import React, {useState, useCallback, useRef} from 'react';
import {FlatList, Platform, RefreshControl, StatusBar} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {NavigationEvents} from 'react-navigation';
import {Gutter, PageWrapper, Spacer} from '../../components/styles';
import {Search, Title} from '../../components'
import variables from '../../components/styles/variables';
import FilterBar from '../Search/components/FilterBar.component';
import ClipItem from './components/ClipItem.component';
import {createStackNavigator} from 'react-navigation-stack';
import ClipsService from '../../services/APIService/Clips.service';
import BigLoader from '../../components/Loaders/Spinner.component';
import ClipPage from './Clip.component';
import Playing from '../Playing/Playing.component';
import NextPage from './components/NextPage.component';
import DropdownAlert from 'react-native-dropdownalert';


const ITEMS_PER_PAGE = 8;


const ClipsPage = (props) => {
  const [paginationStart, setPaginationStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [filter, setFilter] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [clips, setClips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [term, setTerm] = useState('');// eslint-disable-line
  // @ todo logic for ios 11+ to have no space
  const dropDownAlertRef = useRef(null);
  const {navigation} = props;

  // const onPressItem = useCallback((e, podcastItem) => {
  //   navigation.navigate('Podcast', {podcastItem});
  // });

  const onFilterChange = useCallback((value) => {
    setLoaded(false);
    setPaginationStart(0);
    setFilter(value);
  }, []);

  const handleChange = useCallback(({data, variables: {pagination}, error}) => {

    if (error && dropDownAlertRef.current) {
      dropDownAlertRef.current.alertWithType('error', 'Error', error.toString());
    }
    if (data) {
      const buffer = pagination.start > 0
        ? clips
        : [];


      setClips([
        ...buffer,
        ...data.browseClips.clips.filter(item=> item.clip.episode && item.clip.podcast),
      ]);

      const len = data.browseClips.clips.length;
      if (len < pagination.limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
    setLoaded(true);
  }, [paginationStart, term, filter]);

  const onRefresh = useCallback(async (refetch) => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false)
  }, [refreshing]);


  const handleItemPress = useCallback(({ clip, index, item }) => {
    const { clipIds } = item;
    navigation.navigate('ClipItem', {clip, clips, filter, term, clipIds, paginationStart, index});
  });

  const handlePagination = useCallback(() => {
    if (hasMore) {
      setPaginationStart(paginationStart + ITEMS_PER_PAGE);
    }
  });

  const handleTerm = useCallback((term) => {
    setPaginationStart(0);
    setTerm(term);
  });

  const shouldShowLoader = useCallback(({loading, loaded, paginationStart}) => {
    if (paginationStart > 0) return false;
    if (loading) return true;
    return !loaded;
  });

  const updateStatusBar = useCallback(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(variables.WHITE);
  }, []);

  return (
    <>
      <NavigationEvents onDidFocus={updateStatusBar} />
      <PageWrapper bg={variables.WHITE}>
        <Spacer height={40}/>
        <Gutter>
          <Search placeholder="Search" onSubmit={handleTerm}/>
        </Gutter>
        <FilterBar onChange={onFilterChange}/>
        <ResultsWrapper>
          <ClipsService
            onChange={handleChange}
            filter={filter}
            term={term}
            pagination={{
              start: paginationStart,
              limit: ITEMS_PER_PAGE
            }}
          >
            {({called, loading, refetch}) => {
              if (shouldShowLoader({loading, loaded, paginationStart})) {
                return (
                  <LoadingWrapper>
                    <BigLoader/>
                  </LoadingWrapper>
                );
              }
              if (called && clips.length === 0) {
                return (
                  <>
                    <Center>
                      <Title>
                        <Title.PrimaryText>
                          No Clips Found
                        </Title.PrimaryText>
                        <Title.SubText>Try removing a search or filter</Title.SubText>
                      </Title>
                    </Center>
                  </>
                );
              }

              if (!clips) return null;

              return (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      enabled
                      refreshing={refreshing}
                       onRefresh={() => onRefresh(refetch)}
                    />
                  }
                  data={clips}
                  numColumns={2}
                  renderItem={({item, index}) => (
                    <ClipItem
                      clip={item.clip}
                      onPress={({ clip }) => handleItemPress({ clip, index, item })}
                    />
                  )}
                  keyExtractor={(item, i) => `${item.clip.id}:${i}`}
                  ListFooterComponent={hasMore
                    ? <NextPage onPress={handlePagination} loading={loading}/>
                    : null
                  }
                />
              )
            }}
          </ClipsService>
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


ClipsPage.navigationOptions = () => ({
  headerShown: false,
});

const SearchNavigator = createStackNavigator({
  Clips: {
    screen: ClipsPage,
  },
  ClipItem: {
    screen: ClipPage
  },
  Playing: {
    screen: Playing,
  },
  // Podcast: {
  //   screen: Podcast
  // },
  // Playing: {
  //   screen: Playing,
  // }
}, {
  initialRouteName: 'Clips',
  mode: 'modal'
});

export default SearchNavigator;

ClipsPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    dispatch: PropTypes.func
  })
};


const ResultsWrapper = styled.View`
flex:1;
border-width:1px;
border-color: ${variables.BORDER_COLOR}
padding:20px 5px;

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

