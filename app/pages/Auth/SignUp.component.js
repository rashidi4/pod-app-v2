import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { StyleSheet, Button } from 'react-native'
import variables from '../../components/styles/variables';
import {SocialButtonText, SocialButton} from '../../components/Button/SocialButton.component';
import {Gutter, Spacer, Grid} from '../../components/styles';
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import {Form} from '../../components';
import {authenticateWithFacebook, loginWithFacebookToken} from '../../util/facebook';
import BigLoader from '../../components/Loaders/Spinner.component';


const {Row, Col} = Grid;


const handleGoogle = () => {

};

const SignUp = ({ navigation }) => {
  // const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const handleSignUp = () => {
    console.log('todo handle signup')
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

  return (
    <Wrapper style={authLoading ? styles.disabled : null}>
      <Gutter>
        <Center>
          {authLoading && <BigLoader />}
          {!authLoading && <MaterialCommunityIcons name="podcast" size={96} color={variables.BORDER_COLOR_DARK}/>}
        </Center>
        <Form onSubmit={handleSignUp}>
          <Group>
            <Form.Fieldset>
              <Form.Fieldset.Label required text="Email" />
              <Form.Fieldset.Input required name="email" />
            </Form.Fieldset>
            <Form.Fieldset>
              <Form.Fieldset.Label required text="Password" />
              <Form.Fieldset.Input type="password" required name="password" />
            </Form.Fieldset>
            <Form.Fieldset>
              <Form.Fieldset.Label required text="Password (again)" />
              <Form.Fieldset.Input type="password" required name="passwordValidate" />
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
              <SocialButtonText>Sign Up with Facebook</SocialButtonText>
            </SocialButton>
          </Col>
          <Col style={styles.spacer}><Spacer height={10}/></Col>
          <Col flex={1}>
            <SocialButton onPress={handleGoogle}>
              <FontAwesome name="google" size={36} color={variables.ACTIVE_COLOR} />
              <SocialButtonText>Sign Up with Google</SocialButtonText>
            </SocialButton>
          </Col>
        </Row>
      </Gutter>
      <Bottom>
        <BottomContent>
          <Button
            color={variables.FONT_COLOR_SUBTLE}
            title="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
          />
        </BottomContent>
      </Bottom>
    </Wrapper>
  )
};



SignUp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  })
};
export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spacer: {
    width:10
  },
  disabled: {
    opacity: 0.3
  }
});



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

export const Bottom = styled.View`
position:absolute;
bottom:0;
margin-bottom: ${variables.M_5}px;
width: 100%;
`;

export const BottomContent = styled.View`
flex:1;
justify-content: center;
align-items:center;
`;
