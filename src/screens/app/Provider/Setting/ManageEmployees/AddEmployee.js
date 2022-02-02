import React from 'react';
import {View} from 'react-native';
import {globalImagePath} from '../../../../../constants/globalImagePath';
import {Container, Content} from 'native-base';
import TextInput from '../../../../../components/TextInput';
import Button from '../../../../../components/Button';
import validate from '../../../../../components/Validations/validate_wrapper';
import AsyncStorage from '@react-native-community/async-storage';
import {postService} from '../../../../../services/postServices';
import I18n from '../../../../../I18n';
import {normalize} from '../../../../../components/Dimensions';
import NavBar from '../../../../../components/NavBar';
import Loader from '../../../../../components/Loader';
import {
  showToast,
  showDangerToast,
} from '../../../../../components/ToastMessage';
import {fonts, colors, metrics} from '../../../../../Theme';
const height = metrics.screenHeight;
const width = metrics.screenWidth;

export default function AddEmployee({route, navigation}) {
  const [loading, setLoading] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [employeeCode, setEmployeeCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [deviceToken, setDeviceToken] = React.useState('deviceToken');
  const [salonID, setSalonID] = React.useState('');

  React.useEffect(() => {
    AsyncStorage.getItem('user', (err1, item1) => {
      var userDetail = JSON.parse(item1);
      setSalonID(userDetail._id);
      let str = randomString(6);
      setEmployeeCode(str);
    });
  }, []);

  const addEmployee = async () => {
    //***** For validate input fields */
    const emailErr = validate('email', email);
    const nameErr = validate('employee_name', name);
    const passwordErr = validate('password', password);

    setEmailError(emailErr);
    setNameError(nameErr);
    setPasswordError(passwordErr);

    if (emailErr || nameErr || passwordErr) {
    } else {
      setLoading(true);
      let body = new FormData();

      body.append('name', name);
      body.append('email', email);
      body.append('saloon_id', salonID);
      body.append('employee_code', employeeCode);
      body.append('password', password);
      body.append('device_token', deviceToken);
      body.append('role', 4);

      console.log('body =>', body);
      // ***** api calling */
      postService('register', body)
        .then((res) => {
          console.log('result = ', res);

          if (res.data.status === 1) {
            setLoading(false);
            showToast(res.data.message);
            navigation.goBack();
          } else {
            setLoading(false);
            setTimeout(function () {
              showDangerToast(res.data.message);
            }, 100);
          }
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(function () {
            showDangerToast(error.message);
          }, 100);
        });
    }
  };

  const changeEmployeeCode = () => {
    let str = randomString(6);
    setEmployeeCode(str);
  };

  const randomString = (length) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  return (
    <Container>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={colors.white}
        titleTop={''}
        // centerImg={''}
        //rightImage={globalImagePath.notification}
        navigation="HomePage"
        centerText={I18n.t('lbl_add_employee')}
      />
      <Content
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        //enableOnAndroid={true}
        enableResetScrollToCoords={false}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <View style={{width: '100%', marginTop: normalize(0)}}>
            <TextInput
              showIcon={true}
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_name')}
              isLevelShow={true}
              level={I18n.t('lbl_name')}
              error={nameError}
              inputStyle={{
                fontFamily: 'NunitoSans-Regular',
                borderRadius: 5,
                marginTop: 4,
                height: 50,
                color: 'rgb(38, 38, 38)',
                fontSize: 14,
                flex: 1,
              }}
              onChangeText={(name) => {
                setName(name);
                setNameError(validate('employee_name', name));
              }}
              value={name}
            />

            <TextInput
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_email')}
              isLevelShow={true}
              level={I18n.t('lbl_email')}
              inputStyle={{
                fontFamily: 'NunitoSans-Regular',
                borderRadius: 5,
                marginTop: 4,
                height: 50,
                color: 'rgb(38, 38, 38)',
                fontSize: 14,
                flex: 1,
              }}
              error={emailError}
              keyboardType={'email-address'}
              onChangeText={(email) => {
                setEmail(email);
                setEmailError(validate('email', email));
              }}
              onEndEditing={() => {
                setEmail(email.toLowerCase());
              }}
              value={email}
            />

            {/* <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => changeEmployeeCode()}
                style={{
                  alignItems: 'flex-end',

                  backgroundColor: 'red',
                }}>
                <Text
                  style={{
                    ...CommonStyles.InputLabelStyle(),
                    fontSize: 14,
                  }}>
                  Change
                </Text>
              </TouchableOpacity>
            </View> */}
            <TextInput
              showIcon={true}
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_employee_code')}
              isLevelShow={true}
              level={I18n.t('lbl_employee_code')}
              editable={false}
              inputStyle={{
                fontFamily: 'NunitoSans-Regular',
                borderRadius: 5,
                marginTop: 4,
                height: 50,
                color: 'rgb(38, 38, 38)',
                fontSize: 14,
                flex: 1,
              }}
              onChangeText={(code) => {
                setEmployeeCode(code);
              }}
              value={employeeCode}
            />

            <TextInput
              showIcon={true}
              isPlaceHolder={true}
              secureTextEntry={true}
              placeholder={I18n.t('lbl_password')}
              isLevelShow={true}
              level={I18n.t('lbl_password')}
              error={passwordError}
              inputStyle={{
                fontFamily: 'NunitoSans-Regular',
                borderRadius: 5,
                marginTop: 4,
                height: 50,
                color: 'rgb(38, 38, 38)',
                fontSize: 14,
                flex: 1,
              }}
              onChangeText={(password) => {
                setPassword(password);
                setPasswordError(validate('password', password));
              }}
              value={password}
            />

            <View style={{marginTop: 20, marginBottom: 10}}>
              <Button
                label={I18n.t('lbl_submit')}
                textSize={16}
                onPress={() => {
                  addEmployee();
                }}
              />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  weekDays: {
    paddingHorizontal: 5,
    fontSize: 16,
    color: colors.darkShade,
    fontFamily: fonts.type.NunitoSans_bold,
    textAlign: 'center',
  },
  Amtime: {
    paddingLeft: 15,
    //  paddingVertical: 20,
    //marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightThemeColor,
  },
  pmTime: {
    paddingLeft: 15,
    //paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightThemeColor,
  },
  timeText: {
    fontSize: 14,
    color: 'rgb(212,212,212)',
    fontFamily: fonts.type.NunitoSans_bold,
  },
  toText: {
    fontSize: 12,
    color: colors.darkShade,
    fontFamily: fonts.type.NunitoSans_bold,
  },
  image: {
    height: width * (80 / 375),
    width: width * (92 / 375),
    borderTopLeftRadius: width * (10 / 375),
    borderTopRightRadius: width * (10 / 375),
    borderBottomLeftRadius: width * (10 / 375),
    borderBottomRightRadius: width * (10 / 375),
    borderRadius: 5,
    marginRight: 6,
    // borderWidth: 0.2,
    zIndex: 1,
  },
};
