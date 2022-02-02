import React from "react";

import { Image, TouchableOpacity, I18nManager, Text, View } from "react-native";
import { images, fonts } from '../Theme';
import { TextInput } from "react-native-gesture-handler";

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp
// } from "react-native-responsive-screen";

export default function Checkbox({
  placeholder = "Submit",
  checkedIcon = images.radioButtonOn,
  uncheckedIcon = images.radioButtonOff,
  checked = checked,
  fontSize = 16,
  marginRight = "1%",
  marginLeft = "1%",
  titleColor = '#000',
  title,
  onPress
}) {
  return (
    <View style={{ flexDirection: "row", marginTop: 10 }}>

      <TouchableOpacity onPress={onPress} style={{ flexDirection: "row" }}>
        <View style={{ justifyContent: 'center' }}>
          <Image source={checked ? checkedIcon : uncheckedIcon} style={{}} />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ color: titleColor, marginLeft: 5, fontSize: fontSize, fontFamily: fonts.type.NunitoSans_SemiBold   }}>{title}</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}
const colors = {
  primary: "rgba(22,12,81,1)",
  textColor: "rgba(180,180,180,1)",
  text: "#0C222B",
  button: "#036675",
  primarygradient1: "#160c51",
  primarygradient2: "#24157a",
  success: "#27ae60",
  white: "white",
  red: "red",
  black: "#000000",
  gradient1: "rgba(0,0,0,0.36)",
  gradient2: "rgba(22,12,81,0.36)",
  flatListBG: "rgba(242, 242, 242, 1 )",
  green: "#108d00",
  goldenColor: "#fe953a"
};

// const fonts = {
//   regular: "Regular",
//   bold: "Rubik-bold",
//   medium: "Rubik-Medium"
// };
const styles = {
  textStyle: {
    color: colors.textColor

    //fontFamily: fonts.regular
  }
};
