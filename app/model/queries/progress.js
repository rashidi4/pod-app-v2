import gql from 'graphql-tag';

const PROGRESS_QUERY = gql`
    {
        progress @client {
            episode
            podcast
        }
    }
`;


export default PROGRESS_QUERY;
