import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {Platform, Animated, StatusBar} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import DropdownAlert from 'react-native-dropdownalert';
import Podcast from '../Podcast/Podcast.component';
import Playing from '../Playing/Playing.component';
import { SharePage } from '../Share/Share.page';
import Tags from '../Tags/Tags.component';
import {Title, Search, PodcastList, PodcastListItem} from '../../components'
import {Gutter, PageWrapper, Spacer} from '../../components/styles';
import {User} from '../../services';
import styled from 'styled-components/native';
import variables from '../../components/styles/variables';
import {trim} from '../../util';
import BigLoader from '../../components/Loaders/Spinner.component';
import {GlobalContext} from '../../util/GlobalContext';

const HEADER_MAX_HEIGHT = 80;
// const HEADER_MIN_HEIGHT = 0;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class Home extends Component {
  static contextType = GlobalContext;
  static navigationOptions = () => {
    return {
      headerShown: false
    };
  };


  state = {
    term: '',
    editedTerm: '',
    scrollY: new Animated.Value(0),
    latestResults: null
  };

  dropDownAlertRef = createRef();

  componentDidMount() {
    if (this.context) {
      this.context.onTabBarLoad(() => {
        this.context.bindTabBarPress(this.openPlayer);
      });
    }
  }

  componentWillUnmount() {
    // this.context.unBindPress();
  }

  openPlayer = ({podcast, episode}) => {
    const {navigation} = this.props;
    navigation.navigate('Playing', {item: episode, podcast});
  };

  onPressItem = (podcast) => {
    const {episode} = podcast;
    this.context.openTabBarPlayer({podcast, episode});

  };
  showView = () => {
    // this.playingRef.current.toggleView();
  };

  handleSubmitTerm = (term) => {
    this.setState({term});
  };

  handleTermChange = (text) => {
    this.setState({editedTerm: text});
  };

  onLoadResults = ({data, error}) => {
    if (data) {
      this.setState({latestResults: data});
    }

    if (error) {
      this.dropDownAlertRef.alertWithType('error', 'Error', error.toString());
    }
  };

  updateStatusBar = () => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(variables.BACKGROUND_BG);
  };

  render() {

    const {term = '', editedTerm = ''} = this.state;
    // const translateY = this.state.scrollY.interpolate({
    //   inputRange: [0, HEADER_SCROLL_DISTANCE],
    //   outputRange: [, HEADER_MIN_HEIGHT],
    //   extrapolate: 'clamp',
    // });


    // const navbarTranslate = this.state.scrollY.interpolate({
    //   inputRange: [0, HEADER_MAX_HEIGHT],
    //   outputRange: [0,  -HEADER_MAX_HEIGHT],
    //   extrapolate: 'clamp',
    // });

    const results = this.state.latestResults;

    return (
      <>
        <NavigationEvents onDidFocus={this.updateStatusBar} />
        <PageWrapper>
          <Gutter flex={1}>
            <Spacer height={40}/>
            <HomeContent>
              <HomeContentInner>
                <User.Latest term={term} style={{flex: 1}} onLoad={this.onLoadResults}>
                  {({loading, refetch}) => {
                    if (loading && !results) {
                      return (
                        <LoadingWrapper>
                          <BigLoader/>
                        </LoadingWrapper>
                      );
                    }

                    if (results && results.user && results.user.latest && results.user.latest.length === 0) {
                      return (
                        <>
                          <Search placeholder="Search" term={editedTerm} onSubmit={this.handleSubmitTerm}
                                  onChange={this.handleTermChange}/>
                          <Center>
                            <Title>
                              <Title.PrimaryText>No podcast subscriptions yet</Title.PrimaryText>
                              <Title.SubText>Podcasts you are subscribed too show up here.</Title.SubText>
                            </Title>
                          </Center>
                        </>
                      );
                    }
                    if (results) {
                      return (<>
                        <Search
                          placeholder="Search"
                          term={editedTerm}
                          onSubmit={this.handleSubmitTerm}
                          onChange={this.handleTermChange}
                        />
                        <PodcastList
                          style={{flex: 1}}
                          data={results.user.latest}
                          refetch={refetch}
                        >
                          {({item}) => item && item.episode && (
                            <PodcastListItem
                              key={item.episode.id}
                              podcast={item}
                              onPress={() => this.onPressItem(item)}
                            >
                              {item && item.image &&
                              <PodcastListItem.AlbumCover uri={item.image.uri} borderRadius={5} border/>}
                              <PodcastListItem.Title
                                title={item.title}
                                length={item.episode.durationClient}
                                subtitle={item.episode.dateAsText}
                                description={trim(item.episode.title, 160)}
                              />
                              <PodcastListItem.Separator color={variables.BORDER_COLOR}/>
                            </PodcastListItem>
                          )}
                        </PodcastList>
                      </>)
                    }
                    return null;

                  }}

                </User.Latest>
              </HomeContentInner>
            </HomeContent>
            <HomeHeader>
              <Title>
                <Title.PrimaryText>The Latest</Title.PrimaryText>
                <Title.SubText>from your library</Title.SubText>
              </Title>
            </HomeHeader>
          </Gutter>
        </PageWrapper>
        <DropdownAlert
          showCancel={true}
          closeInterval={0}
          ref={ref => this.dropDownAlertRef = ref}
          inactiveStatusBarStyle="dark-content"
        />
      </>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  })
};


const HomeNavigator = createStackNavigator({
  Home: {
    screen: Home,
  },
  Podcast: {
    screen: Podcast
  },
  Playing: {
    screen: Playing,
  },
  SharePage: {
    screen: SharePage,
  },
  Tags: {
    screen: Tags
  }
}, {
  initialRouteName: 'Home',
  mode: 'modal'
});

export default HomeNavigator;

const HomeHeader = styled.View`

  position: absolute;
  top: ${Platform.OS === 'ios' ? 0 : 40};
  left: 0;
  right: 0;
  overflow: hidden;
`;

const HomeContent = styled.View`
position:absolute;
top: ${Platform.OS === 'ios' ? 0 : 40};
left:10px;
right:10px;
bottom:0px;
flex:1;
`;

const HomeContentInner = styled.View`
flex: 1;
margin-top:${HEADER_MAX_HEIGHT}px;
`;

const LoadingWrapper = styled.View`
justify-content:center;
align-items:center;
height: 300px;
`;

const Center = styled.View`
justify-content: center;
align-items: center;
flex:1;
`;
