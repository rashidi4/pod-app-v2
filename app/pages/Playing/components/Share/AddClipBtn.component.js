import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@apollo/client';
import gql from 'graphql-tag';
import {TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import colorVariables from '../../../../components/styles/variables';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import variables from '../../../../components/styles/variables';

const CLIP_MUTATION = gql`
mutation AddClip(
    $startMillis: Int!
    $minute: String!
    $duration: Int!
    $episodeDuration: Int!
    $uri: String!
    $feedUri: String!
    $redirectUri: String
) {
    addClip(
        startMillis: $startMillis
        minute: $minute
        duration: $duration
        episodeDuration: $episodeDuration
        uri: $uri
        feedUri: $feedUri
        redirectUri: $redirectUri
    ) {
        status
        clip {
            id
        }
    }
}
`;

const isActive = ({ active, loading}) => {
  return active && !loading;
};

const NOOP = () => {};

const CutClipBtn = (props) => {
  const {
    minute,
    duration,
    active,
    episode,
    startMillis,
    onLoad,
    onError,
  } = props;

  const variables = {
    minute,
    feedUri: episode.feedUri,
    uri: episode.audio.uri,
    redirectUri: episode.audio.redirectUri,
    duration,
    episodeDuration: episode.audio.durationMillis,
    startMillis,
  };

  const [addClip, { data, loading, error }] = useMutation(CLIP_MUTATION, { variables });

  useEffect(() => {
    if (data) {
      onLoad(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error]);
  const act = isActive({ active, loading });
  return (
    <CutWrapperBtn
      active={act}
      onPress={addClip}
      disabled={!act}
    >
      <MaterialCommunityIcons
        name="scissors-cutting"
        size={24}
        color={colorVariables.LIGHT_BLUE}
      />
    </CutWrapperBtn>
  )
};

CutClipBtn.propTypes = {
  minute: PropTypes.string,
  duration: PropTypes.number,
  episode: PropTypes.shape({
    audio: PropTypes.shape({
      uri: PropTypes.string,
      redirectUri: PropTypes.string,
      durationMillis: PropTypes.number,
    }),
    feedUri: PropTypes.string,
  }),
  startMillis: PropTypes.number,
  selection: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.number
    )
  ),
  active: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

CutClipBtn.defaultProps = {
  onError: NOOP,
  onLoad: NOOP,
};

export default CutClipBtn;

const CutWrapperBtn = styled(TouchableOpacity)`
  background-color: ${variables.ACTIVE_COLOR};
  height: 50px;
  width: 50px;
  justify-content: center;
  align-items:center;
  border-radius: 25px;
  margin-right: 20px;
  opacity: ${({ active }) => active ? 1 : 0.3 };
  `;
