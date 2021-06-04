import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextInput} from 'react-native';
import styled from 'styled-components/native';
import {Grid} from '../../styles';
import variables from '../../styles/variables';

const {Row, Col} = Grid;

class Input extends Component {
  ref = React.createRef();
  state = {
    isValid: true,
    error: null,
    value: null,
  };
  validate = () => {
    const {value} = this.state;
    const { name, required } = this.props;
    let isValid = true;
    if (required) {
      isValid = !!value;
      if (!isValid) {
        this.setState({isValid, error: 'This field is required'});
      } else {
        this.setState({isValid, error: null});
      }
    }

    return {
      isValid,
      data: {
        [name]: value
      }
    }
  };
  onChange = (e) => {
    const {text} = e.nativeEvent;
    this.setState({ value: text }, this.validate);
  };
  render() {
    const {placeholder, type} = this.props;
    const { isValid, error } = this.state;
    let optionalProps = {};
    if (type === 'password') {
      optionalProps.secureTextEntry = true;
    }
    return (
      <Row>
        <Col flex={1}>
          <TextField isValid={isValid} placeholder={placeholder} onChange={this.onChange} {...optionalProps} />
          {error && <ErrorText>{error}</ErrorText>}
        </Col>
      </Row>
    );
  }
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string
};
Input.defaultProps = {
  required: false,
  type: 'text'
};

export default Input;

const TextField = styled(TextInput)`
border-bottom-width: 1px;
border-bottom-color: ${({ isValid }) => isValid ? variables.BORDER_COLOR_DARK : variables.RED};
font-size: ${variables.FONT_SIZE_H3}px;
`;

const ErrorText = styled.Text`
font-size: ${variables.FONT_SIZE_H5}px;
color: ${variables.RED};
`;
