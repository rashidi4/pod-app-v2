import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {User} from '../../../services';
import {Title, PodcastList, PodcastListItem, Search} from '../../../components';
import BigLoader from '../../../components/Loaders/Spinner.component';
import {Gutter} from '../../../components/styles';
import variables from '../../../components/styles/variables';

const Clips = ({onPressClip, onLoad}) => {
  const [data, setData] = useState(null);
  const [term, setTerm] = useState('');
  const [editedTerm, setEditedTerm] = useState('');

  const handleOnLoad = useCallback((resp) => {
    if (onLoad) {
      onLoad(resp);
    }

    if (resp.data) {
      setData(resp.data);
    }
  }, []);
  return (
    <Wrapper>
      <Gutter>
        <Search
          placeholder="Search"
          term={editedTerm}
          onSubmit={(value) => setTerm(value)}
          onChange={(value) => setEditedTerm(value)}
        />
        <User.Clips term={term} onLoad={handleOnLoad}>
          {({loading, called, refetch}) => {
            if (loading) {
              return <LoadingWrapper>
                <BigLoader/>
              </LoadingWrapper>
            }

            if (called && data && data.userClips && data.userClips.clips && data.userClips.clips.length === 0) {
              return (
                <>
                  <Center>
                    <Title style={styles.noResultsTitle}>
                      <Title.PrimaryText>No Clips Yet</Title.PrimaryText>
                      <Title.SubText>Save clips.</Title.SubText>
                    </Title>
                  </Center>
                </>
              );
            }
            if (data && data.userClips && data.userClips.clips && data.userClips.clips.length) {
              return (<>
                <PodcastList
                  data={data.userClips.clips}
                  refetch={refetch}
                  style={{marginBottom: 175}}
                >
                  {({item}) => !!item && !!item.episode && (
                    <PodcastListItem
                      key={item.id}
                      onPress={() => onPressClip({clip: item})}
                    >
                      {item && item.podcast && item.podcast.image &&
                      <PodcastListItem.AlbumCover uri={item.podcast.image.uri} border borderRadius={5}/>}
                      <PodcastListItem.Title
                        title={item.title}
                        subtitle={`${item.episode.dateAsText} @ ${item.startToFinish}`}
                        description={item.episode.title}
                      />
                      <PodcastListItem.Separator color={variables.BORDER_COLOR}/>
                    </PodcastListItem>
                  )}
                </PodcastList>
              </>)

            }

            return null
          }}
        </User.Clips>
      </Gutter>
    </Wrapper>
  )
};

Clips.propTypes = {
  onPressClip: PropTypes.func,
  onLoad: PropTypes.func,
};

export default Clips;

const Wrapper = styled.View`
margin-top: ${variables.M_3}px;
`;

const LoadingWrapper = styled.View`
justify-content:center;
align-items:center;
height: 300px;
`;

const Center = styled.View`
justify-content: center;
align-items: center;
height: 100%;
`;

const styles = StyleSheet.create({
  noResultsTitle: {
    marginTop: -175
  }
});
