import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';

export const PODCAST_QUERY = gql`
    query ItunesSearch($term: String!) {
        searchItunes(term: $term) {
            id
            title
            author
            image {
                uri
            }
            feedUri
        }
    }
`;

function PodcastSearch({term, children}) {
  const {data, loading, error, refetch} = useQuery(PODCAST_QUERY, {variables: {term}});
  return children({data, loading, error, refetch});
}

export default PodcastSearch;
