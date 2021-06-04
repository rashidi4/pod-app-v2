import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {User} from '../../../services';
import {Title, PodcastList, PodcastListItem} from '../../../components';
import BigLoader from '../../../components/Loaders/Spinner.component';
import {Gutter} from '../../../components/styles';
import variables from '../../../components/styles/variables';

const Progress = ({onPressProgress, onLoad}) => {

  const [data, setData] = useState(null);

  const handleOnLoad = useCallback((resp) => {

    if (onLoad) {
      onLoad(resp);
    }
    if (resp.data) {
      setData(resp.data);
    }
  },[]);
  return (
    <Wrapper>
      <Gutter>
        <User.Progress onLoad={handleOnLoad}>
          {({called, loading}) => {
            if (loading) {
              return <LoadingWrapper>
                <BigLoader/>
              </LoadingWrapper>
            }

            if (data && data.progress && data.progress.length === 0 && called) {
              return (
                <Center>
                  <Title>
                    <Title.PrimaryText>No episodes in progress</Title.PrimaryText>
                    <Title.SubText>Podcasts you are listening to show up here.</Title.SubText>
                  </Title>
                </Center>
              );
            }
            if (data && data.progress && data.progress.length) {
              return (<>
                <PodcastList
                  data={data.progress}
                  keyExtractor={(item, index) => `${item ? item.episode.audio.uri : index}`}
                  style={{marginBottom: 175}}
                >
                  {({item: {episode, podcast}} ) => episode && (
                    <PodcastListItem
                      key={episode.id}
                      onPress={() => onPressProgress({ episode, podcast })}
                    >
                      {podcast && podcast.image &&
                      <PodcastListItem.AlbumCover size={45} uri={podcast.image.uri} border borderRadius={5}/>}
                      <PodcastListItem.Title
                        title={episode.title}
                        vertical="center"
                        subtitle={episode.daysAgo}
                        length={episode.duration}
                      />
                      <PodcastListItem.Separator color={variables.BORDER_COLOR}/>
                    </PodcastListItem>
                  )|| null}
                </PodcastList>
              </>) || null;
            }

            return null;
          }}
        </User.Progress>
      </Gutter>
    </Wrapper>
  )
};

Progress.propTypes = {
  onPressProgress: PropTypes.func,
  onLoad: PropTypes.func,
};

export default Progress;

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
