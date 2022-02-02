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
} from 'react-native';
import {Container, Content} from 'native-base';
import {fonts, colors} from '../../../../Theme';
import {globalImagePath} from '../../../../constants/globalImagePath';
import {CommonStyles} from '../../../../assets/css';
import {normalize} from '../../../../components/Dimensions';
import Loader from '../../../../components/Loader';
import {AuthContext} from '../../../../contexts/AuthContext';
import I18n from '../../../../I18n';
import AsyncStorage from '@react-native-community/async-storage';
import {getService} from '../../../../services/getServices';
import {CUSTOMERIMAGEURL} from '../../../../utils/constants';
import {useIsFocused} from '@react-navigation/native';
import Rate, {AndroidMarket} from 'react-native-rate';

export default function UserProfile({navigation, props}) {
  const {
    auth: {logout},
  } = React.useContext(AuthContext);
  const [userID, setUserID] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const isFocused = useIsFocused();
  const [rated, setRated] = React.useState(false);
  const [menuList, setMenuList] = React.useState([
    {
      title: I18n.t('lbl_account'),
      img: globalImagePath.dummyUserIcon,
      navigatepath: 'EditProfile',
    },
    {
      title: I18n.t('lbl_change_password'),
      img: globalImagePath.changePass,
      navigatepath: 'ChangePassword',
    },
    {
      title: I18n.t('lbl_manage_address'),
      img: globalImagePath.address,
      navigatepath: 'ManageAddress',
    },
    {
      title: I18n.t('lbl_save_card'),
      img: globalImagePath.card,
      navigatepath: 'SaveCard',
    },
    {
      title: I18n.t('lbl_change_langauage'),
      img: globalImagePath.languageIcon,
      navigatepath: 'SelectLanguage',
    },
    {
      title: I18n.t('lbl_wallet'),
      img: globalImagePath.Wallet,
      navigatepath: 'Wallet',
    },
    {
      title: I18n.t('lbl_view_bookings'),
      img: globalImagePath.bookings,
      navigatepath: 'Bookings',
    },
    {
      title: I18n.t('lbl_rate_on_store'),
      img: globalImagePath.ratting,
      navigatepath: 'RateApp',
    },
    {
      title: I18n.t('lbl_favorite_salon'),
      img: globalImagePath.ratting,
      navigatepath: 'FavoriteList',
    },
    {
      title: I18n.t('lbl_my_offer'),
      img: globalImagePath.ratting,
      navigatepath: 'OfferList',
    },
    {
      title: I18n.t('lbl_support'),
      img: globalImagePath.support,
      navigatepath: 'Support',
    },
    {
      title: I18n.t('lbl_about_us'),
      img: globalImagePath.support,
      navigatepath: 'AboutUs',
    },
    {
      title: I18n.t('lbl_privacy_policy'),
      img: globalImagePath.support,
      navigatepath: 'PrivacyPolicy',
    },
    // {
    //   title: I18n.t('lbl_refund_cancel'),
    //   img: globalImagePath.support,
    //   navigatepath: 'RefundAndCancellationPolicy',
    // },
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
      getUserProfileDetails();
    });
  }, [props, isFocused]);

  //***** For getting user's profile information */
  const getUserProfileDetails = () => {
    //***** api calling */
    getService('profile/detail')
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);
          let data = res.data.response;
          setName(data.first_name);
          setEmail(data.email);
          setImage(data.profile);
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

  const RateApp = () => {
    const options = {
      AppleAppID: '1490997702',
      GooglePackageName: 'com.gigglemusic',
      AmazonPackageName: 'com.mywebsite.myapp',
      OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: 'http://www.mywebsite.com/myapp.html',
    };
    Rate.rate(options, (success) => {
      if (success) {
        setRated(true);
      } else {
        setRated(false);
      }
    });
  };

  const _menuList = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          item.navigatepath == 'RateApp'
            ? RateApp()
            : item.navigatepath
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
            style={{width: normalize(38), height: normalize(38)}}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              color: '#000',
              fontSize: normalize(14),
              fontFamily: fonts.type.NunitoSans_bold,
              left: 20,
            }}>
            {item.title}
          </Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          <Image
            source={globalImagePath.navigateSign}
            style={{width: normalize(8), height: normalize(14)}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  // const onSignOut = async props => {
  //   global.root = false;
  //   logout();
  // };

  //***** For logout user's profile information */
  const onSignOut = () => {
    setLoading(true);
    //***** api calling */
    getService('profile/logout')
      .then((res) => {
        setLoading(false);
        console.log('profile/logout res.data =>', res.data);
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
        <AuthContext.Consumer>
          {(context) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Notification');
              }}
              style={{alignItems: 'flex-end', right: 20, top: 20}}>
              <Image
                source={globalImagePath.notification}
                style={{width: normalize(20), height: normalize(22)}}
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
                      {global.notifyCount == 0 ? 0 : context.notificationCount}
                    </Text>
                  </View>
                ) : null
              ) : null}
            </TouchableOpacity>
          )}
        </AuthContext.Consumer>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Image
            source={globalImagePath.dummyProvider}
            style={{ width: normalize(108), height: normalize(108) }}
          /> */}
          <Image
            //   source={image ? { uri: image } : globalImagePath.user_dummy}
            source={image && {uri: CUSTOMERIMAGEURL + image}}
            style={{
              width: normalize(108),
              height: normalize(108),
              borderRadius: normalize(50 / 2),
            }}
          />
          <Text
            style={{...CommonStyles.whiteSemiBoldTextStyle(16), marginTop: 10}}>
            {name}
          </Text>
          <Text style={{...CommonStyles.whiteRegularTextStyle(14)}}>
            {email}
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
