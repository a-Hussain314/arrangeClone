import React from 'react';
import {
  Image,
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Body, Button, Header, Icon, Left, Right, Title } from 'native-base';
import { colors } from '../Theme';
import { AuthContext } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonStyles } from '../assets/css';
import { useNavigation } from '@react-navigation/native';
import I18n from '../I18n';

// Nav bar component
export default function NavBar({
  textColor,
  color,
  tintColor,
  leftIcon,
  isLeftIconUrl,
  navigator,
  backgroundColor,
  title,
  isCenterImage = true,
  centerImg,
  centerText,
  rightImage,
  isRightText = false,
  rightText,
  rightNavigateScreen,
  onRightPress,
  onRightTextPress = onRightTextPress,
  notifyCount = '',
  titleTop = I18n.t('lbl_wlcome_back')//'Welcome back!'
}) {
  const navigation = useNavigation();
  const { auth: { logout } } = React.useContext(AuthContext);

  const onSignOut = async props => {
    logout();
  };

  function confirmAlert(props) {
    Alert.alert(
      'Do you want to logout?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => onSignOut(props) },
      ],
      { cancelable: false },
    );
  }

  return (
    <Header
      hasTabs
      style={[style.headerContainer, { backgroundColor: backgroundColor }]}>
      <Left
        style={{
          alignItems: 'flex-start',
          flex: titleTop != '' ? 0.25 : 0.15,
        }}>
        <Button
          style={style.leftBtn}
          transparent
          onPress={() => {
            isLeftIconUrl ? {} : navigator.goBack();
          }}>
          <Image
            style={[
              isLeftIconUrl ? style.leftBtnImg : { marginTop: 10 },
              { tintColor: tintColor },
            ]}
            source={isLeftIconUrl ? { uri: leftIcon } : leftIcon}
          />
        </Button>
      </Left>
      <Body style={style.bodyContainer}>
        {titleTop != '' ? <Text style={{ ...CommonStyles.blackSemiBoldTextStyle(10) }}>
          {titleTop}
        </Text> : null}
        <Text style={{ ...CommonStyles.blackSemiBoldTextStyle(15) }}>
          {centerText}
        </Text>

      </Body>
      <Right style={style.rightContainer}>
        {isRightText ?
          <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, marginLeft: 10 }}>
            <TouchableOpacity style={{}} onPress={() => onRightTextPress()}>
              <Text style={{ ...CommonStyles.blackSemiBoldTextStyle(10) }}>{rightText}</Text>
            </TouchableOpacity>
          </View>
          : rightImage != undefined && (
            <Button
              transparent
              onPress={() => { Keyboard.dismiss(); navigator.navigate('Notification'); }}>
              <Image
                style={[style.centerImg, { tintColor: tintColor }]}
                source={rightImage}
              />
              {notifyCount > 0 ?
                <View
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.themeColor,
                    top: '-25%',
                    //left: Platform.OS == 'ios' ? '-5%' : '-5%',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      //fontFamily: fonts.Regular,
                      fontSize: 8,
                    }}>
                    {notifyCount}
                  </Text>
                </View>
                : null}
            </Button>
          )}
      </Right>
    </Header>
  );
}

const style = StyleSheet.create({
  headerContainer: {
    // marginTop: Platform.OS == 'ios' ? -40 : 0,
    marginBottom: Platform.OS == 'ios' ? 10 : 0,
    marginLeft: Platform.OS == 'ios' ? '3%' : 0,
    marginRight: '0.5%',

  },
  leftBtn: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',

  },
  leftBtnImg: {
    height: 35,
    width: 35,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  bodyContainer: {
    zIndex: 9999,
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 0,
  },
  centerImg: {
    marginRight: Platform.OS == 'ios' ? 0 : -5,
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  notiContainer: {
    height: 20,
    width: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red', //colors.goldenColor,
    top: '-25%',
    left: Platform.OS == 'ios' ? '-27%' : '-5%',
  },
  notiCount: {
    color: '#ffffff', //colors.white,
    fontSize: 10,
  },
});
