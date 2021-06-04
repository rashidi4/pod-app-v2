import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';

export const CATEGORIES_QUERY = gql`
    query Category($categories: [String]!) {
        categoriesSearch(categories: $categories) {
            category
            data {
                id
                author
                feedUri
                title
                image{
                    uri
                }
            }
        }
    }
`;

function Categories({ children, categories = GENRES }) {
  const {data, loading, error} = useQuery(CATEGORIES_QUERY, { variables: { categories }});
  return children({data, loading, error});
}

export const GENRES = [
  'Arts',
  'Automotive',
  'Business',
  'Careers',
  'Comedy',
  'Education',
  'Entrepreneurship',
  'Fiction',
  'Health & Fitness',
  'Leisure',
  'Medicine',
  'Mental Health',
  'Natural Science',
  'Science',
  'Science Fiction',
  'Society & Culture',
  'Sports',
  'Technology',
  'TV & Film',
];

export default {
  Categories
}

