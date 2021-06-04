import React, {Component, createRef} from 'react';
import styled from 'styled-components/native';
import {Platform, StatusBar} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import PropTypes from 'prop-types';
import {createStackNavigator} from 'react-navigation-stack';
import {PageWrapper, Spacer} from '../../components/styles';
import {Tabs, Title} from '../../components';
import variables from '../../components/styles/variables';
import Clips from './components/Clips.component';
import Playing from '../Playing/Playing.component';
import Downloads from './components/Downloads.component';
import Progress from './components/Progress.component';
import DropdownAlert from 'react-native-dropdownalert';

class DownloadsWrapper extends Component {
  static navigationOptions = () => ({
    headerShown: false
  });
  dropDownAlertRef = createRef();
  currentlyPlayingRef = createRef();

  state = {
    tabIndex: 0
  };

  componentDidMount() {
    const player = this.currentlyPlayingRef.current;
    if (player) {
      player.bindPress(this.openPlayer);
    }
  }

  componentDidUpdate() {
    const {navigation} = this.props;
    const {tabIndex, once} = this.state;
    const tabIndexParam = navigation.getParam('tabIndex');
    const onceParam = navigation.getParam('once');
    if (typeof tabIndex !== 'undefined' && onceParam && onceParam !== once) {
      this.setState({once: onceParam, tabIndex: tabIndexParam});
    }
  }

  onPressClip = ({clip}) => {
    const {podcast, episode} = clip;
    const player = this.currentlyPlayingRef.current;
    if (player) {
      player.openView({podcast, episode, clip});
    }

  };

  onPress = ({podcast, episode}) => {
    const player = this.currentlyPlayingRef.current;
    if (player) {
      player.openView({podcast, episode});
    }
  };

  openPlayer = ({podcast, episode, clip}) => {
    const {navigation} = this.props;
    navigation.navigate('Playing', {item: episode, podcast, clip});
  };

  onIndexChange = (index) => {
    this.setState({tabIndex: index});
  };

  getTabIndex = () => {
    const {tabIndex} = this.state;
    return tabIndex;
  };

  handleOnLoad = (resp) => {
    if (resp.error && this.dropDownAlertRef.current) {
      this.dropDownAlertRef.alertWithType('error', 'Error', resp.error.toString());
    }
  };

  updateStatusBar = () => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(variables.WHITE);
  };

  render() {

    return (
      <>
        <NavigationEvents onWillFocus={this.updateStatusBar} />
        <PageWrapper bg={variables.WHITE}>
          <Header>
            <Spacer height={40}/>
            <Title>
              <Title.PrimaryText>My Audio</Title.PrimaryText>
            </Title>
          </Header>
          <Tabs tab={this.getTabIndex()} bg={variables.BACKGROUND_BG} onIndexChange={this.onIndexChange}>
            <Tabs.Buttons bg={variables.WHITE} color={variables.FONT_COLOR_SUBTLE}>
              <Tabs.Anchor id="clips">Clips</Tabs.Anchor>
              <Tabs.Anchor id="downloaded">Downloaded</Tabs.Anchor>
              <Tabs.Anchor id="inprogress">In Progress</Tabs.Anchor>
            </Tabs.Buttons>
            <Tabs.Content>
              <Tabs.View id="clips">
                <Clips onPressClip={this.onPressClip} onLoad={this.handleOnLoad} />
              </Tabs.View>
              <Tabs.View id="downloaded">
                <Downloads onPressDownload={this.onPress} onLoad={this.handleOnLoad} />
              </Tabs.View>
              <Tabs.View id="inprogress">
                <Progress onPressProgress={this.onPress} onLoad={this.handleOnLoad} />
              </Tabs.View>
            </Tabs.Content>
          </Tabs>
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

DownloadsWrapper.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func,
  })
};


const DonwloadsNavigator = createStackNavigator({
  Downloads: {
    screen: DownloadsWrapper,
  },
  Playing: {
    screen: Playing,
  },
}, {
  initialRouteName: 'Downloads',
  mode: 'modal'
});

export default DonwloadsNavigator;

const Header = styled.View`
background-color: #FFF;
height: 100px;
`;
