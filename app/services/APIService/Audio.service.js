import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';

export const AUDIO_TEXT_QUERY = gql`
    query Audio($feedUri: String!, $minute: String!, $duration: Int) {
        audioText(feedUri: $feedUri, minute: $minute, duration: $duration) {
            status
            clip {
                uri
                transcription {
                    transcript
                    words {
                        word
                        startTime {
                            seconds
                            millis
                        }
                        endTime {
                            seconds
                            millis
                        }
                    }
                }
            }
        }
    }
`;


function AudioText({children, feedUri, minute, duration = 25 }) {
  const variables = {
    feedUri,
    minute,
    duration,
  };
  const {data, loading, error} = useQuery(AUDIO_TEXT_QUERY, { variables });
  return children({data, loading, error});
}

export default {
  AudioText,
}
