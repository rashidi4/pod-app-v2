import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';


export const PODCAST_QUERY = gql`
    query PodcastFeed($podcastId: ID!) {
        podcastDoc(podcastId: $podcastId, episodeLimit: 20) {
            author
            image { uri }
            title
            feedUri
            summary
            genres,
            episodes {
                audio { uri }
                date
                daysAgo @client
                duration
                duration @client
                description
                summary
                id
                image { uri }
                title
            }
        }
    }
`;

function PodcastFeed({ podcastId, children }) {
  const {data, loading, error} = useQuery(PODCAST_QUERY, {variables: {podcastId}});
  return children({data, loading, error});
}

export default PodcastFeed;
