

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
import I18n from '../../../I18n';
import { I18nManager } from 'react-native';
const height = metrics.screenHeight;
const width = metrics.screenWidth;
export default class ResetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      password: '',
      passwordError: '',
      confirmPassword: '',
      confirmPasswordError: '',
    };
  }

  componentDidMount() {

  }

  resetButtonPressed = () => {
    //***** For validate input fields */
    const passwordError = validate('password', this.state.password);
    const confirmPasswordError = validate(
      'confirm_password',
      this.state.confirmPassword,
      this.state.password,
    );

    this.setState({
      passwordError: passwordError,
      confirmPasswordError: confirmPasswordError,
    });

    if (passwordError || confirmPasswordError) {
      //this.resetBtn.shake();
    } else {
      this.setState({
        loading: true,
      });
      const PostData = {
        user_id: this.props.route.params.userId,
        //  email: this.props.route.params.email,
        password: this.state.password,
        password_confirmation: this.state.confirmPassword,
      };


      console.log("reset body =>", PostData);
      //***** api calling */
      postService('reset-password', PostData)
        .then(res => {
          console.log(JSON.stringify(res));

          if (res.data.status === 1) {
            this.setState({
              loading: false,
            });
            setTimeout(() => {
              showToast(res.data.message);
              this.props.navigation.navigate('Login');
            }, 100);
          } else {
            this.setState({
              loading: false,
            });
            setTimeout(function () {
              showDangerToast(res.data.message);
            }, 100);
          }
        })
        .catch(error => {
          this.setState({
            loading: false,
          });
          setTimeout(function () {
            showDangerToast(error);
          }, 100);
        });
    }
  };

  onSelectLanguage = (lang, index) => {

    this.setState({
      //   // language: lang._id,
      //   // languageError: validate("language", lang.name),
      langVal: lang.dc
    })

  }

  render() {
    return (
      <Container>

        <Content
          contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.darkShade }}>
          <TouchableOpacity
            style={{ paddingHorizontal: 20, marginTop: Platform.OS == 'ios' ? 7 : 15, }}
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
                {I18n.t('lbl_reset_password')}
              </Text>
              <Text
                style={{
                  ...CommonStyles.LightSubTitleTextStyle(12),
                  // textAlign: 'flex-start',
                  marginTop: 8,
                  paddingRight: 10,
                }}>
                {I18n.t('lbl_reset_password_subTitle')}
              </Text>
            </View>
            <View>
              <Image
                style={I18nManager.isRTL ? { transform: [{ rotateY: '180deg' }] } : ''}
                source={globalImagePath.resetKey}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={{ width: '100%', marginTop: 20 }}>
              <TextInput
                isPlaceHolder={true}
                placeholder={I18n.t('lbl_enter_new_password')}
                isLevelShow={true}
                error={this.state.passwordError}
                secureTextEntry={true}
                level={I18n.t('lbl_new_password')}
                onChangeText={password =>
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
                placeholder={I18n.t('lbl_enter_confirm_password')}
                isLevelShow={true}
                secureTextEntry={true}
                error={this.state.confirmPasswordError}
                level={I18n.t('lbl_confirm_password')}
                onChangeText={confirmPassword =>
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
              <View
                ref={ref => (this.resetBtn = ref)}
                animation="slideInUp"
                style={{ marginVertical: 20 }}>
                <Button
                  label={I18n.t('lbl_submit')}
                  textSize={14}
                  onPress={() => this.resetButtonPressed()}
                />
              </View>
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
