import React from 'react';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';
import {Dimensions, View, Linking} from 'react-native';
import variables from '../../../components/styles/variables';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HEIGHT = windowHeight - 300;

const Description = ({html}) => (
  <View style={{height: HEIGHT}}>
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
      {html && <WebView
        ref={(ref) => { this.webview = ref; }}
        onNavigationStateChange={(event) => {
          if (event.url && event.url !== 'about:blank') {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
        style={{flex: 1, width: windowWidth - 20, backgroundColor: 'transparent'}}
        originWhitelist={['*']}
        source={{
          html: `
            <html style="font-family:Arial, Helvetica, sans-serif;font-size:12px; color:${variables.FONT_COLOR_SUBTLE}" lang="en">
            <head title=""><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body>${html}</body>
            </html>`
        }}
      />}
    </View>
  </View>
);

Description.propTypes = {
  html: PropTypes.string
};

export default Description;
