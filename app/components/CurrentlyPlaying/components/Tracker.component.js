import {useEffect} from 'react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/client';
import Player from '../../Player';

const TRACK_POSITION = gql`
    mutation TrackPosition(
        $episode: EpisodeInput!
        $podcast: PodcastInput!
        $inProgess: Boolean
        $currentPositionMillis: Int
    ) {
        trackPosition(
            episode: $episode
            podcast: $podcast
            inProgress: $inProgess
            currentPositionMillis: $currentPositionMillis
        ) @client
    }
`;

const Tracker = ({ episode, podcast }) => {
  const [updatePosition] = useMutation(TRACK_POSITION);

  const onPlay = () => {
    if (episode && podcast) {
      const variables = {
        episode,
        podcast,
        inProgress: true
      };
      updatePosition({variables});
    }
  };

  const onPause = (playbackStatus) => {
    if (episode && podcast) {
      const variables = {
        episode,
        podcast,
        inProgress: true,
        currentPositionMillis: playbackStatus.positionMillis
      };
      updatePosition({variables});
    }
  };

  const onDidJustFinish = () => {
    if (episode && podcast) {
      const variables = {
        episode,
        podcast,
        inProgress: false,
        currentPositionMillis: null,
      };
      updatePosition({variables});
    }
  };

  useEffect(() => {
    Player.onEvent('play', onPlay);
    Player.onEvent('pause', onPause);
    Player.onEvent('didJustFinish', onDidJustFinish);

    return () => {
      Player.offEvent('play', onPlay);
      Player.offEvent('pause', onPause);
      Player.offEvent('justDidFinish', onDidJustFinish);
    }
  }, [episode, podcast]);
  return null;
};

export default Tracker;


