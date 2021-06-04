import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import styled from 'styled-components/native';
import {useMutation, useQuery} from '@apollo/client';
import {TouchableOpacity} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import variables from '../../../components/styles/variables';
import gql from 'graphql-tag';
import DOWNLOADS_QUERY from '../../../model/queries/downloads';



const useProgress = () => {

  const [percent, setPercent] = useState(0);

  let v = null;
  const setPercentWrapper = (value) => {
    if (v !== value && value % 5 === 0) {
      v = value;
      setPercent(v);
    }
  };

  return [percent, setPercentWrapper];
};

const ADD_DOWNLOAD = gql`
mutation AddDownload($episode: EpisodeInput!, $podcast: PodcastInput!) {
    addDownload(episode: $episode, podcast: $podcast) @client
}
`;

const useStatus = ({ episodeUri }) => {
  const {data, loading, error} = useQuery(DOWNLOADS_QUERY);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (data) {
      const index = data.downloads.findIndex(d => d.episode.audio.uri === episodeUri );
      if (index > -1) {
        setStatus('DOWNLOADED');
      }
    }
    if (loading) {
      setStatus('LOADING');
    }

    if (error) {
      setStatus('ERROR');
    }
  }, [status, data]);


  return [status, setStatus]
};


const Download = ({ episode, podcast, onPressDownloads }) => {
  const [status, setStatus] = useStatus({ episodeUri: episode.audio.uri });
  const [percent, setPercent] = useProgress(null);

  const mutationVariables = {
    episode,
    podcast,
  };
  const [addDownload] = useMutation(ADD_DOWNLOAD, {variables: mutationVariables});

  const downloadCallback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    const updatedPercent = Math.round(progress * 100);
    setPercent(updatedPercent);
  };


  const downloadEpisode = async () => {
    const {uri} = episode.audio;
    const {id} = episode;

    // redirect to downloads page if its downlooaded
    if (status === 'DOWNLOADED') {
      // @todo go to downloads
      onPressDownloads();
      return;
    }
    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      `${FileSystem.documentDirectory}${id}.mp3`,
      {},
      downloadCallback
    );

    if (status !== 'DOWNLOADING') {
      setStatus('DOWNLOADING');
      try {
        const {uri: localUri} = await downloadResumable.downloadAsync();
        console.log(localUri);
        await addDownload();
        // @todo save localUri in mutation to use later in downloads tab
      } catch (e) {
        console.error(e);
      }
      setStatus('DOWNLOADED');
    }
  };
  return (
    <DownloadWrapper>
      {status === 'DOWNLOADING' &&
      <AnimatedCircularProgress
        size={30}
        width={5}
        fill={percent}
        rotation={0}
        tintColor={variables.BORDER_COLOR_DARK}
        backgroundColor={variables.LIGHT_BLUE}>
        {() => (
          <MaterialCommunityIcons
            name="download-outline"
            size={20}
            color={variables.BORDER_COLOR_DARK}
          />)
        }
      </AnimatedCircularProgress>
      }
      {status !== 'DOWNLOADING' &&
      <TouchableOpacity onPress={downloadEpisode}>
        <MaterialCommunityIcons
          name="download-outline"
          size={30}
          color={status === 'DOWNLOADED'
            ? variables.ACTIVE_COLOR
            : variables.BORDER_COLOR_DARK
          }

        />
      </TouchableOpacity>}
    </DownloadWrapper>
  )
};

Download.propTypes = {
  episode: PropTypes.shape({
    id: PropTypes.string,
    audio: PropTypes.shape({
      uri: PropTypes.string
    }),
    feedUri: PropTypes.string,
  }),
  podcast: PropTypes.shape({

  }),
  onPressDownloads: PropTypes.func,

};

export default Download;

const DownloadWrapper = styled.View`
align-items:center;
justify-content:center;
`;

