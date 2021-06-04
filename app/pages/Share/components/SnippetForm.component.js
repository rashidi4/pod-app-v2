import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/client';
import styled from 'styled-components/native';
import {Form} from '../../../components'
import {EpisodeDocument} from '../../../model/resolvers'
import {CLIPS_QUERY, User} from '../../../services/APIService/User.service';
import variables from '../../../components/styles/variables';

const CLIP_MUTATION = gql`
    mutation AddClip(
        $episodeId: ID!
        $podcastId: ID!
        $startMillis: Int!
        $duration: Int!
        $title: String!
        #$tags: String
    ) {
        addClip(
            episodeId: $episodeId
            podcastId: $podcastId
            startMillis: $startMillis
            duration: $duration
            title: $title
            #tags: $tags
        ) {
            status
            clip {
                ...Clip
            }
        }
    }
    ${User.fragments.clip}
`;

const SnippetForm = ({ millis, episode, podcast, onSuccess, onError, children }) => {
  const { startMillis, endMillis } = millis;
  const duration = endMillis - startMillis;
  const variables = {
    duration,
    startMillis,
    episodeId: episode.id,
    podcastId: podcast.id
  };

  const updateClipsQuery = ({ variables, transformer }, cache) => {
    try {
      const response = cache.readQuery({query: CLIPS_QUERY, variables});
      const data = transformer ? transformer(response) : response;
      cache.writeQuery({
        query: CLIPS_QUERY,
        variables,
        data
      });
    } catch (e) {
      // this is normal use case as apollo bug
      // https://github.com/apollographql/apollo-client/issues/1542
      // https://github.com/apollographql/apollo-feature-requests/issues/1
      // console.log(e);
    }
  };
  // const client = useApolloClient();
  const update = (cache, {data: {addClip}}) => {
    const transformer = ({ userClips }) => {
      const updated = userClips.clips.concat([addClip.clip]);
      updated.sort((a, b) => {
        return a.startMillis - b.startMillis;
      });
      return {
        userClips: {
          id: new Date().getTime(),
          clips: updated,
          __typename: 'UserClipsResponse'
        }
      }
    };

    const variables = {
      episodeId: episode.id
    };
    updateClipsQuery({ variables, transformer }, cache);

    const listTransformer = ({ userClips }) => {
      const obj = {
        ...addClip.clip,
        episode: EpisodeDocument.toObject(addClip.clip.episode)
      };
      let updated = [obj];
      if (userClips) {
        updated = [obj, ...userClips.clips]
      }

      return {
        userClips: {
          id: new Date().getTime(),
          clips: updated,
          __typename: 'UserClipsResponse'
        }
      }
    };
    // update for list view of all clips
    updateClipsQuery({ variables: {}, transformer: listTransformer }, cache);

    onSuccess(addClip);
  };

  const [addClip, { loading = false }] = useMutation(CLIP_MUTATION, {variables, update});
  const handleSubmit = async ({isValid, data: formData}) => {
    if (isValid) {
      try {
        const response = await addClip({
          variables: {
            title: formData.title,
            // tags: formData.tags
          }
        });
        // success condition is handled on update()
        if (response && response.error) {
          onError(response.error);
        }
      } catch (e) {
        onError(e);
      }
    }
  };

  const shouldShowForm = typeof startMillis === 'number' && typeof endMillis === 'number';

  return <Wrapper>
    {shouldShowForm && <Form onSubmit={handleSubmit} style={styles.container}>
      <Group>
        <Form.Fieldset marginBottom={5}>
          <Form.Fieldset.Label required text="Title"/>
          <Form.Fieldset.Input required name="title" placeholder="(your custom title)"/>
        </Form.Fieldset>
        {/*<Form.Fieldset>*/}
        {/*  <Form.Fieldset.Label text="Tags"/>*/}
        {/*  <Form.Fieldset.Input name="tags" placeholder="(science, medicine, etc...)"/>*/}
        {/*</Form.Fieldset>*/}
      </Group>
        {children}
      <Group>
        <Form.Submit text="Save Clip" loading={loading}/>
      </Group>
    </Form>}
    {!shouldShowForm && <HelpMessageWrapper>
      <HelpText>Select the text above to Save or Share</HelpText>
    </HelpMessageWrapper>}
  </Wrapper>
};

SnippetForm.propTypes = {
  children: PropTypes.node,
  millis: PropTypes.shape({
    startMillis: PropTypes.number,
    endMillis: PropTypes.number,
  }),
  episode: PropTypes.shape({
    id: PropTypes.string,
    feedUri: PropTypes.string,
    audio: PropTypes.shape({
      uri: PropTypes.string,
      redirectUri: PropTypes.string,
      durationMillis: PropTypes.number,
    }),
  }),
  podcast: PropTypes.shape({
    id: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

const NOOP = () => {
};

SnippetForm.defaultProps = {
  onSuccess: NOOP,
  onError: NOOP,
};

export default SnippetForm;

const Wrapper = styled.View`
flex: 1;

`;
const Group = styled.View`
margin: 0 ${variables.M_1}px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: variables.M_3
  }
});

const HelpMessageWrapper = styled.View`
justify-content:center;
align-items:center;
flex:1
padding: ${variables.P_3}px;
background-color: ${variables.BORDER_COLOR};
`;

const HelpText = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H3}px;
font-style: italic;
`;
