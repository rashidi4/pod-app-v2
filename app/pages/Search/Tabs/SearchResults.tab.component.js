import React, {useState, useCallback, createRef} from 'react';
import {func} from 'prop-types';
import {Text, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {Loaders, PodcastList, PodcastListItem, Search} from '../../../components';
import variables from '../../../components/styles/variables';
import {PodcastSearch} from '../../../services';
import styled from 'styled-components/native';

const {Spinner} = Loaders;

const SearchTab = ({ onPressItem }) => {

  const [term, setTerm] = useState('');
  const ref = createRef();
  const focusSearch = useCallback(() => {
    if (ref && ref.current) {
      ref.current.focus();
    }
  }, []);
  return (
    <Wrapper>
      <Search inputRef={ref} placeholder="Search" onSubmit={(term) => setTerm(term)}/>
      <PodcastSearch term={term}>
        {({data, loading, error, refetch}) => {
          if (loading) {
            return (
              <LoadingWrapper>
                <Spinner size={48}/>
              </LoadingWrapper>
            );
          }
          if (!term) {
            return (
              <EmptySearch>
                <EmptySearchButton onPress={focusSearch}>
                  <MaterialIcons name="search" size={48} color={variables.BORDER_COLOR_DARK}/>
                  <EmptySearchText>Search For a Podcast</EmptySearchText>
                </EmptySearchButton>
              </EmptySearch>
            )
          }
          if (error) {
            return <Text>{error.toString()}</Text>;
          }
          if (!data) {
            return null;
          }
          return (
            <PodcastList
              height={350}
              shadow={false}
              bg={variables.BACKGROUND_BG}
              data={(data.searchItunes || [])}
              refetch={refetch}
            >
              {({item}) => item &&  (
                <PodcastListItem
                  key={item.id}
                  podcast={item}
                  justifyContent="center"
                  onPress={(e) => onPressItem(e, item)}
                >
                  <PodcastListItem.AlbumCover
                    size={45}
                    borderRadius={5}
                    uri={item.image.uri}
                    style={{marginRight: variables.M_2}}
                  />
                  <PodcastListItem.Title
                    title={item.title}
                    subtitle={item.author}
                  />
                  <PodcastListItem.Separator color={variables.SEPARATOR_COLOR} left={52}/>
                </PodcastListItem>
              )}
            </PodcastList>);
        }}
      </PodcastSearch>
    </Wrapper>)
};


SearchTab.propTypes = {
  onPressItem: func
};
export default SearchTab;

const Wrapper = styled.View`
margin: ${variables.M_3}px 0;
`;

const LoadingWrapper = styled.View`
justify-content:center;
align-items:center;
height: 300px;
`;

const EmptySearch = styled.View`
height: 100px;
justify-content: center;
align-items: center;
`;

const EmptySearchButton = styled(TouchableOpacity)`
align-items:center;
`;

const EmptySearchText = styled.Text`
color: ${variables.ACTIVE_COLOR};
`;
