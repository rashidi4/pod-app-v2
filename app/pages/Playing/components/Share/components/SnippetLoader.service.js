import React, {useEffect} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import TextSnippet from '../TextSnippet.component';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Empty from './Empty.component';
import Error from './Error.component';
import Loading from './Loading.component';
import {SelectableText} from '../../../../Share/components/SelectableText';
import {getMinute} from '../../../../../util';

const STATUS = {
  EMPTY: 'EMPTY',
  ERROR: 'ERROR',
  LOADING: 'LOADING',
  COMPLETE: 'COMPLETE',
  PROCESSING: 'PROCESSING',
};

export const AUDIO_TEXT_QUERY = gql`
    query Audio($episodeId: ID!, $minute: String!, $duration: Int!) {
        audioText(episodeId: $episodeId, minute: $minute, duration: $duration) {
            status
            clip {
                id
                feedUri
                status
                details
                transcription {
                    words {
                        word
                        speakerTag
                        startTime
                        endTime
                    }
                }
            }
        }
    }
`;

const PROCESS_AUDIO_CLIP = gql`
    mutation AudioCreate(
        $episodeId: ID!
        $minute: String!,
        $duration: Int!,
    ) {
        audioToText(
            episodeId: $episodeId
            minute: $minute
            duration: $duration
        ) {
            id
            status
            clip {
                id
                feedUri
                status
                details
                transcription {
                    words {
                        word
                        speakerTag
                        startTime
                        endTime
                    }
                }
            }
        }
    }
`;

const onSelectionChange = (value) => {
  console.log(value);
};

const getStatus = ({data, loading, mutation, error}) => {
  if (error) return STATUS.ERROR;
  if (loading) return STATUS.LOADING;
  if (mutation && mutation.loading) return STATUS.LOADING;
  if (mutation && mutation.error) return STATUS.ERROR;
  if (data && data.audioText && data.audioText.status === STATUS.COMPLETE) {
    return data.audioText.status;
  }
  if (mutation && mutation.data && mutation.data.audioToText) return mutation.data.audioToText.status;
  if (data && data.audioText && data.audioText) return data.audioText.status;

  // @todo probably should be here
  return STATUS.EMPTY;
};

const SnippetLoader = (props) => {
  const {
    snippet,
    onLoad,
    onPressWord,
    selection,
    episode,
  } = props;

  const {
    minute,
    feedUri,
    uri,
    redirectUri,
    duration,
    episodeDuration,
    pre,
    post,
    words,
    index,
  } = snippet;
  const variables = {
    uri,
    feedUri,
    redirectUri,
    episodeId: episode.id,
    minute,
    duration: duration + pre + post,
    episodeDuration,
  };
  let [fetchText, {data, loading, error, startPolling, stopPolling, refetch}] = useLazyQuery(AUDIO_TEXT_QUERY, {variables});
  const [processAudioClip, mutation] = useMutation(PROCESS_AUDIO_CLIP, {variables});
  if (mutation.error) {
    error = mutation.error;
  }

  useEffect(() => {
    if (data) {
      onLoad(data);
    }

    if (data && data.audioText) {
      const {status} = data.audioText;
      if (status === 'COMPLETE' || status === 'ERROR') {
        stopPolling();
      }
    }
  }, [data]);


  useEffect(() => {
    if (mutation.data && mutation.data.audioToText && mutation.data.audioToText.status === 'PROCESSING') {
      // start polling
      refetch();
      startPolling(2000);
    } else if (mutation.data && mutation.data.audioToText && mutation.data.audioToText.status === 'ERROR') {
      stopPolling();
      refetch();
    }
  }, [mutation.data]);

  useEffect(() => {
    fetchText();
  }, []);

  const uiStatus = getStatus({data, loading, mutation, error});
  // const {transcription} = data.audioText.clip;
  const min = getMinute(variables.minute, pre);
  // words gets passed in
  return (
    <TextSnippet minute={min}>

      {uiStatus === 'LOADING' && <Loading text="Loading Clip"/>}

      {uiStatus === 'ERROR' &&
      <Error
        text="Error Loading Clip"
        description={error ? error.toString() : ''}
        onPress={() => processAudioClip({variables})}
      />
      }
      {uiStatus === 'EMPTY' &&
      <Empty
        onPress={processAudioClip}/>
      }
      {uiStatus === 'PROCESSING' && <Loading text="Processing Clip"/>}
      <SelectableText
        onSelectionChange={onSelectionChange}
        onPress={onPressWord}
        text={(words || []).map(w => w.word).join(' ')}
        duration={variables.duration}
        pre={pre}
        minute={minute}
        post={post}
        selection={selection}
        index={index}
      />

    </TextSnippet>
  );
};

SnippetLoader.propTypes = {
  snippet: PropTypes.shape({
    minute: PropTypes.string,
    feedUri: PropTypes.string,
    uri: PropTypes.string,
    redirectUri: PropTypes.string,
    duration: PropTypes.number,
    episodeDuration: PropTypes.number,
    pre: PropTypes.number,
    post: PropTypes.number,
    index: PropTypes.number,
    words: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  episode: PropTypes.shape({
    id: PropTypes.string
  }),
  onLoad: PropTypes.func,
  onPressWord: PropTypes.func,
  selection: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.number
    )
  ),

};

export default SnippetLoader;
