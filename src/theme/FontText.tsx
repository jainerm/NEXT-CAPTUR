import React from 'react';
import {Text, TextProps, StyleSheet} from 'react-native';

const FontText: React.FC<TextProps> = ({style, ...props}) => {
  return <Text {...props} style={[styles.text, style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Google Sans Flex',
  },
});

export default FontText;
