import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {User} from '../../../services';
import {Title, PodcastList, PodcastListItem} from '../../../components';
import BigLoader from '../../../components/Loaders/Spinner.component';
import {Gutter} from '../../../components/styles';
import variables from '../../../components/styles/variables';

const Downloads = ({onPressDownload, onLoad}) => {

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
        <User.Downloads onLoad={handleOnLoad}>
          {({called, loading, refresh}) => {
            if (loading) {
              return <LoadingWrapper>
                <BigLoader/>
              </LoadingWrapper>
            }

            if (called && data && data.downloads && data.downloads.length === 0) {
              return (
                <Center>
                  <Title>
                    <Title.PrimaryText>No Downloads Yet</Title.PrimaryText>
                    <Title.SubText>Save downloads to listen offline.</Title.SubText>
                  </Title>
                </Center>
              );
            }
            if (data && data.downloads && data.downloads.length) {
              return (<>
                <PodcastList
                  data={data.downloads}
                  refresh={refresh}
                  style={{marginBottom: 175}}
                >
                  {({item: {episode, podcast}} ) => episode && (
                    <PodcastListItem
                      key={episode.id}
                      onPress={() => onPressDownload({ episode, podcast })}
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
        </User.Downloads>
      </Gutter>
    </Wrapper>
  )
};

Downloads.propTypes = {
  onPressDownload: PropTypes.func,
  onLoad: PropTypes.func,
};

export default Downloads;

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
