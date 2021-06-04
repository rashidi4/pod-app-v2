import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import withChildComponents from '../hoc/withChildComponents';
import Fieldset from './Fieldset.component';
import Submit from './Submit.component';
import Input from './components/Input.component';
import Message from './components/Message.component';


class Form extends Component {
  // all form element refs
  elements = [];

  traverseChildren = (children) => {
    return React.Children.map(children, (child) => {
      // if (!child || !child.type) return child;

      let {children} = child.props || {};
      if (children) {
        children = this.traverseChildren(children);
      }
      if (child && child.type === Submit) {
        return React.cloneElement(child, {...child.props, onSubmit: this.onSubmit}, children);
      }
      if (child && child.type === Input) {
        return React.cloneElement(child, {
          ...child.props,
          ref: (node) => {
            this.elements.push(node);
            const {ref} = child;
            if (typeof ref === 'function') {
              ref(node);
            }
          }
        }, children);
      }
      return React.cloneElement(child, {...child.props}, children);
    });
  };

  validate = () => {
    return this.elements
      .map(ref => ref.validate())
      .reduce((acc, current) => {
        return {
          isValid: acc.isValid && current.isValid,
          data: {
            ...acc.data,
            ...current.data
          }
        }
      }, {isValid: true, data: {}});
  };

  onSubmit = () => {
    const {onSubmit} = this.props;
    onSubmit(this.validate());
  };

  render() {
    // this.elements.length = 0;
    const {style} = this.props;
    return (<Wrapper style={style}>
      {this.traverseChildren(this.props.children)}
    </Wrapper>);
  }
}

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  onSubmit: PropTypes.func,
  style: PropTypes.shape({})
};

Form.defaultProps = {
  onSubmit: () => {
  },
};

export default withChildComponents(Form, [{
  ComponentClass: Fieldset,
  className: 'Fieldset'
}, {
  ComponentClass: Submit,
  className: 'Submit'
},{
  ComponentClass: Message,
  className: 'Message'
}]);


const Wrapper = styled.View`
`;
