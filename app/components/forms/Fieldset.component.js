import React, {Component} from 'react';
import styled from 'styled-components/native'
import {shape, number} from 'prop-types';
import withChildComponents from '../hoc/withChildComponents';
import Input from './components/Input.component';
import Label from './components/Label.component';
import variables from '../styles/variables';


class Fieldset extends Component {
  render() {
    const { marginBottom, style } = this.props;
    return (
      <Wrapper marginBottom={marginBottom} style={style}>
        {this.components.Label}
        {this.components.Input}
      </Wrapper>
    );
  }
}

Fieldset.propTypes = {
  marginBottom: number,
  style: shape({})
};


export default withChildComponents(Fieldset, [{
  ComponentClass: Label,
  className: 'Label'
}, {
  ComponentClass: Input,
  className: 'Input'
}]);

Fieldset.defaultProps = {
  marginBottom: variables.M_3
};

const Wrapper = styled.View`
margin-bottom: ${({marginBottom}) => marginBottom }px;
`;
