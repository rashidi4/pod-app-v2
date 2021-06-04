import React, { useCallback, useState, useEffect } from 'react';
import {TouchableOpacity} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {shape, string, number} from 'prop-types';
import styled from 'styled-components/native';
import variables from '../../../components/styles/variables';
import {useMutation} from '@apollo/client';
import gql from 'graphql-tag';

const LIKE_CLIP = gql`
    mutation LikeClip($clipId: ID!, $feeling: String, $value: Boolean) {
        likeClip(
            clipId: $clipId
            feeling: $feeling
            value: $value
        ) {
            id
            userLike
            likes
        }
    }
`;


const LIKE_EPISODE = gql`
    mutation Like($type: String, $episodeId: ID!, $podcastId: ID!, $feeling: String, $value: Boolean) {
        likeEpisode(
            episodeId: $episodeId
            podcastId: $podcastId
            feeling: $feeling
            value: $value
        ) {
            id
            userLike
            likes
        }
    }
`;

const getType = ({ episode, clip }) => {
  if (episode) {
    return 'EPISODE'
  } else if (clip) {
    return 'CLIP';
  }
  return 'CLIP';
};

const LikeButton = ({ episode, clip, size = 18 }) => {
  const [likeValue, setLikeValue] = useState((episode || clip).userLike || 0);

  const [likeClip] = useMutation(LIKE_CLIP);
  const [likeEpisode] = useMutation(LIKE_EPISODE);
  useEffect(() => {
    if (episode || clip) {
      setLikeValue((episode || clip).userLike || 0);
    }
  }, [clip?.id, episode?.id]);

  const handleLike = useCallback(async () => {
    const value = likeValue < 1;

    const type = getType({ episode, clip });
    let variables = {};
    if (type === 'EPISODE') {
      variables = {
        episodeId: episode ? episode.id : undefined,
        podcastId: (episode || clip).podcast.id,
        feeling: 'LIKE',
        value
      };
    } else {
      variables = {
        clipId: clip ? clip.id : undefined,
        feeling: 'LIKE',
        value
      };
    }

    setLikeValue(value ? 1 : 0);

    const action = type === 'EPISODE'
      ? likeEpisode
      : likeClip;

    action({variables});
  }, [likeValue, episode, clip]);
  // const handleDislike = useCallback(async () => {
  //   const value = likeValue > -1;
  //   const variables = {
  //     type: getType({ episode, clip }),
  //     episodeId: episode ? episode.id : undefined,
  //     clipId: clip ? clip.id : undefined,
  //     podcastId: (episode || clip).podcast.id,
  //     feeling: 'DISLIKE',
  //     value
  //   };
  //   setLikeValue(value ? -1 : 0);
  //   like({variables});
  // });
  return(
    <LikeWrapper>
      <Btn onPress={handleLike}>
        <FontAwesome
          name={likeValue > 0 ? 'thumbs-up' : 'thumbs-o-up'}
          size={size}
          color={variables.BORDER_COLOR_DARK}
        />
      </Btn>
    </LikeWrapper>
  )
};
LikeButton.propTypes = {
  episode: shape({
    id: string,
    podcast: shape({
      id: string,
    })
  }),
  clip: shape({}),
  size: number
};

export default LikeButton;

const Btn = styled(TouchableOpacity)`
margin-right: ${variables.M_1}px;
`;


const LikeWrapper = styled.View`
flex-direction: row;
justify-content: space-between;
width:40px;
`;
