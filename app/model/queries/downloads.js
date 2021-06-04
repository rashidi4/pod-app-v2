import gql from 'graphql-tag';

const DOWNLOADS_QUERY = gql`
{
    downloads @client {
        episode
        podcast
    }
}
`;


export default DOWNLOADS_QUERY;
