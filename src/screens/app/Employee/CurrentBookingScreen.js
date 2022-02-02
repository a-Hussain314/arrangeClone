import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {height, width} from '../../../constants/screenSize';
import {fonts, colors} from '../../../Theme';
import {globalImagePath} from '../../../constants/globalImagePath';
import font from '../../../Theme/font';
import NavBar from '../../../components/NavBar';
import I18n from '../../../I18n';
import {postService} from '../../../services/postServices';
import Loader from '../../../components/Loader';
import moment from 'moment';
import {showToast, showDangerToast} from '../../../components//ToastMessage';
import {useIsFocused} from '@react-navigation/native';
import {check, PERMISSIONS, openSettings} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

var pageNo = 1;
export default function CurrentBookingScreen({navigation, currentTabNum}) {
  let onEndReachedCalledDuringMomentum = true;
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [currentBooking, setCurrentBooking] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showLoadMore, setShowLoadMore] = React.useState(false);

  React.useEffect(() => {
    if (isFocused) {
      pageNo = 1;
      setLoading(true);
      checkLocationPermission();
      getCurrentBooking();
    }
  }, [currentTabNum, isFocused]);

  //***** For getting New Request Api*/
  const getCurrentBooking = () => {
    const data = {
      status: 1,
      page: pageNo,
    };
    console.log('employee/get-bookings data =======', data);
    //***** api calling */
    postService('employee/get-bookings', data)
      .then((res) => {
        setLoading(false);
        console.log('employee/get-bookings', res);
        if (res.data.status === 1) {
          console.log('employee/get-bookings res == ', res.data.response);
          setLoading(false);
          setRefreshing(false);
          setShowLoadMore(false);

          let data = res.data.response;
          if (data != '') {
            if (!res.data.response) {
              showToast(res.data.message);
            }
            if (pageNo == 1) {
              setCurrentBooking([...data]);
            } else {
              data && data
                ? setCurrentBooking([...currentBooking, ...data])
                : setCurrentBooking([...currentBooking]);
            }
          }
        } else {
          setLoading(false);
          setRefreshing(false);
          setShowLoadMore(false);
          setTimeout(function () {
            //showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        setShowLoadMore(false);
        setTimeout(function () {
          showDangerToast(error);
        }, 100);
      });
  };

  const checkLocationPermission = () => {
    if (Platform.OS == 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
        if (
          result == 'blocked' ||
          result == 'denied' ||
          result == 'unavailable'
        ) {
          Alert.alert(
            '',
            I18n.t('lbl_permission_msg'),
            [
              {
                text: I18n.t('lbl_notNow'),
                onPress: () => console.log('Cancel Pressed!'),
              },
              {
                text: I18n.t('lbl_open_setting'),
                onPress: () => openSettings(),
              },
            ],
            {cancelable: false},
          );
        } else {
          console.log('enter in else part to get current location');
          getCurrentLocation();
        }
      });
    } else if (Platform.OS == 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
        if (result == 'blocked' || result == 'denied') {
          Alert.alert(
            '',
            I18n.t('lbl_permission_msg'),
            [
              {
                text: I18n.t('lbl_notNow'),
                onPress: () => console.log('Cancel Pressed!'),
              },
              {
                text: I18n.t('lbl_open_setting'),
                onPress: () => openSettings(),
              },
            ],
            {cancelable: false},
          );
        } else {
          getCurrentLocation();
        }
      });
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        let data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        updateLocation(data);
      },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  //***** For update employee current location */
  const updateLocation = (data) => {
    console.log('update-location data =======', data);
    //***** api calling */
    postService('employee/update-location', data)
      .then((res) => {
        setLoading(false);
        console.log('update-location res ==> ', res);
        if (res.data.status === 1) {
          setLoading(false);
          setRefreshing(false);
          setShowLoadMore(false);
        } else {
          setLoading(false);
          setRefreshing(false);
          setShowLoadMore(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        setShowLoadMore(false);
        console.log('error ==> ', error.message);
      });
  };

  const animationShow = async (key, val) => {
    let data = [...currentBooking];
    data[key].animate = val;
    setCurrentBooking(await data);
  };

  // Render recommand salon
  const renderCurrentBooking = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.renderOuterView}
        onPress={() => {
          navigation.navigate('RequestDetails', {
            bookingId: item._id,
          });
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 12,
            paddingLeft: 12,
          }}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={
                  item.user_id &&
                  item.userData &&
                  item.userData.full_profile_path
                    ? {uri: item.userData.full_profile_path}
                    : globalImagePath.user_dummy
                }
                style={styles.image}
                resizeMode={'cover'}
                onLoadStart={() => animationShow(index, true)}
                onLoad={() => animationShow(index, false)}
              />
              {item.animate ? (
                <ActivityIndicator
                  style={{position: 'absolute', marginLeft: width * (15 / 375)}}
                  size="small"
                  color={'rgb(196,170,153)'}
                  animating={item.animate}
                />
              ) : null}
            </View>
            <View style={{flex: 1, marginLeft: 20}}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      flex: 1,
                      color: 'rgb(150,136,125)',
                      fontSize: 12,
                      fontFamily: fonts.type.NunitoSans_bold,
                    }}>
                    {'#' + item.booking_number}
                  </Text>
                  <Text
                    style={{
                      marginRight: 20,
                      color: 'rgb(150,136,125)',
                      fontSize: 12,
                      fontFamily: fonts.type.NunitoSans_bold,
                    }}>
                    {item.start_date
                      ? moment(item.start_date).format('YYYY-MM-DD')
                      : ''}
                  </Text>
                </View>
                <View style={{marginRight: 20}}>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 16,
                      fontFamily: font.type.NunitoSans_bold,
                    }}>
                    {item.user_id && item.userData.first_name
                      ? item.userData.first_name + ' ' + item.userData.last_name
                      : ''}
                  </Text>
                  <Text
                    style={{
                      marginTop: 7,
                      color: colors.themeColor,
                      fontSize: 14,
                      fontFamily: fonts.type.NunitoSans_Regular,
                    }}>
                    {'SAR ' + item.total_price}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const _renderFooter = () => {
    if (!refreshing) return null;
    if (!showLoadMore) return null;

    return (
      <View
        style={{
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            padding: 10,
            borderRadius: 4,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              fontFamily: fonts.type.NunitoSans_Regular,
              textAlign: 'center',
            }}>
            {I18n.t('lbl_load_more')}
          </Text>
          {true ? (
            <ActivityIndicator color="rgb(74,74,74)" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const _renderEmptyComponent = (type) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text
          style={{
            alignItems: 'center',
            marginTop: 100,
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {I18n.t('lbl_current_booking_not_found')}
        </Text>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    pageNo = 1;
    getCurrentBooking();
  };

  const onReached = () => {
    setRefreshing(true);
    setShowLoadMore(true);
    pageNo = parseInt(pageNo) + 1;
    getCurrentBooking();
  };

  if (loading) {
    return (
      <View>
        <Loader loading={loading} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Loader loading={loading} />
      <View
        style={{
          flex: 1,
          marginHorizontal: width * (20 / 375),
          marginTop: width * (10 / 375),
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={currentBooking}
          renderItem={({item, index}) => renderCurrentBooking(item, index)}
          keyExtractor={(item, index) => String(index)}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
          onEndReached={({distanceFromEnd}) => {
            if (!onEndReachedCalledDuringMomentum) {
              onReached();
              onEndReachedCalledDuringMomentum = true;
            }
          }}
          onEndReachedThreshold={0.005}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          ListFooterComponent={() => _renderFooter()}
          ListEmptyComponent={() => _renderEmptyComponent()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  renderOuterView: {
    flexDirection: 'row',

    marginBottom: width * (10 / 375),
    padding: 2,
    borderRadius: 15,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    //  marginRight: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  image: {
    // borderWidth: 5,
    height: width * (55 / 375),
    width: width * (55 / 375),
    borderRadius: 10,
  },
  addimage: {
    // borderWidth: 5,
    height: width * (11 / 375),
    width: width * (11 / 375),
    borderRadius: 10,
  },

  btnText: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (12 / 375),
    color: colors.themeColor,
  },
  btnText2: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (12 / 375),
    color: colors.whiteColor,
  },
  editOuter: {
    borderRadius: 5,
    backgroundColor: colors.themeColor,
    paddingHorizontal: width * (30 / 375),
    paddingVertical: width * (8 / 375),
    justifyContent: 'center',
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: colors.themeColor,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: colors.whiteColor,
    paddingHorizontal: width * (30 / 375),
    paddingVertical: width * (8 / 375),
    justifyContent: 'center',
  },
});
