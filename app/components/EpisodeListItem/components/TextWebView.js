import React from 'react';
import {WebView, View} from 'react-native';

function TextWebView(){
  return (
    <View style={{ flex: 1, width: 100, height: 100 }}>
      <WebView source={{ html: '<h1>Hello</h1>'}} />
    </View>
  )
}
export default TextWebView
