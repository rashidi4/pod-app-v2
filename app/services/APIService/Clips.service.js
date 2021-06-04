import {useEffect} from 'react';
import gql from 'graphql-tag';
import {useLazyQuery, useQuery} from '@apollo/client';
import { User } from './User.service';

export const CLIP_IDS_QUERY = gql`
    query GetClipsByIds(
        $ids: [ID!]
    ) {
        clips(ids: $ids) {
            ...Clip
        }
    }
    ${User.fragments.clip}
`;

export const CLIPS_QUERY = gql`
    query ClipsSearch(
        $term: String
        $filter: String
        $pagination: PaginationInput
    ) {
        browseClips(term: $term, filter: $filter, pagination: $pagination) {
            id,
            pagination {
                # deprecated since using aggreation
                totalCount
                hasMore
            }
            clips {
                id
                clip {
                    ...Clip
                }
                clipIds
                likes
                count
            }
        }
    }
  ${User.fragments.clip}
`;

const paginationDefault = {
  start: 0,
  limit: 8
};

export const useClipsByIds = ({ ids, skip = false }) => {
  return useQuery(CLIP_IDS_QUERY, {variables: {ids}, skip, fetchPolicy: 'cache-and-network'});
};

export function useClipsService({term = '', filter = '', pagination = paginationDefault, skip = false, lazy = false}) {
  if (lazy) {
    return useLazyQuery(CLIPS_QUERY, {variables: {term, filter, pagination}, skip});
  }
  const resp = useQuery(CLIPS_QUERY, {variables: {term, filter, pagination}, skip});

  return resp;
}
function ClipsService({term = '', filter = '', pagination = paginationDefault, children, onChange}) {
  const resp = useClipsService({term, filter, pagination});
  useEffect(() => {
    if (onChange) {
      onChange(resp);
    }
  }, [pagination.start, resp.data, filter, term]);
  if (children && typeof children === 'function') {
    return children(resp);
  }

  return null;
}

export default ClipsService;
