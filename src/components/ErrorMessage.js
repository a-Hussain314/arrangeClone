//***** import libraries */
import React from "react";
import { StyleSheet, Text, I18nManager } from "react-native";

//***** Common component for error message */
export default function ErrorMessage({ text }) {
  return (
    <Text
      style={{
        fontSize: 12,
        marginTop: 3,
        letterSpacing: 0,
        color: "red",
        textAlign: I18nManager ? 'left' : 'right'
      }}
    >
      {text}
    </Text>
  );
}
