import {useEffect} from 'react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';
import DOWNLOADS_QUERY from '../../model/queries/downloads';
import PROGRESS_QUERY from '../../model/queries/progress';


export const UserFragment = {
  latest: gql`
    fragment Latest on User {
        latest(term: $term) {
            id
            author
            title
            feedUri
            image {
                uri
            }
            episode {
                id
                duration
                currentPositionMillis @client
                durationClient @client
                date
                dateAsText @client
                daysAgo @client
                image {
                    uri
                }
                inProgress @client
                feedUri
                audio {
                    uri
                }
                description
                title
                summary
            }
        }
    }
  `
};

export const LATEST_QUERY = gql`
    query Latest($term: String) {
        user {
            id
            name,
            email
            subscriptions
            ...Latest
        }
    }
  ${UserFragment.latest}
`;

export const User = {
  fragments: {
    clip: gql`
        fragment Clip on ClipDocument {
            id
            feedUri
            duration
            durationAsText @client
            filepath
            startMillis
            minuteAsText @client
            startMillis @client
            startToFinish @client
            title
            transcription {
                transcript
            }
            userLike
            likes
            podcast {
                id
                author
                title
                feedUri
                image {
                    uri
                }
            }
            episode {
                id
                title
                date
                audio {
                    uri
                    bucketPath
                }
                image {
                    uri
                }
                feedUri
                dateAsText @client
                duration
                durationClient @client
            }
        }
    `
  }
};

export const CLIPS_QUERY = gql`
    query Clips($episodeId: ID, $term: String) {
        userClips(episodeId: $episodeId, term: $term) {
            id
            clips {
                ...Clip
            }
        }
    }
    ${User.fragments.clip}
`;

function Latest({ children, term = '', onLoad }) {
  const resp = useQuery(LATEST_QUERY, {variables: { term }, fetchPolicy: 'network-only'});
  useEffect(() => {
    if (onLoad) {
      onLoad(resp);
    }
  }, [resp.data]);
  return children(resp);
}

function Clips({episodeId, term, children, onLoad}) {
  const variables = {
    episodeId,
    term,
  };
  const resp = useQuery(CLIPS_QUERY, {variables, fetchPolicy: 'cache-and-network'});
  useEffect(() => {
    if (onLoad) {
      onLoad(resp);
    }
  }, [resp.data]);
  return children(resp);
}

function Downloads({children, onLoad}) {
  const resp = useQuery(DOWNLOADS_QUERY);
  if (onLoad) {
    onLoad(resp);
  }
  return children(resp);
}

function Progress({children, onLoad}) {
  const resp = useQuery(PROGRESS_QUERY);
  if (onLoad) {
    onLoad(resp);
  }
  if (children) {
    return children(resp);
  }
  return null;
}

export default {
  Latest,
  Clips,
  Downloads,
  Progress,
  UserFragment
}
