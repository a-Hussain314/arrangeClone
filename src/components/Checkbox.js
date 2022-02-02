import React from "react";
import { Platform, Image, TouchableOpacity, Text } from "react-native";
import { colors } from '../Theme';
import { globalImagePath } from '../constants/globalImagePath';
export default function Checkbox({
  placeholder = "Submit",
  checked = false,
  fontSize = 14,
  marginRight = 5,
  onPress,
  tint_color = '#fff'
}) {
  return (
    <TouchableOpacity style={{ flexDirection: "row", }} onPress={onPress}>
      <Image
        source={checked ? globalImagePath.ic_check_box : globalImagePath.ic_check_box_outline_blank}
        style={{ marginRight: marginRight, height: 24, width: 24, }}
        tintcolor={tint_color} />
      <Text style={[styles.textStyle, { fontSize: fontSize, flexWrap: 'wrap' }]}>
        {placeholder}
      </Text>
    </TouchableOpacity>
  );
}

const styles = {
  textStyle: {
    color: colors.code_fff,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 3 : 2
  }
};
