import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {Button, StyleSheet} from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import firebase from '../../util/firebase';
import { authenticateWithFacebook, loginWithFacebookToken} from '../../util/facebook';
import variables from '../../components/styles/variables';
import {Form} from '../../components';
import {SocialButtonText, SocialButton} from '../../components/Button/SocialButton.component';
import {Gutter, Grid, Spacer} from '../../components/styles';
import {Bottom, BottomContent} from './SignUp.component';
import BigLoader from '../../components/Loaders/Spinner.component';


const {Row, Col} = Grid;

const SignIn = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState();

  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleSignIn = async ({ isValid, data: formData }) => {
    if (isValid) {
      const { email, password } = formData;
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          console.log(res.user.email);
          setLoading(false);
          navigation.navigate('App');
        })
        .catch(err => {
          setLoading(false);
          setErrorMessage(err.toString(err))
        });
    }
  };
  const handleFacebook = async () => {
    try {
      const token = await authenticateWithFacebook();
      if (token) {
        setAuthLoading(true);
        await loginWithFacebookToken(token);
        setAuthLoading(false);
        navigation.navigate('App');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleGoogle = () => {

  };

  return (
    <Wrapper style={authLoading ? styles.disabled : null}>
      <Gutter>
        <Center>
          {authLoading && <BigLoader />}
          {!authLoading && <MaterialCommunityIcons name="podcast" size={96} color={variables.BORDER_COLOR_DARK}/>}
        </Center>
        <Form onSubmit={handleSignIn}>
          <Group>
            <Form.Message text={errorMessage} />
            <Form.Fieldset>
              <Form.Fieldset.Label required text="Email" />
              <Form.Fieldset.Input required name="email" />
            </Form.Fieldset>
            <Form.Fieldset>
              <Form.Fieldset.Label required text="Password" />
              <Form.Fieldset.Input type="password" required name="password" />
            </Form.Fieldset>
            {/*<Form.Fieldset>*/}
            {/*  <Form.Fieldset.Label text="Tags"/>*/}
            {/*  <Form.Fieldset.Input name="tags" placeholder="(science, medicine, etc...)"/>*/}
            {/*</Form.Fieldset>*/}

          </Group>
          <Form.Submit text="Sign In" loading={loading} />
        </Form>
        <Row>
          <Col flex={1}>
            <SocialButton onPress={handleFacebook}>
              <FontAwesome name="facebook-square" size={36} color={variables.ACTIVE_COLOR} />
              <SocialButtonText>Sign In with Facebook</SocialButtonText>
            </SocialButton>
          </Col>
          <Col style={styles.spacer}><Spacer height={10}/></Col>
          <Col flex={1}>
            <SocialButton onPress={handleGoogle}>
              <FontAwesome name="google" size={36} color={variables.ACTIVE_COLOR} />
              <SocialButtonText>Sign In with Google</SocialButtonText>
            </SocialButton>
          </Col>
        </Row>

      </Gutter>
      <Bottom>
        <BottomContent>
          <Button
            color={variables.FONT_COLOR_SUBTLE}
            title="Don't have an account? Signup"
            onPress={() => navigation.navigate('SignUp')}
          />
        </BottomContent>
      </Bottom>
    </Wrapper>
  )
};

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  })
};
export default SignIn;

const Wrapper = styled.View`
flex: 1;
justify-content:center;
background-color: ${variables.LIGHT_BLUE};
`;

const Group = styled.View`

`;

const Center = styled.View`
justify-content:center;
align-items:center;
`;


const styles = StyleSheet.create({
  spacer: {
    width:10
  },
  disabled: {
    opacity: 0.3
  }
});
