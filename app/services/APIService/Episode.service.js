import {useEffect} from 'react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';

const EpisodeFragment = gql`
    fragment Episode on EpisodeDocument {
        id
        date
        dateAsText @client
        duration
        durationClient @client
        clientCleanSummary @client
        title
        author
        audio {
            uri
            bucketPath
        }
        description
        summary
        userLike
        image {
            uri
        }
        podcast {
            id
            title
            image {
                uri
            }
            author
        }
    }
`;

export const EPISODE_QUERY = gql`
    query EpidosdeSearch($term: String, $filter: String, $pagination: PaginationInput) {
        browseEpisodes(term: $term, filter: $filter, pagination: $pagination) {
            id
            episodes {
                ...Episode
            }
        }
    }
    ${EpisodeFragment}
`;


const paginationDefault = {
  start: 0,
  limit: 20
};

export const TRACK_EPISODE_PLAY = gql`
    mutation EpisodeTrack($episodeId: ID!) {
        trackPlay(episodeId: $episodeId) {
            ...Episode
        }
    }
    ${EpisodeFragment}
`;

function EpisodeService({term = '', filter = '', pagination = paginationDefault, children, onChange}) {
  const resp = useQuery(EPISODE_QUERY, {variables: {term, filter, pagination}, fetchPolicy: 'cache-and-network'});
  useEffect(() => {
    if (onChange) {
      onChange(resp);
    }
  }, [pagination.start, resp.data, filter, term]);
  return children(resp);
}


export default EpisodeService;
