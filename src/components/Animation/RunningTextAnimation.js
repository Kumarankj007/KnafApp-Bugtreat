// components/RunningTextAnimation.js

import React, {useRef, useEffect, useState} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';

const {width, height} = Dimensions.get('screen');

const RunningTextAnimation = ({ text}) => {
  const [animatedtext, setAnimatedText] = useState(text);

  useEffect(() => {
    setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedText(prevText => {
          if (prevText && prevText.length > 0) {
            return prevText.substring(1) + prevText[0];
          }
          return prevText;
        });
      }, 500);
      return () => clearInterval(interval); 
    }, 800);
  }, []);

  return (
      <Animated.Text
        numberOfLines={1}
        style={[
          {
            color: appColors.themeBlue,
            fontSize: 11,
            fontFamily: appFont.Lato_Bold,
            marginBottom: 4,
            width: width / 3,
            paddingRight: 10,
          },
        ]}>
        {animatedtext}
      </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default RunningTextAnimation;
