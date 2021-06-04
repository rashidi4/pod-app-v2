import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {Text, Dimensions, Platform, View} from 'react-native';
import {WebView} from 'react-native-webview';
import variables from '../../components/styles/variables';
import {Gutter, PageWrapper, Spacer, Grid, WebOnlyHeightHack, Img, Shadow} from '../../components/styles';
import {PodcastList, EpisodeListItem, Tabs, Loaders} from '../../components';
import {PodcastFeed} from '../../services';
import Subscribe from './components/Subscribe.component';
import {GlobalContext} from '../../util/GlobalContext';

const {Row, Col} = Grid;
const {Spinner} = Loaders;


export default class Podcast extends Component {
  static navigationOptions = () => ({
    headerShown: true,
    headerStyle: {
      backgroundColor: variables.YELLOW,
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      boxShadow: 'none'
    }
  });

  constructor(props) {
    super(props);

    this.state = {
      item: null,
      podcastItem: props.navigation.getParam('podcastItem'),
      podcast: props.navigation.getParam('podcast'),
    }
  }

  static contextType = GlobalContext;

  handleItemPress = ({episode, podcast}) => {
    this.context.openTabBarPlayer({podcast, episode});
  };

  render() {

    const {podcast, podcastItem = podcast} = this.state;

    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const heightBuffer = Platform.OS === 'ios' ? 0 : 40;
    if (!podcastItem) return null;
    return (
      <PageWrapper>
        <WebOnlyHeightHack>
          <Header>
            <Gutter>
              <Row>
                <Col>
                  <Shadow>
                    <Img size={145} source={{uri: podcastItem.image.uri}}/>
                  </Shadow>
                </Col>
                <Col justifyContent="space-between" flex={1} style={{marginLeft: variables.M_3}}>
                  <Group>
                    <Title>{podcastItem.title}</Title>
                    <SubTitle>{podcastItem.author}</SubTitle>
                  </Group>
                  <Subscribe podcastId={podcastItem.id}/>
                </Col>
              </Row>
            </Gutter>
          </Header>
          <PodcastFeed podcastId={podcastItem.id}>
            {({data, loading, error}) => {
              return (
                <Tabs initialTab="podcasts" bg={variables.BACKGROUND_BG}>
                  <Tabs.Buttons bg={variables.YELLOW} color={variables.FONT_COLOR_SUBTLE}>
                    <Tabs.Anchor id="podcasts">Podcasts</Tabs.Anchor>
                    <Tabs.Anchor id="details">Details</Tabs.Anchor>
                  </Tabs.Buttons>
                  <Tabs.Content>
                    <Tabs.View id="podcasts">
                      <Gutter>
                        <Spacer height={20}/>
                        {loading && <LoadingWrapper>
                          <Spinner/>
                        </LoadingWrapper>
                        }
                        {error && <Text>{error.toString()}</Text>}
                        {data && data.podcastDoc && !!data.podcastDoc.episodes.length && !loading && !error && (
                          <PodcastList
                            shadow={false}
                            height={windowHeight - 400 + heightBuffer}
                            data={data.podcastDoc.episodes}
                          >
                            {({item}) => (
                              <EpisodeListItem
                                key={item.id}
                                ellipsis={false}
                                item={item}
                                onPress={(e, item) => this.handleItemPress({episode: item, podcast: data.podcastDoc})}>

                                <EpisodeListItem.Title
                                  title={item.title}
                                  description={item.summary}
                                  daysAgo={item.daysAgo}
                                  vertical="center"
                                  duration={item.duration}
                                />
                                <EpisodeListItem.Separator color={variables.SEPARATOR_COLOR}/>
                              </EpisodeListItem>
                            )}
                          </PodcastList>
                        )}

                      </Gutter>

                    </Tabs.View>
                    <Tabs.View id="details">
                      <View style={{height: 200}}>
                        <View style={{flex: 1, backgroundColor: 'transparent'}}>
                          {data && <WebView
                            style={{flex: 1, width: windowWidth, backgroundColor: 'transparent'}}
                            originWhitelist={['*']}
                            source={{html: `<html style="font-family:Arial, Helvetica, sans-serif;font-size:12px; color:${variables.FONT_COLOR_SUBTLE}"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${data.podcastDoc.summary}</body></html>`}}
                          />}
                        </View>
                      </View>
                    </Tabs.View>
                  </Tabs.Content>
                </Tabs>);
            }}
          </PodcastFeed>
        </WebOnlyHeightHack>
      </PageWrapper>
    );
  }
}

Podcast.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func
  })
};


const Header = styled.View`
  background-color: ${variables.YELLOW};
  height: 150px;
  `;

// web nests nested pages inside div and flex:1 does not work
// to fill the page

const Title = styled.Text`
  font-size: ${variables.FONT_SIZE_H1}px;
  color: ${variables.FONT_COLOR_DARK};
  font-weight: bold;
  margin-bottom: ${variables.M_3}px;
  `;

const SubTitle = styled.Text`
  font-size: ${variables.FONT_SIZE_H3};
  color: ${variables.FONT_COLOR_SUBTLE};
  margin-bottom: ${variables.M_3}px;
  `;


const Group = styled.View`
  flex: 1;
  `;

const LoadingWrapper = styled.View`
  justify-content:center;
  align-items:center;
  height: 300px;
  `;

