


import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Platform, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { globalImagePath } from '../../../constants/globalImagePath';
import { Container, Content } from 'native-base';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import { CommonStyles } from '../../../assets/css';
import OTPTextView from '../../../components/OTPTextView';
import ErrorMessage from '../../../components/ErrorMessage';
import validate from '../../../components/Validations/validate_wrapper';
import I18n from '../../../I18n';
import { I18nManager } from 'react-native';
import { showToast, showDangerToast } from '../../../components//ToastMessage';
import { colors, metrics } from "../../../Theme";
import { postService } from '../../../services/postServices';
import { AuthContext } from '../../../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
const width = metrics.screenWidth;
export default function OtpScreen({ route, navigation }) {
  const { auth: { login } } = React.useContext(AuthContext);
  const [otp, setOtp] = React.useState('');
  const [otpError, setOtpError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [token, setFcmToken] = React.useState('');

  React.useEffect(() => {
    AsyncStorage.getItem("fcmToken", async (err1, fcmToken) => {
      let token = fcmToken;
      if (fcmToken) {
        setFcmToken(token)
      }

    });
  }, []);

  const backAction = () => {

    Alert.alert(
      '',
      `Are you want's to discard this process`, [
      {
        text: I18n.t('lbl_cancel'),
        onPress: () => null,
        style: "cancel"
      },
      { text: I18n.t('lbl_ok'), onPress: () => { navigation.navigate('Login') } }
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled()) {
          disableSelectionMode();
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener("hardwareBackPress", backAction);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);

    }, [])
  );

  const onVerifyButtonPressed = () => {
    //***** For validate input fields */
    const otpError = validate('otp', otp);

    setOtpError(otpError);

    if (otpError) {
      // this.VerifyOtpBtn.shake();
    } else {
      setLoading(true);

      const postData = {
        email: route.params.email,
        otp: otp,
        type: route.params.screenName == 'forgot' ? 'forgot' : 'login',
        device_token: token,
        //device_token: 'f84BRVpsDkW3gsDjP4u1Si:APA91bFRAmWKWURE_ShpVf7Rbp0…yF7EBUMQS_5HDUd-gNJQrmEoaWlqAIt-x8xH_KtjnVTymQS2U'
      };
      console.log("postData otp", postData);
      //***** api calling */
      postService('verifyotp', postData)
        .then(async res => {
          // console.log("res", res);
          setLoading(false);
          if (res.data.status === 1) {
            showToast(res.data.message);
            if (route.params.screenName == 'forgot') {
              navigation.navigate('Reset', {
                email: route.params.email,
                userId: route.params.userId
              });
            } else {
              try {
                console.log("res.data =>", res.data);
                let approve = res.data.response && res.data.response.approved
                if (approve != 0) {
                  setLoading(true);
                  await login(res.data.response);
                } else {
                  showToast(res.data.message);
                  setTimeout(() => {
                    navigation.navigate('Login');
                  }, 1000)
                }
              } catch (e) {
                showDangerToast(e);
                setLoading(false);
              }
            }
          } else {
            setLoading(false);
            setTimeout(function () {
              showDangerToast(res.data.message);
            }, 100);
          }
        })
        .catch(error => {
          setLoading(false);
          setTimeout(function () {
            showDangerToast(error.message);
          }, 100);
        });
    }
  };

  const confirmResendAlert = () => {
    Alert.alert(
      `${I18n.t('lbl_otp_reset_msg')}`,
      '',
      [
        {
          text: `${I18n.t('lbl_cancel')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: `${I18n.t('lbl_ok')}`, onPress: () => resendButtonPressed() },
      ],
      { cancelable: false },
    );
  };

  const resendButtonPressed = () => {
    setLoading(true);

    const postData = {
      email: route.params.email,
    };

    // let body = new FormData();
    // body.append('email', route.params.email)
    console.log("body =>", postData);
    //***** api calling */
    postService('resendOtp', postData)
      .then(res => {
        console.log(JSON.stringify(res));
        setLoading(false);
        if (res.data.status === 1) {
          showToast(res.data.message);
        } else {
          setLoading(false);
          var message = '';
          res.data.errors.map((val) => {
            message += Object.values(val) + ' '
          })
          setTimeout(function () {
            showDangerToast(message != null ? message : res.data.message);
          }, 100);

        }
      })
      .catch(error => {
        setLoading(false);
        setTimeout(function () {
          showDangerToast(error.message);
        }, 100);
      });
  };

  return (
    <Container>

      <Content
        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.darkShade, }}>

        <TouchableOpacity
          style={{ paddingHorizontal: 20, marginTop: Platform.OS == 'ios' ? 7 : 15 }}
          onPress={() => navigation.navigate('Login')}>
          <Image source={globalImagePath.back_icon} resizeMode="cover" style={{ tintColor: "#fff" }} />
        </TouchableOpacity>
        <View animation="slideInDown" style={{ flexDirection: 'row', marginTop: 40 }}>

          <View style={{ flex: 1, marginHorizontal: 15, alignItems: 'flex-start' }}>
            <Text
              style={{
                ...CommonStyles.WhiteTitleTextStyle(22),
                alignSelf: 'flex-start',
              }}>
              {I18n.t('lbl_varification')}
            </Text>
            <Text
              style={{
                ...CommonStyles.LightSubTitleTextStyle(12),
                // textAlign: 'flex-start',
                marginTop: 8,
                paddingRight: 10,
              }}>
              {I18n.t('lbl_otp_subtitle')}
            </Text>
            <View style={{ flexDirection: 'row', }}>
              <Text style={{ ...CommonStyles.WhiteTitleTextStyle(12) }}>{I18n.t('lbl_email') + ' : '}</Text>
              <Text
                style={{
                  ...CommonStyles.WhiteTitleTextStyle(12),
                  // textAlign: 'flex-start',

                  paddingRight: 10,
                  textDecorationLine: 'underline'
                }}>
                {route.params.email}
              </Text>
            </View>
          </View>
          <View>
            <Image
              style={I18nManager.isRTL ? { transform: [{ rotateY: '180deg' }] } : ''}
              source={globalImagePath.otpLock}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.container}>
          <View style={{ width: '100%', marginTop: 20 }}>
            <OTPTextView
              containerStyle={styles.textInputContainer}
              handleTextChange={otp => {
                setOtp(otp);
                setOtpError(validate('otp', otp));
              }}
              // textInputStyle={{ borderRadius: 5, }}
              cellTextLength={1}
              tintColor={CommonStyles.THEME_COLOR}
              inputCount={4}
              keyboardType="numeric"
            />
            {otpError.length > 0 &&
              <View style={{ paddingLeft: Platform.OS == 'ios' ? 15 : 35 }}>
                <ErrorMessage text={otpError} />
              </View>
            }
            <View
              // ref={ref => (VerifyOtpBtn = ref)}
              animation="slideInUp"
              style={{ marginVertical: 20, marginHorizontal: 20 }}>
              <Button
                label={I18n.t('lbl_verify')}
                textSize={14}
                onPress={() => onVerifyButtonPressed()}
              />
            </View>
            <View animation="slideInUp">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...CommonStyles.InfoTextStyle(14),
                    alignSelf: 'center',
                  }}>
                  {I18n.t('lbl_dont_receive_code')}{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    confirmResendAlert();
                  }}>
                  <Text
                    style={{
                      ...CommonStyles.ThemeTextStyle(14),
                      //fontFamily: 'Roboto-Bold',
                    }}>
                    {I18n.t('lbl_resend')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Content>

    </Container>
  );
}

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteColor,
    marginTop: width * (50 / 375),
    borderTopLeftRadius: width * (40 / 375),
    borderTopRightRadius: width * (40 / 375),
    paddingTop: width * (50 / 375),

  },
};
