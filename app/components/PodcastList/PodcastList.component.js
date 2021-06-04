import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import variables from '../styles/variables';

const PodcastList = (props) => {
  const { children, data, height, bg = variables.LIGHT_BG, shadow = true, style, refetch } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refetch) {
      const resp = await refetch();
     if (!resp.loading) {
       setRefreshing(false);
       setLoading(false);
     } else {
       setLoading(true);
     }
    }
  }, [refreshing, loading]);


  let optionalProps = {};
  if (refetch) {
    optionalProps = {
      refreshControl: <RefreshControl enabled refreshing={refreshing} onRefresh={onRefresh}/>
    };
  }
  if (props.scrollEventThrottle) {
    optionalProps.scrollEventThrottle = props.scrollEventThrottle;
  }
  if (props.onScroll) {
    optionalProps.onScroll = props.onScroll;
  }
  return (
    <Wrapper bg={bg} height={height} shadow={shadow} style={style}>
      <ScrollView
        {...optionalProps}
      >
        {data.map(item => {
          return children({ item });
        })}
      </ScrollView>

    </Wrapper>
  );
};

export default PodcastList;

PodcastList.propTypes = {
  bg: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  children: PropTypes.func,
  height: PropTypes.number,
  keyExtractor: PropTypes.func,
  shadow: PropTypes.bool,
  style: PropTypes.shape({}),
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  onScroll: PropTypes.func,
  scrollEventThrottle: PropTypes.number,
};

const Wrapper = styled.View`
  background-color: ${({bg}) => bg };
  margin-bottom: ${variables.MB_2};
  border-radius: ${variables.BORDER_RADIUS};
  padding: ${variables.P_1}px;
  min-height: 400px;
  ${( {shadow = true }) => shadow ? `
    shadow-opacity: 0.2;
    shadow-radius: 2px;
    shadow-color: #000000;
    shadow-offset: -2px 2px;
    elevation:1;
  `
  : ''})}

  ${({ height}) => height ? `height: ${height}${typeof height === 'number' ? 'px': ''}` : ''}
`;


PodcastList.defaultProps = {
  keyExtractor: item => '' + item.trackId
};
