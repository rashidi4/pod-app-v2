import {useEffect, memo} from 'react';
import {useMutation} from '@apollo/client';
import {TRACK_EPISODE_PLAY} from '../../services/APIService/Episode.service';
import Player from '../Player';

const update = (cache, {data: {trackPlay}}) => {
  const { audio, id } = trackPlay;
  const currentId = Player.episode?.id;

  if (currentId && currentId === id && audio.bucketPath) {
    Player.episode.audio.bucketPath = audio.bucketPath;
  }
};

const TrackPlay = ({ episodeId }) => {

  const [trackEpisode] = useMutation(TRACK_EPISODE_PLAY, {update});
  useEffect(() => {
    trackEpisode({ variables: { episodeId}});
  }, [episodeId]);

  return null;
};

export default memo(TrackPlay)
