import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { colors, fonts } from "../Theme";
// import fonts from "../../res/fonts";
import ScalableText from "./ScalableText";

const Lable = props => {
  const {
    title,
    color = colors.white,
    size = 17,
    font = fonts.regular,
    style,
    numberOfLines = 2,
    marginTop = 0
  } = props;
  return (
    <ScalableText
      numberOfLines={numberOfLines}
      style={{
        //fontFamily: font,
        color: color,
        fontSize: size,
        marginTop: marginTop,
        ...style
      }}
    >
      {title}
    </ScalableText>
  );
};

export default Lable;
