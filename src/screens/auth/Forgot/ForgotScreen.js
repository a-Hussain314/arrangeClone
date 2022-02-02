import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { globalImagePath } from '../../../constants/globalImagePath';
import { Container, Content } from 'native-base';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import { CommonStyles } from '../../../assets/css';
import validate from '../../../components/Validations/validate_wrapper';
import { colors, metrics } from "../../../Theme";
import { showToast, showDangerToast } from '../../../components//ToastMessage';
import { postService } from '../../../services/postServices';
import { I18nManager } from 'react-native';
import I18n from '../../../I18n';
import Loader from '../../../components/Loader';
const height = metrics.screenHeight;
const width = metrics.screenWidth;
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      phoneError: '',
      loading: false,
      langVal: '+91',
      email: '',
      emailError: ''
    };
  }

  componentDidMount() {

  }

  forgotButtonPressed = () => {
    //***** For validate input field */
    // const phoneError = validate('phone', this.state.phone);
    const emailError = validate('forgotEmail', this.state.email);
    this.setState({
      //phoneError: phoneError,
      emailError: emailError,
    });

    if (emailError) {
      // this.forgotBtn.shake();
    } else {
      this.setState({
        loading: true,
      });

      const PostData = {
        email: this.state.email.toLowerCase(),
      };
      //console.log("body ==>", PostData);
      // //***** api calling */
      postService('forgot-password', PostData)
        .then(res => {
          console.log(res);

          if (res.data.status === 1) {
            this.setState({
              loading: false,
            });
            setTimeout(() => {
              showToast(res.data.message);
              this.props.navigation.navigate('VerifyOtp', {
                screenName: 'forgot',
                email: this.state.email.toLowerCase(),
                userId: res.data.response._id,
              });
            }, 100);
          } else {
            this.setState({
              loading: false,
            });
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
          this.setState({
            loading: false,
          });
          setTimeout(function () {
            alert(error);
          }, 100);
        });
    }
  };

  onSelectLanguage = (lang, index) => {
    // console.log("lang ==>", lang);
    this.setState({
      //   // language: lang._id,
      //   // languageError: validate("language", lang.name),
      langVal: lang.dc
    })

  }

  render() {
    return (
      <Container>
        <Loader loading={this.state.loading} />
        <Content
          contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.darkShade }}>
          <TouchableOpacity
            style={{ paddingHorizontal: 20, marginTop: Platform.OS == 'ios' ? 7 : 15 }}
            onPress={() => this.props.navigation.goBack()}>
            <Image source={globalImagePath.back_icon} resizeMode="cover" style={{ tintColor: "#fff" }} />
          </TouchableOpacity>
          <View animation="slideInDown" style={{ flexDirection: 'row', marginTop: 40 }}>

            <View style={{ flex: 1, marginHorizontal: 15, alignItems: 'flex-start' }}>
              <Text
                style={{
                  ...CommonStyles.WhiteTitleTextStyle(22),
                  alignSelf: 'flex-start',
                }}>
                {I18n.t('lbl_forgot_password')}
              </Text>
              <Text
                style={{
                  ...CommonStyles.LightSubTitleTextStyle(12),
                  // textAlign: 'flex-start',
                  marginTop: 8,
                  paddingRight: 10,
                }}>
                {I18n.t('lbl_forgot_subTitle')}
              </Text>
            </View>
            <View>
              <Image
                style={I18nManager.isRTL ? { transform: [{ rotateY: '180deg' }] } : ''}
                source={globalImagePath.forgotLock}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.container}>
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
              onChangeText={email =>
                this.setState({
                  email: email,
                  emailError: validate('forgotEmail', email),
                })
              }
              value={this.state.email ? this.state.email : ''}
            />
            {/* <TextInput
              picker={true}
              onSelect={(val) => this.onSelectLanguage(val)}
              langVal={this.state.langVal}
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_phone')}
              isLevelShow={true}
              level={I18n.t('lbl_phone_number')}
              error={this.state.phoneError}
              keyboardType={'number-pad'}
              onChangeText={phone => this.setState({ phone: phone, phoneError: validate("phone", phone, "", true) })}
              value={this.state.phone}
            /> */}
            <View
              ref={ref => (this.forgotBtn = ref)}
              animation="slideInUp"
              style={{ marginVertical: 20 }}>
              <Button
                label={I18n.t('lbl_submit')}
                textSize={14}
                onPress={() => this.forgotButtonPressed()}
              />
            </View>
          </View>


        </Content>

      </Container>
    );
  }
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

