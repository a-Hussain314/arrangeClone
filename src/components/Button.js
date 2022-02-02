//***** import libraries */
import React from "react";
import { StyleSheet, Text, Keyboard, TouchableOpacity } from "react-native";
import { CommonStyles } from "../assets/css";

//***** Common component for blue color button */
export default function({
  onPress,
  label = "Submit",
  textSize = 20,
  buttonStyle = CommonStyles.buttonStyle(),
  buttonTextStyle = CommonStyles.buttonTextStyle(),
  extraStyle,
  btnContainer = null
}) {
  return (
    <TouchableOpacity
      style={{ ...CommonStyles.buttonStyle(), paddingHorizontal: 10 }}
      onPress={() => {
        Keyboard.dismiss();
        onPress();
      }}
    >
      <Text style={{ ...CommonStyles.buttonTextStyle(textSize) }}>{label}</Text>
    </TouchableOpacity>
  );
}
