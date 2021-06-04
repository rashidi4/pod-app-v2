import React, { Component } from 'react';
import {Image, Platform, StatusBar} from 'react-native';
import styled from 'styled-components/native';
import variables from '../../components/styles/variables';
import {NavigationEvents} from 'react-navigation';
import { PageWrapper, Spacer, Gutter } from '../../components/styles';
import { Title, Menu } from '../../components';
import rico from '../../../assets/rico.jpg';
import firebase from '../../util/firebase';
import PropTypes from 'prop-types';
import {getPersistor, getClient} from '../../util/client';
import {GlobalContext} from '../../util/GlobalContext';
import {SelectableText} from '../Share/components/SelectableText';

class Profile extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
  }
  clearStorage = async () => {
    const persistor = getPersistor();
    const client = getClient();
    await persistor.purge();
    client.resetStore();
  };

  signOut = () => {
    const {navigation} = this.props;
    this.clearStorage();
    this.context.closeTabBarPlayer();
    firebase.auth().signOut();
    navigation.navigate('Login');
  };
  updateStatusBar = () => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(variables.ACTIVE_COLOR);
  };
  render() {
    return (
      <PageWrapper bg={variables.ACTIVE_COLOR}>
        <NavigationEvents onDidFocus={this.updateStatusBar} />
        <Header>
            <Spacer height={40} />
            <Title>
              <Title.PrimaryText color={variables.WHITE}>Profile</Title.PrimaryText>
            </Title>
        </Header>
        <ImageWrapper>
          <Shadow>
            <Img size={100} source={rico} />
          </Shadow>
          <Spacer height={20} />
          <Username>rico</Username>
        </ImageWrapper>
        <Body>
          <Gutter>
            <Menu>
              <Menu.Item title="Signout" onPress={this.signOut} />
              <Menu.Item title="Clear Storage" border={false} onPress={this.clearStorage} />
            </Menu>
          </Gutter>
        </Body>
      </PageWrapper>
    );
  }
}

Profile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  })
};

export default Profile;

const Header = styled.View`
background-color: ${variables.ACTIVE_COLOR};
height: 150px;
`;

const Body = styled.View`
background: ${variables.BACKGROUND_BG};
flex:1;
`;

const ImageWrapper = styled.View`
background: ${variables.BACKGROUND_BG};
height: 125px;
align-items:center;
`;

const Shadow = styled.View`
    margin-top: -50px;
    shadow-opacity: 0.9;
    shadow-radius: 10px;
    shadow-color: #000;
    shadow-offset: -2px 2px;
    border-radius: 50px;
    height:100px;
    width: 100px;
`;

const Img = styled(Image)`
width: 100px;
height: 100px;
border-radius: 50px;
`;

const Username = styled.Text`
  color: ${variables.FONT_COLOR_DARK};
  font-size: ${variables.FONT_SIZE_H1};
  font-weight: bold;
`;
