//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Container, Content} from 'native-base';
import {height, width} from '../../../../constants/screenSize';
import NavBar from '../../../../components/NavBar';
import {globalImagePath} from '../../../../constants/globalImagePath';
import {fonts, colors} from '../../../../Theme';
import I18n from '../../../../I18n';
import Loader from '../../../../components/Loader';
import {useIsFocused} from '@react-navigation/native';
import {postService} from '../../../../services/postServices';
import {showToast, showDangerToast} from '../../../../components/ToastMessage';
import {USER_HOME_SALON_URL, SALON_SERVICE} from '../../../../utils/constants'; //src/utils/constants.js
import moment from 'moment';

// create a component
const BookingDetails = ({route, navigation}) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [isImageNotLoad, setIsImageNotLoad] = React.useState(false);
  const [bookingNo, setBookingNo] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [bookingPaymentStatus, setBookingPaymentStatus] = useState({});
  const [bookingDetails, setBookingDetails] = React.useState('');
  const [salonName, setSalonName] = useState('');
  const [salonImage, setSalonImage] = useState('');
  const [salonAddress, setSalonAddress] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [actualAmount, setActualAmount] = useState('');
  const [offername, setFofferName] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [cancelCharge, setCancelCharge] = useState('');
  const [salonCancelCharge, setSalonCancelCharge] = useState('');
  const [salonServices, setSalonServices] = useState([]);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');

  useEffect(() => {
    getBookingDetails();
  }, [isFocused]);

  const getBookingDetails = () => {
    setLoading(true);
    const postData = {
      booking_id: route.params.booking_id,
    };
    // ***** api calling */
    postService('home/booking/detail', postData)
      .then((res) => {
        if (res.status === 200) {
          let data = res.data.response;
          console.log('home/booking/detail =>', data);

          setBookingNo(data && data.booking && data.booking.booking_number);
          setBookingId(data && data.booking && data.booking._id);
          setBookingDetails(data?.booking ? data?.booking : {});
          setBookingDate(data && data.booking && data.booking.start_date);
          var startTime = data && data.booking && data.booking.slot;
          var endTime = data && data.booking && data.booking.end_slot;
          setBookingTime(startTime + ' To ' + endTime);
          setBookingStatus(data && data.booking && data.booking.status);
          setPaymentType(data && data.booking && data.booking.payment_type);
          setBookingPaymentStatus(
            data && data.booking && data.booking.payment_status,
          );
          setSalonName(data && data.booking && data.booking.salon_name);
          setSalonImage(data && data.booking && data.booking.banner_salon);
          setSalonAddress(data && data.booking && data.booking.address);
          setCancelCharge(
            data && data.booking && data.booking.cancellation_charge,
          );
          setServiceType(data && data.booking && data.booking.service_type);
          setSalonCancelCharge(
            data && data.booking && data.booking.salon_cancellation_charge,
          );
          setFofferName(
            data &&
              data.booking &&
              data.booking.offer &&
              data.booking.offer.offer_code,
          );
          setDiscountValue(
            data &&
              data.booking &&
              data.booking.offer &&
              data.booking.offer.discount_value,
          );
          data &&
            data.booking &&
            setLat(
              data.booking.location.coordinates
                ? data.booking.location.coordinates[1]
                : '',
            );
          data &&
            data.booking &&
            setLong(
              data.booking.location.coordinates
                ? data.booking.location.coordinates[0]
                : '',
            );
          data &&
            data.booking &&
            setTotalPrice(data && data.booking && data.booking.total_price);
          data &&
            data.booking &&
            setActualAmount(data && data.booking && data.booking.actual_amount);
          setSalonServices(data && data.services);
          setLoading(false);
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

  const _renderEmptyComponent = (type) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text
          style={{
            marginTop: 100,
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          Services not found..
        </Text>
      </View>
    );
  };

  const navigateToLocation = () => {
    if (lat != '' && long != '') {
      navigation.navigate('ViewLocation', {
        lat: lat,
        long: long,
        address: salonAddress,
      });
      //navigation.navigate("TrackOrder", { lat: lat, long: long, address: salonAddress});
    } else {
      showDangerToast('Location lat long is not defined.');
    }
  };

  const onRightTextPress = () => {
    //navigation.navigate('TrackOrder', {});
    navigation.navigate('TrackOrder', {
      bookingID: bookingId,
      roomID: bookingDetails?.room_id,
      employee_lat: bookingDetails?.employeeData?.location?.coordinates[1],
      employee_long: bookingDetails?.employeeData?.location?.coordinates[0],
      user_lat: bookingDetails?.uaddress?.location?.coordinates[1],
      user_long: bookingDetails?.uaddress?.location?.coordinates[0],
    });
  };

  //***** For booking accept and cancel Api*/
  const bookAcceptAndReject = () => {
    const data = {
      booking_id: bookingId,
      canceled_reason: 'Due to some emergeny',
      status: 4,
    };
    console.log('data =>', data);
    setLoading(true);

    // //***** api calling */
    postService('home/canceled', data)
      .then((res) => {
        setLoading(false);
        if (res.data.status === 1) {
          setLoading(false);
          console.log('salon-appointment/update-booking', res.data);
          if (res.data.status == 1) {
            showToast(res.data.message);
            getBookingDetails();
          } else {
            showDangerToast(res.data.message);
          }
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

  const rejectAlert = () => {
    Alert.alert(
      `${I18n.t('lbl_cancel_appintment')}`,
      '',
      [
        {
          text: `${I18n.t('lbl_cancel')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: `${I18n.t('lbl_ok')}`, onPress: () => bookAcceptAndReject()},
      ],
      {cancelable: false},
    );
  };

  const renderBookingDetails = () => {
    var typeService = '';
    if (serviceType == 1) {
      typeService = 'Home';
    } else if (serviceType == 2) {
      typeService = 'Salon';
    }
    return (
      <View style={styles.renderOuterView}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.35}}>
              <Image
                source={
                  salonImage
                    ? {uri: USER_HOME_SALON_URL + salonImage}
                    : globalImagePath.user_dummy
                }
                style={styles.image}
                resizeMode={'cover'}
                //onLoadStart={() => setIsImageNotLoad(true)}
                //onLoad={() => setIsImageNotLoad(false)}
              />
              {/* {isImageNotLoad ? (
                                <ActivityIndicator
                                    style={{ position: 'absolute', marginLeft: width * (30 / 375)}}
                                    size='small'
                                    color={'rgb(196,170,153)'}
                                    animating={isImageNotLoad}
                                />
                            ) : null} */}
            </View>
            <View style={{flex: 0.65}}>
              <Text
                style={{
                  color: 'rgb(150,136,125)',
                  fontSize: 12,
                  fontFamily: fonts.type.NunitoSans_bold,
                }}>
                {'#' + bookingNo}
              </Text>
              <Text style={{marginTop: 5, fontSize: 14, fontWeight: 'bold'}}>
                {salonName}
              </Text>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 12,
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {bookingDate}
              </Text>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 12,
                  fontFamily: fonts.type.NunitoSans_Regular,
                  marginBottom: 5,
                }}>
                {'Booking Slot : ' + bookingTime}
              </Text>
              <View
                style={{
                  width: '80%',
                  alignItems: 'center',
                  borderRadius: 3,
                  backgroundColor:
                    bookingStatus == 0
                      ? 'rgb(198,235,252)'
                      : bookingStatus == 1 && bookingPaymentStatus == 0
                      ? 'rgb(253,245,213)'
                      : bookingStatus == 1 && bookingPaymentStatus == 1
                      ? 'rgb(253,245,213)'
                      : bookingStatus == 2
                      ? 'rgb(255,213,213)'
                      : bookingStatus == 3
                      ? 'rgb(240,255,213)'
                      : bookingStatus == 4
                      ? 'rgb(255,213,213)'
                      : '#ffffff',
                  padding: 4,
                  // borderWidth: 1,
                  // borderColor: colors.lightThemeColor
                }}>
                <Text
                  style={{
                    color:
                      bookingStatus == 0
                        ? 'rgb(40,134,175)'
                        : bookingStatus == 1 && bookingPaymentStatus == 0
                        ? 'rgb(178,144,0)'
                        : bookingStatus == 1 && bookingPaymentStatus == 1
                        ? 'rgb(178,144,0)'
                        : bookingStatus == 2
                        ? 'rgb(255,0,0)'
                        : bookingStatus == 3
                        ? 'rgb(92,126,31)'
                        : bookingStatus == 4
                        ? 'rgb(255,0,0)'
                        : '#ffffff',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  {bookingStatus == 0
                    ? 'Waiting for approval'
                    : bookingStatus == 1 && bookingPaymentStatus == 0
                    ? 'To be paid'
                    : bookingStatus == 1 && bookingPaymentStatus == 1
                    ? 'Upcoming'
                    : bookingStatus == 2
                    ? 'Rejected'
                    : bookingStatus == 3
                    ? 'Completed'
                    : bookingStatus == 4
                    ? 'Cancelled'
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text
              style={{
                color: colors.themeColor,
                fontSize: 14,
                fontFamily: fonts.type.NunitoSans_Regular,
              }}>
              {'Payment method : '}
            </Text>
            <Text
              style={{
                color: 'rgb(150,136,125)',
                fontSize: 14,
                fontFamily: fonts.type.NunitoSans_SemiBold,
              }}>
              {paymentType == 1 ? I18n.t('lbl_online') : I18n.t('lbl_cash')}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.themeColor,
                fontSize: 14,
                fontFamily: fonts.type.NunitoSans_Regular,
              }}>
              {'Payment status : '}
            </Text>
            <Text
              style={{
                color: 'rgb(150,136,125)',
                fontSize: 14,
                fontFamily: fonts.type.NunitoSans_SemiBold,
              }}>
              {bookingPaymentStatus == 1 ? 'Complete' : 'Pending'}
            </Text>
          </View>
          {serviceType ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 14,
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {'Service Location : '}
              </Text>
              <Text
                style={{
                  color: 'rgb(150,136,125)',
                  fontSize: 14,
                  fontFamily: fonts.type.NunitoSans_SemiBold,
                }}>
                {serviceType == 1 ? 'Home' : 'Salon'}
              </Text>
            </View>
          ) : null}
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.themeColor,
                fontSize: 14,
                fontFamily: fonts.type.NunitoSans_Regular,
              }}>
              {'Cancellation Charge : '}
            </Text>
            <Text
              style={{
                color: 'rgb(150,136,125)',
                fontSize: 14,
                fontFamily: fonts.type.NunitoSans_SemiBold,
              }}>
              {salonCancelCharge > 0 ? salonCancelCharge + '%' : 'N/A'}
            </Text>
          </View>
          {offername ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 14,
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {'Coupon Applied : '}
              </Text>
              <Text
                style={{
                  color: 'rgb(150,136,125)',
                  fontSize: 14,
                  fontFamily: fonts.type.NunitoSans_SemiBold,
                }}>
                {offername}
              </Text>
            </View>
          ) : null}
          {discountValue ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 14,
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {'Discount : '}
              </Text>
              <Text
                style={{
                  color: 'rgb(150,136,125)',
                  fontSize: 14,
                  fontFamily: fonts.type.NunitoSans_SemiBold,
                }}>
                {'SAR ' + discountValue}
              </Text>
            </View>
          ) : null}

          <View style={{flexDirection: 'row', marginTop: 15}}>
            <View style={{flex: 0.05}}>
              <Image
                source={globalImagePath.locationIcon}
                style={{marginTop: 4}}
                resizeMode={'cover'}
              />
            </View>
            <View style={{flex: 0.95}}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 13,
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {salonAddress ? salonAddress : '----'}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                borderBottomColor: '#000',
                borderBottomWidth: 1,
                marginLeft: 10,
              }}
              onPress={() => navigateToLocation()}>
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: fonts.type.NunitoSans_Regular,
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {I18n.t('lbl_view_location')}
              </Text>
            </TouchableOpacity>
            {bookingStatus != 4 && bookingStatus != 2 && bookingStatus != 3 ? (
              <TouchableOpacity
                style={{
                  borderBottomColor: '#000',
                  borderBottomWidth: 1,
                  marginLeft: 10,
                }}
                onPress={() => {
                  rejectAlert();
                }}>
                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: fonts.type.NunitoSans_Regular,
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                  {'Cancel Booking'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const animationShow = async (key, val) => {
    let data = [...salonServices];
    data[key].animate = val;
    setSalonServices(await data);
  };

  const renderServices = (item, index) => {
    return (
      <View style={styles.renderOuterView}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.2}}>
              <Image
                source={
                  item.services.image
                    ? {uri: SALON_SERVICE + item.services.image}
                    : globalImagePath.user_dummy
                }
                style={styles.small_image}
                resizeMode={'cover'}
                onLoadStart={() => animationShow(index, true)}
                onLoad={() => animationShow(index, false)}
              />
              {item.animate ? (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    marginLeft: width * (10 / 375),
                    marginTop: 10,
                  }}
                  size="small"
                  color={'rgb(196,170,153)'}
                  animating={item.animate}
                />
              ) : null}
            </View>
            <View style={{flex: 0.65}}>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {item.services.salon_service}
              </Text>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 14,
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {'SAR ' + item.unit_price_service}
              </Text>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 14,
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {'Service Type : '}
                {item.service_detail && item.service_detail.service_name}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const HeaderComponent = () => {
    return (
      <>
        {renderBookingDetails()}
        {bookingDetails?.assign_details?.assign_date ? (
          <>
            <View style={styles.serviceTitleView}>
              <Text
                style={{
                  marginVertical: 15,
                  fontSize: 18,
                  fontWeight: 'bold',
                  fontFamily: fonts.type.NunitoSans_Regular,
                }}>
                {I18n.t('lbl_employee_track_details')}
              </Text>
            </View>
            <View style={styles.renderOuterView}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  paddingVertical: 12,
                  paddingLeft: 12,
                }}>
                {bookingDetails?.employeeData?.name && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        width: '46%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                      }}>
                      {I18n.t('lbl_employee_name')}
                    </Text>
                    <Text
                      style={{
                        width: '2%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginTop: Platform.OS === 'android' ? -20 : 0,
                      }}>
                      {' : '}
                    </Text>
                    <Text
                      style={{
                        width: '46%',
                        color: 'rgb(150,136,125)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                      }}>
                      {bookingDetails?.employeeData?.name}
                    </Text>
                  </View>
                )}
                {bookingDetails?.employeeData?.employee_code && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        width: '46%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                      }}>
                      {I18n.t('lbl_employee_codee')}
                    </Text>
                    <Text
                      style={{
                        width: '2%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginTop: Platform.OS === 'android' ? -20 : 0,
                      }}>
                      {' : '}
                    </Text>
                    <Text
                      style={{
                        width: '46%',
                        color: 'rgb(150,136,125)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                      }}>
                      {bookingDetails?.employeeData?.employee_code}
                    </Text>
                  </View>
                )}
                {bookingDetails?.employeeData?.phoneno && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        width: '46%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                      }}>
                      {I18n.t('lbl_employee_phoneno')}
                    </Text>
                    <Text
                      style={{
                        width: '2%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginTop: Platform.OS === 'android' ? -20 : 0,
                      }}>
                      {' : '}
                    </Text>
                    <Text
                      style={{
                        width: '46%',
                        color: 'rgb(150,136,125)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                      }}>
                      {bookingDetails?.employeeData?.country_code}
                      {bookingDetails?.employeeData?.phoneno}
                    </Text>
                  </View>
                )}
                {bookingDetails?.assign_details?.assign_date && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        width: '46%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                      }}>
                      {I18n.t('lbl_employee_assign_date')}
                    </Text>
                    <Text
                      style={{
                        width: '2%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginTop: Platform.OS === 'android' ? -20 : 0,
                      }}>
                      {' : '}
                    </Text>
                    <Text
                      style={{
                        width: '46%',
                        color: 'rgb(150,136,125)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                      }}>
                      {moment(
                        bookingDetails?.assign_details?.assign_date,
                      ).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </View>
                )}
                {bookingDetails?.assign_details?.visit_started_at && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        width: '46%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                      }}>
                      {I18n.t('lbl_employee_visit_start')}
                    </Text>
                    <Text
                      style={{
                        width: '2%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginTop: Platform.OS === 'android' ? -20 : 0,
                      }}>
                      {' : '}
                    </Text>
                    <Text
                      style={{
                        width: '46%',
                        color: 'rgb(150,136,125)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                      }}>
                      {moment(
                        bookingDetails?.assign_details?.visit_started_at,
                      ).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </View>
                )}
                {bookingDetails?.assign_details?.visit_completed_at && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        width: '46%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                      }}>
                      {I18n.t('lbl_employee_visit_complete')}
                    </Text>
                    <Text
                      style={{
                        width: '2%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginTop: Platform.OS === 'android' ? -20 : 0,
                      }}>
                      {' : '}
                    </Text>
                    <Text
                      style={{
                        width: '46%',
                        color: 'rgb(150,136,125)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                      }}>
                      {moment(
                        bookingDetails?.assign_details?.visit_completed_at,
                      ).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </View>
                )}
                {bookingDetails?.time_taken && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        width: '46%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                      }}>
                      {I18n.t('lbl_employee_visit_total_time')}
                    </Text>
                    <Text
                      style={{
                        width: '2%',
                        color: colors.themeColor,
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginTop: Platform.OS === 'android' ? -20 : 0,
                      }}>
                      {' : '}
                    </Text>
                    <Text
                      style={{
                        width: '46%',
                        color: 'rgb(150,136,125)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                      }}>
                      {bookingDetails?.time_taken
                        ? Math.ceil(bookingDetails?.time_taken)
                        : 0}{' '}
                      {I18n.t('lbl_minute')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        ) : null}
        <Text
          style={{
            marginVertical: 15,
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {I18n.t('lbl_srvice')}
        </Text>
      </>
    );
  };

  return (
    <Container style={{flex: 1}}>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={colors.white}
        titleTop={''}
        navigation="HomePage"
        centerText={I18n.t('lbl_booking_detail')}
        isRightText={
          bookingDetails?.assign_details?.visit_status == 1 ? true : false
        }
        rightText={I18n.t('lbl_track_location')}
        rightNavigateScreen="TrackOrder"
        onRightTextPress={() => onRightTextPress()}
      />
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={salonServices}
          renderItem={({item, index}) => renderServices(item, index)}
          keyExtractor={(item, index) => String(index)}
          ListHeaderComponent={() => HeaderComponent()}
          ListEmptyComponent={() => _renderEmptyComponent()}
        />
      </View>
      {totalPrice ? (
        <View style={styles.amountView}>
          {offername ? (
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: fonts.type.NunitoSans_Regular,
              }}>
              {' '}
              {I18n.t('lbl_total_amount') + `${actualAmount}`}
            </Text>
          ) : null}
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              fontFamily: fonts.type.NunitoSans_Regular,
            }}>
            {' '}
            {!offername
              ? I18n.t('lbl_total_amount') + `${totalPrice}`
              : 'After Applied Coupon : ' + 'SAR ' + `${totalPrice}`}
          </Text>
        </View>
      ) : null}
    </Container>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  renderOuterView: {
    //flexDirection: 'row',
    marginBottom: width * (10 / 375),
    paddingBottom: 2,
    paddingRight: 2,
    paddingTop: 2,
    paddingLeft: 2,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
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
  amountView: {
    padding: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    // borderWidth: 5,
    height: width * (79 / 375),
    width: width * (90 / 375),
    borderRadius: 10,
  },
  small_image: {
    marginTop: 5,
    height: width * (50 / 375),
    width: width * (50 / 375),
    borderRadius: 10,
  },
});

//make this component available to the app
export default BookingDetails;
