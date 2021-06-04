import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';

class Selectable extends Component {

  selectionChange = () => {

  };

  render() {
    const {text} = this.props;
    // iOS requires a textinput for word selections

    return (<TextInput
      value={text}
      editable={false}
      selectable={true}
      onSelectionChange={this.selectionChange}
      multiline
    />)
  }

}

Selectable.propTypes = {
  text: PropTypes.string
};

export default Selectable;
