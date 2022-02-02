import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import {Container, Content} from 'native-base';
import {fonts, colors} from '../../../Theme';
import {globalImagePath} from '../../../constants/globalImagePath';
import {CommonStyles} from '../../../assets/css';
import {normalize} from '../../../components/Dimensions';
import Loader from '../../../components/Loader';
import {AuthContext} from '../../../contexts/AuthContext';
import I18n from '../../../I18n';
import AsyncStorage from '@react-native-community/async-storage';
import {getService} from '../../../services/getServices';
import {UserContext} from '../../../contexts/UserContext';
import {CUSTOMERIMAGEURL} from '../../../utils/constants';
import {useIsFocused} from '@react-navigation/native';
import {showToast, showDangerToast} from '../../../components/ToastMessage';

export default function Setting({navigation, props}) {
  const {
    auth: {logout},
  } = React.useContext(AuthContext);
  const userDetails = React.useContext(UserContext);
  const [userID, setUserID] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isImageNotLoad, setIsImageNotLoad] = React.useState(false);
  const [image, setImage] = React.useState('');
  const isFocused = useIsFocused();
  const [menuList, setMenuList] = React.useState([
    {
      title: I18n.t('lbl_profile'),
      img: globalImagePath.dummyUserIcon,
      navigatepath: 'EditProfile',
    },
    {
      title: I18n.t('lbl_change_password'),
      img: globalImagePath.changePass,
      navigatepath: 'ChangePassword',
    },
    {
      title: I18n.t('lbl_change_langauage'),
      img: globalImagePath.languageIcon,
      navigatepath: 'SelectLanguage',
    },
    {
      title: I18n.t('lbl_notification'),
      img: globalImagePath.settingNotifyIcon,
      navigatepath: 'Notification',
    },
    {
      title: I18n.t('lbl_logout'),
      img: globalImagePath.logout,
      navigatepath: '',
    },
  ]);

  React.useEffect(() => {
    AsyncStorage.getItem('user', (err1, item1) => {
      var userDetail = JSON.parse(item1);
      setUserID(userDetail._id);
      setLoading(true);
      getUserProfileDetails(userDetail._id);
    });
  }, [isFocused]);

  //***** For getting user's profile information */
  const getUserProfileDetails = (user_id) => {
    //***** api calling */
    getService('employee/get-user-info')
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);

          let data = res.data.response;
          setName(data.name);
          setImage(data.profile_image);
          // console.log('imageUrl seeing', data);
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
  };

  const _menuList = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          item.navigatepath
            ? navigation.navigate(item.navigatepath)
            : confirmAlert(navigator);
        }}
        style={{
          borderBottomColor: colors.themeColor,
          padding: 15,
          borderBottomWidth: 0.5,
          paddingHorizontal: 20,
          flexDirection: 'row',
        }}>
        <View style={{}}>
          <Image
            source={item.img}
            style={{
              width: normalize(38),
              height: normalize(38),
              transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
            }}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              color: '#000',
              fontSize: normalize(14),
              fontFamily: fonts.type.NunitoSans_bold,
              textAlign: 'left',
              marginLeft: 15,
            }}>
            {item.title}
          </Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          <Image
            source={globalImagePath.navigateSign}
            style={{
              width: normalize(8),
              height: normalize(14),
              transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  //***** For logout user's profile information */
  const onSignOut = () => {
    setLoading(true);
    //***** api calling */
    getService('profile/logout')
      .then((res) => {
        setLoading(false);
        console.log('profile/logout res.data', res.data);
        if (res.data.status === 1) {
          setLoading(false);
          global.root = false;
          logout();
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
  };

  function confirmAlert(props) {
    Alert.alert(
      `${I18n.t('lbl_want_to_logout')}`,
      '',
      [
        {
          text: `${I18n.t('lbl_cancel')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: `${I18n.t('lbl_ok')}`, onPress: () => onSignOut(props)},
      ],
      {cancelable: false},
    );
  }

  return (
    <Container>
      <Loader loading={loading} />
      <View
        style={{
          backgroundColor: colors.moreLight,
          height: normalize(200),
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{marginTop: 20, marginLeft: 20}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{width: normalize(20), height: normalize(20)}}
              source={globalImagePath.back_icon}
            />
          </TouchableOpacity>
          <View>
            <AuthContext.Consumer>
              {(context) => (
                <View style={{alignItems: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Notification');
                    }}
                    style={{
                      alignItems: 'flex-end',
                      marginTop: 20,
                      marginRight: 20,
                      //top: 20,
                      width: '15%',
                    }}>
                    <Image
                      source={globalImagePath.notification}
                      style={{
                        width: normalize(20),
                        height: normalize(22),
                        alignSelf: 'flex-end',
                        //marginRight: 15,
                      }}
                    />
                    {context.notificationCount > 0 ? (
                      global.notifyCount != 0 ? (
                        <View
                          style={{
                            height: 15,
                            width: 15,
                            borderRadius: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.themeColor,
                            top: '-25%',
                            position: 'absolute',
                            //left: Platform.OS == 'ios' ? '-5%' : '-5%',
                          }}>
                          <Text
                            style={{
                              color: colors.white,
                              //fontFamily: fonts.Regular,
                              fontSize: 8,
                            }}>
                            {context.notificationCount}
                          </Text>
                        </View>
                      ) : null
                    ) : null}
                  </TouchableOpacity>
                </View>
              )}
            </AuthContext.Consumer>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              //borderWidth: 1,
              //borderColor: colors.lightThemeColor,
              width: normalize(90),
              height: normalize(90),
              borderRadius: normalize(50 / 2),
            }}>
            <Image
              source={image ? {uri: image} : globalImagePath.dummyUserIcon}
              style={{
                width: normalize(90),
                height: normalize(90),
                borderRadius: normalize(25),
              }}
              onLoadStart={() => setIsImageNotLoad(true)}
              onLoad={() => setIsImageNotLoad(false)}
            />
            {isImageNotLoad ? (
              <ActivityIndicator
                style={{
                  position: 'absolute',
                  marginTop: normalize(50),
                  marginLeft: normalize(50),
                }}
                size="small"
                color={'rgb(196,170,153)'}
                animating={isImageNotLoad}
              />
            ) : null}
          </View>
          <Text
            style={{...CommonStyles.whiteSemiBoldTextStyle(16), marginTop: 10}}>
            {name}
          </Text>
        </View>
      </View>

      <View style={{flex: 1, marginTop: 20}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={menuList}
          renderItem={({item, index}) => _menuList(item, index)}
          keyExtractor={(item, index) => String(index)}
        />
      </View>
    </Container>
  );
}
