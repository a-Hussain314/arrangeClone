import { normalize } from '../../components/Dimensions';
import { fonts, colors } from '../../Theme';
import font from '../../Theme/font';
import { Platform } from 'react-native';
//***** common styles for whole app */
// const APP_FONT_REGULAR = 'NunitoSans-Bold';
// const APP_FONT_MEDIUM = 'NunitoSans-Regular';
// const APP_FONT_BOLD = 'Montserrat-Bold';
// const APP_FONT_SEMIBOLD = 'Montserrat-SemiBold';

const THEME_COLOR = 'rgb(196,170,153)';

const InputLabelStyle = (fontSize = 16) => ({
  fontSize: fontSize,
  letterSpacing: 0,
  color: 'rgb(0,0,0)',
  fontStyle: 'normal',
  marginTop: 10,
  fontFamily: fonts.type.NunitoSans_bold,
});

const PickerInputStyle = () => ({
  pickerConfirmBtnColor: [255, 255, 255, 1],
  pickerBg: [255, 255, 255, 1],
  pickerToolBarBg: [0, 98, 65, 1],
  pickerTitleColor: [255, 255, 255, 1],
  pickerCancelBtnColor: [255, 255, 255, 1],
});

const pickerBorderStyle = (fontSize = 14) => ({
  borderColor: 'rgb(183,190,197)',
  borderWidth: 1,
  borderRadius: 5,
  marginTop: 3,
  paddingHorizontal: 15,
  height: 50,
  fontSize: fontSize,
});

const InfoTextStyle = (fontSize = 24) => ({
  fontSize: normalize(fontSize),
  color: THEME_COLOR,
  marginTop: 20,
  fontFamily: fonts.type.NunitoSans_Regular
});

const TitleTextStyle = (fontSize = 24) => ({
  fontSize: normalize(fontSize),
  color: THEME_COLOR,
  marginTop: 20,
  fontFamily: fonts.type.NunitoSans_bold
});

const WhiteTitleTextStyle = (fontSize = 24) => ({
  fontSize: normalize(fontSize),
  color: colors.whiteColor,
  marginTop: 20,
  fontFamily: fonts.type.NunitoSans_bold
});

const SubTitleTextStyle = (fontSize = 24) => ({
  fontSize: normalize(fontSize),
  color: 'rgb(132,135,150)',
  fontFamily: fonts.type.NunitoSans_Regular
});

const LightSubTitleTextStyle = (fontSize = 24) => ({
  fontSize: normalize(fontSize),
  color: colors.lightThemeColor,
  fontFamily: fonts.type.NunitoSans_Regular
});

const TextInputStyle = (fontSize = 14, height = 50) => ({
  fontFamily: fonts.type.NunitoSans_Regular,
  borderRadius: 5,
  marginTop: 4,
  marginLeft: Platform.OS === 'ios' ? 0 : - 5,
  height: height,
  color: 'rgb(38, 38, 38)',
  fontSize: fontSize,
  flex: 1,

});

const TextareaInputStyle = (fontSize = 14) => ({
  borderColor: 'rgb(219,219,219)',
  borderWidth: 1,
  borderRadius: 5,
  marginTop: 4,
  paddingHorizontal: 15,
  color: "rgb(38, 38, 38)",
  //lineHeight: 17,
  fontSize: normalize(fontSize),
  fontFamily: fonts.type.NunitoSans_Regular,
  backgroundColor: "#ffffff",
});

const blackSemiBoldTextStyle = (fontSize = 20) => ({
  color: 'rgb(0,0,0)',
  fontSize: normalize(fontSize),
  fontFamily: font.type.NunitoSans_bold,
  textAlign: 'center',
});

const whiteSemiBoldTextStyle = (fontSize = 20) => ({
  color: '#000',
  fontSize: normalize(fontSize),
  fontFamily: font.type.NunitoSans_bold,
  textAlign: 'center',
});

const whiteRegularTextStyle = (fontSize = 20) => ({
  color: '#000',
  fontSize: normalize(fontSize),
  fontFamily: font.type.NunitoSans_Regular,
  textAlign: 'center',
});

const transparentButtonStyle = () => ({
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: THEME_COLOR,
  borderRadius: 5,
  //paddingVertical: 10,
  justifyContent: 'center',
  alignItems: 'center',
});

const buttonStyle = () => ({
  backgroundColor: THEME_COLOR,
  borderRadius: 5,
  height: 48,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const buttonTextStyle = (fontSize = 20) => ({
  color: '#ffffff',
  fontSize: normalize(fontSize),
  // textTransform: 'uppercase',
  fontFamily: fonts.type.NunitoSans_bold,
  textAlign: 'center',
});

const GrayTextStyle = (fontSize = 14) => ({
  fontSize: normalize(fontSize),
  letterSpacing: 0,
  color: 'rgb(136,136,136)',
  fontStyle: 'normal',

});

const ThemeTextStyle = (fontSize = 10) => ({
  fontSize: normalize(fontSize),
  letterSpacing: 0,
  color: 'rgb(150,136,125)',
  fontStyle: 'normal',
  fontFamily: fonts.type.NunitoSans_bold,
  marginTop: 20
});

const InfoWhiteTextStyle = (fontSize = 24) => ({
  fontSize: normalize(fontSize),
  color: colors.whiteColor,
  marginTop: 20,
  fontFamily: fonts.type.NunitoSans_Regular
});

const ThemeWhiteTextStyle = (fontSize = 10) => ({
  fontSize: normalize(fontSize),
  letterSpacing: 0,
  color: colors.whiteColor,
  fontStyle: 'normal',
  fontFamily: fonts.type.NunitoSans_bold,
  marginTop: 20
});

module.exports = {

  THEME_COLOR,
  InputLabelStyle,
  pickerBorderStyle,
  PickerInputStyle,
  TitleTextStyle,
  SubTitleTextStyle,
  TextInputStyle,
  TextareaInputStyle,
  blackSemiBoldTextStyle,
  whiteSemiBoldTextStyle,
  whiteRegularTextStyle,
  transparentButtonStyle,
  buttonStyle,
  buttonTextStyle,
  GrayTextStyle,
  ThemeTextStyle,
  InfoTextStyle,
  WhiteTitleTextStyle,
  LightSubTitleTextStyle,
  InfoWhiteTextStyle,
  ThemeWhiteTextStyle
};
