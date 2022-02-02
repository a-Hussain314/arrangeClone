//***** import libraries */
import React from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import {Container, Content} from 'native-base';
import {postService} from '../../../services/postServices';
import I18n from '../../../I18n';
import {showToast, showDangerToast} from '../../../components//ToastMessage';
import validate from '../../../components/Validations/validate_wrapper';
import {globalImagePath} from '../../../constants/globalImagePath';
import NavBar from '../../../components/NavBar';
import Loader from '../../../components/Loader';
export default function ChangePasswordScreen({navigation}) {
  const [userID, setUserID] = React.useState('');
  const [oldPassword, setOldPassword] = React.useState('');
  const [oldPasswordError, setOldPasswordError] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [newPasswordError, setNewPasswordError] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem('user', (err1, item1) => {
      var userDetail = JSON.parse(item1);

      setUserID(userDetail._id);
    });
  }, []);

  const changePass = () => {
    //***** For validate input fields */
    const oldPasswordError = validate('old_password', oldPassword);
    const newPasswordError = validate('password', newPassword);
    const confirmPasswordError = validate(
      'confirm_password',
      confirmPassword,
      newPassword,
    );

    setOldPasswordError(oldPasswordError);
    setNewPasswordError(newPasswordError);
    setConfirmPasswordError(confirmPasswordError);

    if (oldPasswordError || newPasswordError || confirmPasswordError) {
    } else {
      setLoading(true);

      const postData = {
        user_id: userID,
        old_password: oldPassword,
        password: newPassword,
        confirm_new_pass: confirmPassword,
      };

      //***** api calling */
      postService('profile/update-password', JSON.stringify(postData))
        .then((res) => {
          console.log('result = ', res);

          if (res.data.status === 1) {
            setLoading(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showToast(res.data.message);
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
            alert(error);
          }, 100);
        });
    }
  };

  //***** For rendering UI */
  return (
    <Container>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        title={I18n.t('lbl_change_password')}
        isCenterImage={false}
        centerText={I18n.t('lbl_change_password')}
        navigation="HomePage"
        titleTop={''}
      />

      <Content
        style={{}}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        enableResetScrollToCoords={false}
        //enableOnAndroid={true}
      >
        <View style={styles.container}>
          <View style={{marginTop: 10}}>
            <TextInput
              isPlaceHolder={true}
              placeholder=""
              isLevelShow={true}
              secureTextEntry={true}
              level={I18n.t('lbl_old_password')}
              error={oldPasswordError}
              onChangeText={(oldPassword) => {
                setOldPassword(oldPassword);
                setOldPasswordError(validate('old_password', oldPassword));
              }}
              value={oldPassword}
            />
            <TextInput
              isPlaceHolder={true}
              placeholder=""
              isLevelShow={true}
              secureTextEntry={true}
              level={I18n.t('lbl_new_password')}
              error={newPasswordError}
              onChangeText={(newPassword) => {
                setNewPassword(newPassword);
                setNewPasswordError(validate('password', newPassword));
                if (confirmPassword != '') {
                  setConfirmPasswordError(
                    validate('confirm_password', confirmPassword, newPassword),
                  );
                }
              }}
              value={newPassword}
            />
            <TextInput
              isPlaceHolder={true}
              placeholder=""
              isLevelShow={true}
              secureTextEntry={true}
              level={I18n.t('lbl_confirm_password')}
              error={confirmPasswordError}
              onChangeText={(confirmPassword) => {
                setConfirmPassword(confirmPassword);
                setConfirmPasswordError(
                  validate('confirm_password', confirmPassword, newPassword),
                );
              }}
              value={confirmPassword}
            />
            <View style={{marginTop: 20, marginBottom: 10}}>
              <Button
                label={I18n.t('lbl_submit')}
                textSize={16}
                onPress={() => {
                  changePass();
                }}
              />
            </View>
          </View>
        </View>
      </Content>
    </Container>
  );
}

//***** Define style */
const styles = {
  container: {
    paddingHorizontal: 20,
  },
};
