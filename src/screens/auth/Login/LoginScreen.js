import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  I18nManager,
  ImageBackground,
} from 'react-native';
import {globalImagePath} from '../../../constants/globalImagePath';
import {Container, Content} from 'native-base';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import {CommonStyles} from '../../../assets/css';
import validate from '../../../components/Validations/validate_wrapper';
import Loader from '../../../components/Loader';
import {postService} from '../../../services/postServices';
import {fonts} from '../../../Theme';
import I18n from '../../../I18n';
import {
  showToast,
  showDangerToast,
  showDangerToastLong,
} from '../../../components/ToastMessage';
import {height, width} from '../../../constants/screenSize';
import {AuthContext} from '../../../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
const THEME_COLOR = 'rgb(150,136,125)';

const _renderTitle = () => {
  return (
    <ImageBackground
      source={globalImagePath.login}
      style={{width: '100%', height: height * (210 / 667)}}
      resizeMode={'cover'}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          paddingBottom: 20,
        }}>
        <View style={{alignSelf: 'center', marginTop: 20}}>
          <Image source={globalImagePath.appIcon} resizeMode="cover" />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.title}>{I18n.t('loginTitle')}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default function LoginScreen({navigation}) {
  const {
    auth: {login},
  } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [token, setFcmToken] = React.useState('');

  React.useEffect(() => {
    AsyncStorage.getItem('fcmToken', async (err1, fcmToken) => {
      let token = fcmToken;
      if (fcmToken) {
        setFcmToken(token);
      }
    });
  }, []);

  const loginButtonPressed = () => {
    //***** For validate input field */
    const emailError = validate('email', email);
    const passwordError = validate('login_password', password);

    setEmailError(emailError);
    setPasswordError(passwordError);

    if (emailError || passwordError) {
      // this.loginBtn.shake();
    } else {
      setLoading(true);
      const data = {
        email: email,
        password: password,
        device_token: token,
        //device_token: 'f84BRVpsDkW3gsDjP4u1Si:APA91bFRAmWKWURE_ShpVf7Rbp0…yF7EBUMQS_5HDUd-gNJQrmEoaWlqAIt-x8xH_KtjnVTymQS2U'
      };

      //  console.log("data =>", data);
      // //***** api calling */
      postService('login', data)
        .then(async (res) => {
          console.log('login res =>', res);
          setLoading(false);
          await AsyncStorage.setItem('user', JSON.stringify(res.data));
          setLoading(false);
          if (res.data.status == 1 && res.data.response.email_confirmed === 1) {
            // console.log("res.data if=>", res.data.response.login_count);
            global.providerLoginCount = res.data.response.login_count;
            global.root = false;
            try {
              setLoading(true);
              await login(res.data.response);
            } catch (e) {
              showDangerToast(e);
              setLoading(false);
            }
          } else if (
            res.data.status == 1 &&
            res.data.response.email_confirmed === 0
          ) {
            //  console.log("res.data else if =>");
            navigation.navigate('VerifyOtp', {
              type:"saloon",
              screenName: 'login',
              email: email,
              password: password,
            });
          } else {
            console.log('res.data else=>');
            setLoading(false);
            setTimeout(function () {
              showDangerToast(res.data.message);
            }, 100);
          }
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(function () {
            alert(error);
          }, 100);
        });
    }
  };

  return (
    <Container style={{flex: 1}}>
      <Loader loading={loading} />
      <Content>
        <View style={{flex: 1}}>
          <View style={styles.container}>
            <View animation="slideInDown">{_renderTitle()}</View>

            <View style={{width: '100%', paddingHorizontal: 20, marginTop: 20}}>
              <TextInput
                showIcon={true}
                isPlaceHolder={true}
                placeholder={I18n.t('lbl_enter_email')}
                isLevelShow={true}
                level={I18n.t('lbl_email')}
                error={emailError}
                keyboardType={'email-address'}
                onEndEditing={() => {
                  setEmail(email.toLowerCase());
                }}
                onChangeText={(email) => {
                  setEmail(email);
                  setEmailError(validate('email', email));
                }}
                value={email ? email : ''}
              />
              <TextInput
                isPlaceHolder={true}
                placeholder={I18n.t('lbl_enter_password')}
                isLevelShow={true}
                secureTextEntry={true}
                level={I18n.t('lbl_password')}
                error={passwordError}
                onChangeText={(password) => {
                  setPassword(password);
                  setPasswordError(validate('login_password', password));
                }}
                value={password}
              />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Forgot')}
                  style={{width: '50%'}}>
                  <Text
                    style={{
                      ...CommonStyles.ThemeTextStyle(14),
                      alignSelf: 'center',
                      marginVertical: 20,
                    }}>
                    {I18n.t('lbl_forgot_password')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                // ref={ref => (this.loginBtn = ref)}
                animation="slideInUp"
                style={{marginBottom: 30}}>
                <Button
                  label={I18n.t('lbl_sign')} //lbl_sign
                  textSize={14}
                  onPress={() => loginButtonPressed()}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              bottom: 0,
            }}>
            <Text
              style={{
                ...CommonStyles.InfoTextStyle(14),
                alignSelf: 'center',
              }}>
              {I18n.t('lbl_not_registerd')}{" "}
            </Text>
            <TouchableOpacity
              onPress={
                () =>
                  navigation.navigate('AppGuide', {
                    isVerifySocialEmail: 0,
                    loginType: '',
                    email: '',
                    social_id: '',
                  })
                //navigation.navigate('FileUpload')
              }>
              <Text
                style={{
                  ...CommonStyles.ThemeTextStyle(14),
                  //fontFamily: 'Roboto-Bold',
                }}>
                {I18n.t('lbl_signup')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Content>
    </Container>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  title: {
    fontSize: 21,
    color: '#fff',
    marginTop: 20,
    fontFamily: fonts.type.NunitoSans_bold,
  },
};
