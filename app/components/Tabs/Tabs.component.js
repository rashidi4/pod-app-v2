import React, { Component } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import styled from 'styled-components/native';
import TabAnchor from './components/TabAnchor.component';
import TabContent from './components/TabContent.component';
import PropTypes from 'prop-types';
import variables from '../styles/variables';

const Wrapper = styled.View`
  flex: 1;
  ${({ bg }) => bg ? `background: ${bg};` : ''}
`;

const Buttons = () => {};

const ViewTab = ({ children }) => {
  return children;
};

export default class Tabs extends Component {
  static Buttons = Buttons;
  static Anchor = TabAnchor;

  static Content = TabContent;
  static View = ViewTab;

  constructor(props) {
    super(props);
    const { children, tab } = this.props;
    // buttons
    let buttonsRow = children.find(child => child.type === Buttons);
    if (!buttonsRow) return;
    this.buttonsBgColor = buttonsRow.props.bg || variables.BACKGROUND_BG;
    this.buttonsColor =  buttonsRow.props.color || variables.ACTIVE_COLOR;
    let buttons = buttonsRow.props.children;
    if (!Array.isArray(buttons)) {
      buttons = [buttons];
    }
    const anchors = buttons.filter(child => child.type === TabAnchor);
    const routes = anchors.map(anchor => ({
      key: anchor.props.id,
      title: anchor.props.children.toString()
    }));

   this.views =  this.getViews();

   let index = typeof tab !== 'undefined'
      ? tab
      : 0;

   index = Math.max(index, 0);

    this.state = {
      index,
      routes
    }
  }

  getViews = () => {
    //content
    const { children } = this.props;
    let contentRow = children.find(child => child.type === TabContent);

    let views = contentRow.props.children;
    if (!Array.isArray(views)) {
      views = [views];
    }
    return views;
  };

  setTabViewHeight = () => {

  };

  getTabHeight = (tabIndex) => {
    const { index } = this.state;
    if (tabIndex === index) {
      return '100%';
    }
    const height = Dimensions.get('window').height;
    return height - 250;
  };
  scenes = ({ route, jumpTo }) => {
    const views = this.getViews();

    const childIndex = views.findIndex(v => {
      return v.props.id === route.key;
    });

    const child = views[childIndex].props.children;

    return <View
      onLayout={ this.setTabViewHeight}
      style={{ height: this.getTabHeight(childIndex), flex: 1}}
      jumpTo={jumpTo}
    >{child}</View>;
  };

  componentDidUpdate() {
    const { tab, onIndexChange  } = this.props;
    const { index} = this.state || {};
    if (typeof tab !== 'undefined' && onIndexChange) {
      if (tab !== index) {
        setTimeout(() => {
          this.setState({index: tab});
        },10);
      }
    }
  }

  render() {
    const { bg, style } = this.props;
    return (
      <Wrapper bg={bg} style={style}>
        <TabView
          renderTabBar={props =>
            <TabBar
              {...props}

              indicatorStyle={{ backgroundColor: variables.ACTIVE_COLOR }}
              style={{ backgroundColor: this.buttonsBgColor }}
              renderLabel={({ route }) => (
                <Text style={{ color: this.buttonsColor, margin: 8 }}>
                  {route.title}
                </Text>
              )}
            />
          }
          navigationState={this.state}
          renderScene={this.scenes}
          onIndexChange={index => {
            if (this.props.onIndexChange) {
              this.props.onIndexChange(index);
            } else {
              this.setState({ index })
            }

          }}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </Wrapper>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
  ]),
  tab: PropTypes.number,
  forceTab: PropTypes.string,
  bg: PropTypes.string,
  onIndexChange: PropTypes.func,
  style: PropTypes.shape({}),
};

Tabs.defaultProps = {
  style: {}
};
