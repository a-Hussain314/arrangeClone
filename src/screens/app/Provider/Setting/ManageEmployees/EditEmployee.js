import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Keyboard,
  FlatList,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import {globalImagePath} from '../../../../../constants/globalImagePath';
import {Container, Content} from 'native-base';
import TextInput from '../../../../../components/TextInput';
import Button from '../../../../../components/Button';
import validate from '../../../../../components/Validations/validate_wrapper';
import AsyncStorage from '@react-native-community/async-storage';
import {postService} from '../../../../../services/postServices';
import {getService} from '../../../../../services/getServices';
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

export default function EditEmployee({route, navigation}) {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [employeeCode, setEmployeeCode] = React.useState('');
  const [employeeID, setEmployeeID] = React.useState('');

  React.useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      setName(
        route.params &&
          route.params.employeeDetails &&
          route.params.employeeDetails.name
          ? route.params.employeeDetails.name
          : '',
      );
      setEmail(
        route.params &&
          route.params.employeeDetails &&
          route.params.employeeDetails.email
          ? route.params.employeeDetails.email
          : '',
      );
      setEmployeeCode(
        route.params &&
          route.params.employeeDetails &&
          route.params.employeeDetails.employee_code
          ? route.params.employeeDetails.employee_code
          : '',
      );
      setEmployeeID(
        route.params &&
          route.params.employeeDetails &&
          route.params.employeeDetails._id
          ? route.params.employeeDetails._id
          : '',
      );
    });
    return focusListener;
  }, [navigation]);

  const editEmployee = async () => {
    //***** For validate input fields */
    const emailErr = validate('email', email);
    const nameErr = validate('employee_name', name);

    setEmailError(emailErr);
    setNameError(nameErr);

    if (emailErr || nameErr) {
    } else {
      setLoading(true);
      let body = new FormData();

      body.append('name', name);
      body.append('email', email);
      body.append('employee_id', employeeID);
      body.append('employee_code', employeeCode);

      // ***** api calling */
      postService('/employee/update-employee', body)
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
        centerText={I18n.t('lbl_edit_employee')}
      />
      <Content
        contentContainerStyle={{}}
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
              editable={false}
              inputStyle={{
                fontFamily: 'NunitoSans-Regular',
                borderRadius: 5,
                marginTop: 4,
                height: 50,
                color: 'rgb(38, 38, 38)',
                fontSize: 14,
                flex: 1,
                backgroundColor: '#efefef',
                paddingLeft: 15,
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
                backgroundColor: '#efefef',
                paddingLeft: 15,
              }}
              onChangeText={(code) => {
                setEmployeeCode(code);
              }}
              value={employeeCode}
            />

            <View style={{marginTop: 20, marginBottom: 10}}>
              <Button
                label={I18n.t('lbl_submit')}
                textSize={16}
                onPress={() => {
                  editEmployee();
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
