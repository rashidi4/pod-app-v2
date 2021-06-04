import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import variables from '../styles/variables';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default class Search extends Component {
  state = {
    isFocused: false,
    value: null
  };
  onFocus = (e) => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {//eslint-disable-line
      this.props.onFocus(e);//eslint-disable-line
    }
  };

  onBlur = (e) => {
    const value = e.nativeEvent.text;
    this.setState({ isFocused: false, value });
    if (this.props.onSubmit) {//eslint-disable-line
      this.props.onSubmit(value, e);//eslint-disable-line
    }
  };

  onChange = ({ nativeEvent: { text} }) => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(text);
    }
  };

  render() {
    const { isFocused, value } = this.state;
    const { term, onChange } = this.props;
    let optionalProps = {};
    if (typeof term === 'string') {
      optionalProps.value = term;
    }
    if (onChange) {
      optionalProps.onChange = this.onChange;
    }
    return (
      <Wrapper>
        {!isFocused && !value &&
          <IconWrapper><FontAwesomeIcon icon={faSearch} style={{color: '#CCC'}}/></IconWrapper>
        }
        <TextInput ref={this.props.inputRef} onFocus={this.onFocus} onEndEditing={this.onBlur} {...optionalProps} />
      </Wrapper>
    );
  }
}

Search.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  term: PropTypes.string,
  inputRef: PropTypes.any
};

const Wrapper = styled.View`
 flex-direction: row;
 justify-content: center;
 align-items: center;
 margin-bottom: ${variables.MB_3}px
 backgroundColor: ${variables.LIGHT_BLUE};
 borderRadius: 8px;
`;

const TextInput = styled.TextInput`
  flex: 1;
  backgroundColor: ${variables.LIGHT_BLUE};
  padding: ${variables.P_2}px;
  borderRadius: 8px;
`;

const IconWrapper = styled.View`
  margin-left: 10px;
`;
