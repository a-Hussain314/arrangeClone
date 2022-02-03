import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ImageBackground,
  ScrollView,
  I18nManager,
} from 'react-native';
import {globalImagePath} from '../../../constants/globalImagePath';
import {Container, Content} from 'native-base';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import {CommonStyles} from '../../../assets/css';
import validate from '../../../components/Validations/validate_wrapper';
import * as Animatable from 'react-native-animatable';
import {showToast, showDangerToast} from '../../../components/ToastMessage';
import {fonts, metrics, colors} from '../../../Theme';
import {postService} from '../../../services/postServices';
import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import {Checkbox, Lable} from '../../../components';
import I18n from '../../../I18n';
const height = metrics.screenHeight;
const width = metrics.screenWidth;
var isDissbled = false;
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      emailError: '',
      phone: '',
      phoneError: '',
      password: '',
      passwordError: '',
      confirmPassword: '',
      confirmPasswordError: '',
      name: '',
      nameError: '',
      surname: '',
      token: '',
      check2Error: '',
      checked2: false,
      surnameError: '',
      langVal: '+966',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('fcmToken', async (err1, fcmToken) => {
      let fcm_token = fcmToken;
      if (fcm_token) {
        this.setState({token: fcm_token});
      }
    });
  }

  signupButtonPressed = () => {
    var user_email = this.state.email;
    var user_password = this.state.password;
    var phoneNumber = this.state.phone;
    //***** For validate input field */
    const nameError = validate('name', this.state.name);
    const surnameError = validate('surname', this.state.surname);
    const phoneError = validate('phone', this.state.phone);
    // const emailError = validate('email', this.state.email);
    const passwordError = validate('login_password', this.state.password);
    const check2Error = validate('check2', this.state.checked2);
    const confirmPasswordError = validate(
      'confirm_password',
      this.state.confirmPassword,
      this.state.password,
    );

    this.setState({
      phoneError: phoneError,
      nameError: nameError,
      surnameError: surnameError,
      // emailError: emailError,
      passwordError: passwordError,
      confirmPasswordError: confirmPasswordError,
      check2Error: check2Error,
    });

    if (
      confirmPasswordError ||
      nameError ||
      surnameError ||
      phoneError ||
      // emailError ||
      passwordError ||
      check2Error
    ) {
      // this.signupBtn.shake();
    } else {
      this.setState({
        loading: true,
      });
      if (isDissbled) {
        return;
      }
      isDissbled = true;
      let body = new FormData();
      body.append('first_name', this.state.name);
      body.append('last_name', this.state.surname);
      body.append('role', 2);
      body.append('email', this.state.email.toLowerCase());
      body.append('password', this.state.password);
      body.append('phoneno', this.state.phone);
      body.append('country_code', this.state.langVal);
      body.append('device_token', this.state.token);
      body.append('phoneVerify', true);

      //body.append('device_token', 'f84BRVpsDkW3gsDjP4u1Si:APA91bFRAmWKWURE_ShpVf7Rbp0…yF7EBUMQS_5HDUd-gNJQrmEoaWlqAIt-x8xH_KtjnVTymQS2U')
      console.log('body =>', body);
      // ***** api calling * /
      postService('user/register', body)
        .then((res) => {
          console.log('register ====>', res);

          if (res.data.status === 1) {
            this.setState({
              loading: false,
            });
            setTimeout(() => {
              showToast(res.data.message);
              this.props.navigation.navigate('VerifyOtp', {
                screenName: 'register',
                email: user_email,
                password: user_password,
                phoneNumber
              });
            }, 100);

            this.setState({
              name: '',
              surname: '',
              email: '',
              password: '',
              phone: '',
              confirmPassword: '',
            });
          } else {
            this.setState({
              loading: false,
            });
            // console.log("res.data", res);
            // var message = '';
            // if (res.data.errors != '') {
            //   res.data.errors.map((val) => {
            //     message += Object.values(val) + ' '
            //   })
            // }
            setTimeout(function () {
              showDangerToast(res.data.message);
            }, 100);
          }
        })
        .catch((error) => {
          console.log("🚀 ~ file: SignUpScreen.js ~ line 161 ~ Login ~ error", {...error})
          this.setState({
            loading: false,
          });
          setTimeout(function () {
            alert(error);
          }, 100);
        });
    }
    setTimeout(() => {
      isDissbled = false;
    }, 2000);
  };
  
  onSelectLanguage = (lang, index) => {
    this.setState({
      //   // language: lang._id,
      //   // languageError: validate("language", lang.name),
      langVal: lang.dc,
    });
  };

  check2 = () => {
    this.setState({
      checked2: !this.state.checked2,
      check2Error: validate('check2', !this.state.checked2),
    });
  };

  render() {
    return (
      <Container style={{flex: 1}}>
        <Loader loading={this.state.loading} />

        <ImageBackground
          source={globalImagePath.signUp}
          style={styles.outer_container}>
          <View style={{backgroundColor: 'rgba(0,0,0,0.3)', paddingBottom: 20}}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                marginTop: Platform.OS == 'ios' ? 7 : 15,
              }}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={globalImagePath.back_icon}
                resizeMode="cover"
                style={{tintColor: '#fff'}}
              />
            </TouchableOpacity>
            <View style={{paddingLeft: 50, alignItems: 'flex-start'}}>
              <Animatable.View animation="slideInDown">
                <View style={{marginTop: 24}}>
                  <Image
                    source={globalImagePath.appIconWhite}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.subTitle}>{I18n.t('lbl_welcome')}</Text>
                <Text style={styles.title}>{I18n.t('lbl_create_account')}</Text>
              </Animatable.View>
            </View>
          </View>
        </ImageBackground>

        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.container}>
            <TextInput
              showIcon={true}
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_first_name')}
              isLevelShow={true}
              level={I18n.t('lbl_first_name')}
              error={this.state.nameError}
              onEndEditing={() => {
                this.setState({
                  name: this.state.name.toLowerCase(),
                });
              }}
              onChangeText={(name) =>
                this.setState({
                  name: name,
                  nameError: validate('name', name, '', true),
                })
              }
              value={this.state.name}
            />
            <TextInput
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_last_name')}
              isLevelShow={true}
              level={I18n.t('lbl_last_name')}
              error={this.state.surnameError}
              onEndEditing={() => {
                this.setState({
                  surname: this.state.surname.toLowerCase(),
                });
              }}
              onChangeText={(surname) =>
                this.setState({
                  surname: surname,
                  surnameError: validate('surname', surname),
                })
              }
              value={this.state.surname}
            />
            <TextInput
              picker={true}
              onSelect={(val) => this.onSelectLanguage(val)}
              langVal={this.state.langVal}
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_phone')}
              isLevelShow={true}
              level={I18n.t('lbl_phone_number')}
              error={this.state.phoneError}
              keyboardType={'number-pad'}
              onChangeText={(phone) =>
                this.setState({
                  phone: phone,
                  phoneError: validate('phone', phone, '', true),
                })
              }
              value={this.state.phone}
            />
            <TextInput
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_email')}
              isLevelShow={true}
              level={I18n.t('lbl_email')}
              error={this.state.emailError}
              keyboardType={'email-address'}
              onEndEditing={() => {
                this.setState({
                  email: this.state.email.toLowerCase(),
                });
              }}
              onChangeText={(email) =>
                this.setState({
                  email: email,
                  emailError: validate('email', email),
                })
              }
              value={this.state.email ? this.state.email : ''}
            />
            <>
              <TextInput
                isPlaceHolder={true}
                placeholder={I18n.t('lbl_password')}
                isLevelShow={true}
                secureTextEntry={true}
                level={I18n.t('lbl_password')}
                error={this.state.passwordError}
                onChangeText={(password) =>
                  this.setState(
                    {
                      password: password,
                      passwordError: validate('password', password),
                    },
                    () => {
                      if (this.state.confirmPassword != '') {
                        this.setState({
                          confirmPasswordError: validate(
                            'confirm_password',
                            this.state.confirmPassword,
                            password,
                          ),
                        });
                      }
                    },
                  )
                }
                value={this.state.password}
              />
              <TextInput
                isPlaceHolder={true}
                placeholder={I18n.t('lbl_confirm_password')}
                isLevelShow={true}
                secureTextEntry={true}
                level={I18n.t('lbl_confirm_password')}
                error={this.state.confirmPasswordError}
                onChangeText={(confirmPassword) =>
                  this.setState({
                    confirmPassword: confirmPassword,
                    confirmPasswordError: validate(
                      'confirm_password',
                      confirmPassword,
                      this.state.password,
                    ),
                  })
                }
                value={this.state.confirmPassword}
              />
            </>
            <TouchableOpacity
              style={{marginTop: 20, marginBottom: 10}}
              onPress={() => {
                this.props.navigation.navigate('TermAndCondition');
              }}>
              <Text style={{fontSize: 14, textDecorationLine: 'underline'}}>
                {I18n.t('lbl_term_and_condition')}
              </Text>
            </TouchableOpacity>
            <Checkbox
              fontSize={14}
              checked={this.state.checked2}
              onPress={() => this.check2()}
              placeholder={I18n.t('lbl_accept_term')}
            />
            {this.state.check2Error ? (
              <Lable
                style={{marginLeft: 12, paddingTop: 5}}
                size={11}
                color={'red'}
                title={this.state.check2Error}
              />
            ) : null}
            <View
              ref={(ref) => (this.signupBtn = ref)}
              animation="slideInUp"
              style={{marginVertical: 30}}>
              <Button
                label={I18n.t('lbl_signUp')}
                textSize={14}
                onPress={() => this.signupButtonPressed()}
              />
            </View>
          </View>

          <View
            style={{
              paddingBottom: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            <Text
              style={{
                ...CommonStyles.InfoTextStyle(14),
                alignSelf: 'center',
              }}>
              {I18n.t('lbl_already_account')}{' '}
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text
                style={{
                  ...CommonStyles.ThemeTextStyle(14),
                  //fontFamily: 'Roboto-Bold',
                }}>
                {I18n.t('lbl_sign')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = {
  container: {
    paddingHorizontal: width * (20 / 375),
    backgroundColor: '#fff',
    paddingTop: width * (20 / 375),
  },
  outer_container: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: colors.darkShade,
  },
  subTitle: {
    fontSize: width * (14 / 375),
    color: colors.lightThemeColor,
    marginTop: width * (20 / 375),
    fontFamily: fonts.type.NunitoSans_Regular,
  },
  title: {
    marginTop: width * (5 / 375),
    fontSize: width * (24 / 375),
    color: colors.whiteColor,
    fontFamily: fonts.type.NunitoSans_bold,
  },
};
