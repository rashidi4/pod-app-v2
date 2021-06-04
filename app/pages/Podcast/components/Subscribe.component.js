import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import {useMutation, useQuery} from '@apollo/client';
import {LATEST_QUERY, UserFragment} from '../../../services/APIService/User.service';
import TinyButton from '../../../components/Button/TinyButton.component';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import variables from '../../../components/styles/variables';
import gql from 'graphql-tag';

export const SUBSCRIBE_MUTATION = gql`
    mutation subscribe($podcastId: ID!, $status: SubscriptionTypes!, $term: String) {
        subscribe(podcastId: $podcastId, status: $status) {
            user {
                id
                name
                email
                subscriptions
                ...Latest
            }
        }
    }
    ${UserFragment.latest}
`;


export const USER_QUERY = gql`
    query User {
        user {
            id
            name
            email
            subscriptions
        }
    }
`;


function isSubscribed({user} = {}, podcastId) {
  if (!user) return null;
  return (user.subscriptions || []).indexOf(podcastId) > -1;
}

function update(cache, {data}) {

  const variables = {
    term: ''
  };
  cache.writeQuery({
    query: LATEST_QUERY,
    variables,
    data: {
      user: data.subscribe.user
    }
  });
}

function SubscribeBtn({podcastId, useBtn = true, textColor = variables.LIGHT_BLUE}) {
  const [subscribe, mutationData] = useMutation(SUBSCRIBE_MUTATION, {update});
  const {data, loading, error} = useQuery(USER_QUERY);

  const [subscribed, setSubscribe] = useState(isSubscribed(data, podcastId));

  useEffect(() => {
    const subscr = isSubscribed(data, podcastId);
    if (typeof subscr === 'boolean' && subscr !== subscribed) {
      setSubscribe(subscr);
    }
  }, [data]);

  useEffect(() => {
    const subscr = isSubscribed(mutationData, podcastId);
    if (typeof subscr === 'boolean' && subscr !== subscribed) {
      setSubscribe(subscr);
    }
  }, [mutationData]);

  const onPressSubscribe = () => {
    const variables = {
      status: subscribed ? 'UNSUBSCRIBED' : 'SUBSCRIBED',
      podcastId,
      term: ''
    };
    setSubscribe(!subscribed);
    subscribe({ variables });
  };

  const Btn = useBtn
    ? TinyButton
    : TouchableOpacity;

    return (
      <Btn onPress={onPressSubscribe} disabled={loading || !!error || mutationData.loading}>
        <BtnText color={textColor}>{subscribed ? 'Unsubscribe' : 'Subscribe'}</BtnText>
      </Btn>
    );

  }

  SubscribeBtn.propTypes = {
    podcastId: PropTypes.string,
    useBtn: PropTypes.bool,
    textColor: PropTypes.string,
  };

  const BtnText = styled.Text`
color: ${({color}) => color}
`;

  export default SubscribeBtn;
