import React, {Component} from 'react';
import {Container, Content} from 'native-base';
import {globalImagePath} from '../../../constants/globalImagePath';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {CommonStyles} from '../../../assets/css';
import AsyncStorage from '@react-native-community/async-storage';
import {height, width} from '../../../constants/screenSize';
import {fonts, colors} from '../../../Theme';
import NavBar from '../../../components/NavBar';
import {postService} from '../../../services/postServices';
import moment from 'moment';
import {showToast, showDangerToast} from '../../../components/ToastMessage';
import Loader from '../../../components/Loader';
import I18n from '../../../I18n';
import {useIsFocused} from '@react-navigation/native';
import Picker from 'react-native-picker';
import {getService} from '../../../services/getServices';

export default function RequestDetails({navigation, route}) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [getShow, setShow] = React.useState(false);
  const [profileLoad, setProfileLoad] = React.useState(false);
  const [type, setType] = React.useState('');
  const [bookingId, setBookingId] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const [salonBannerUrl, setSalonBannerUrl] = React.useState('');
  const [serviceUrl, setSalonServiceUrl] = React.useState('');
  const [bookingDetails, setBookingDetails] = React.useState('');
  const [ServiceList, setServiceList] = React.useState([]);
  const [serviceType, setServiceType] = React.useState('');
  const [bookingTime, setBookingTime] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [offername, setFofferName] = React.useState('');
  const [status, setstatus] = React.useState('');

  React.useEffect(() => {
    AsyncStorage.getItem('user', (err1, item1) => {
      var userDetail = JSON.parse(item1);
      setBookingId(route.params.bookingId);
      isFocused
        ? getBookingDetails(route.params.bookingId, userDetail._id)
        : null;
    });
  }, [isFocused]);

  //***** For getting BookingDetails Api*/
  const getBookingDetails = (id, salonID) => {
    const data = {
      booking_id: id,
    };
    console.log('data =>', data);
    setLoading(true);
    //***** api calling */
    postService('salon-appointment/booking-detail', data)
      .then((res) => {
        if (res.data.status === 1) {
          console.log(' booking details ==> ', res);
          setShow(true);
          setLoading(false);

          let data = res.data.response.booking;
          console.log('data.booking=>', data);
          var startTime = data.slot;
          var endTime = data.end_slot;
          setBookingTime(startTime + ' To ' + endTime);
          setServiceType(data.service_type);
          let serviceList = res.data.response.services;
          // console.log("serviceList =>", serviceList);
          setstatus(data.status);
          setBookingDetails(data);
          setRoomId(data?.room_id ? data?.room_id : '');
          setServiceList(serviceList);
          setAmount(data.total_price);
          setSalonBannerUrl(res.data.response.salonbanner);
          setSalonServiceUrl(res.data.response.salonservices);
          setFofferName(data && data.offer && data.offer.offer_code);
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

  const ConfirmAlert = (state) => {
    Alert.alert(
      `${I18n.t('lbl_cancel_alert')}`,
      '',
      [
        {
          text: `${I18n.t('lbl_cancel')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: `${I18n.t('lbl_ok')}`,
          onPress: () => cancelBooking(state),
        },
      ],
      {cancelable: false},
    );
  };

  const cancelBooking = (state) => {
    return;
    const data = {
      booking_id: bookingId,
      status: state,
    };

    setLoading(true);

    //***** api calling */
    postService('salon-appointment/update-booking', data)
      .then((res) => {
        setLoading(false);
        if (res.data.status === 1) {
          // console.log("salon-appointment/update-booking", res.data.response);
          showToast(res.data.message);
          if (type == 'accept' || type == 'reject') {
            navigation.navigate('Home');
          } else {
            navigation.navigate('UpcomingAppointment');
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

  const animationShow = async (key, val) => {
    let data = [...ServiceList];
    data[key].animate = val;
    setServiceList(await data);
  };

  const profileAnimationShow = async (val) => {
    setProfileLoad(val);
  };

  const serviceList = (item, index) => {
    return (
      <TouchableOpacity style={styles.renderOuterView} onPress={() => {}}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 12,
            paddingLeft: 12,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={
                  item.services && {uri: serviceUrl + item.services.image}
                }
                style={styles.serviceImage}
                resizeMode={'cover'}
                onLoadStart={() => animationShow(index, true)}
                onLoad={() => animationShow(index, false)}
              />
              {item.animate ? (
                <ActivityIndicator
                  style={{position: 'absolute', marginLeft: width * (15 / 375)}}
                  size="small"
                  color={'rgb(196,170,153)'}
                  animating={profileLoad}
                />
              ) : null}
            </View>
            <View style={{marginLeft: 10, marginTop: 2}}>
              <Text style={{marginTop: 2, fontSize: 14, fontWeight: 'bold'}}>
                {item.services && item.services.salon_service}
              </Text>
              <Text style={{marginTop: 2, fontSize: 14, marginTop: 4}}>
                {item.services && 'SAR ' + item.services.price}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: colors.themeColor,
                    marginTop: 2,
                    fontSize: 14,
                  }}>
                  {'Service Type : '}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 14,
                    fontFamily: fonts.type.NunitoSans_SemiBold,
                  }}>
                  {item.service_detail && item.service_detail.service_name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const dialCall = (number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const bookingCompleteAlert = () => {
    Alert.alert(
      I18n.t('lbl_alert_complete_booking'),
      '',
      [
        {
          text: I18n.t('lbl_cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: I18n.t('lbl_ok'),
          onPress: () => bookingComplete(),
        },
      ],
      {cancelable: false},
    );
  };

  const bookingComplete = () => {
    const data = {
      booking_id: route?.params?.bookingId,
      booking_completed: 1,
    };

    setLoading(true);
    //***** api calling */
    postService('employee/update-visit', data)
      .then((res) => {
        console.log(' update visit response ==> ', res);
        if (res.data.status === 1) {
          setLoading(false);
          showToast(res.data.message);
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
          return;
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
          showDangerToast('Something went wrong. Please ttry again later.');
          console.log(error);
        }, 100);
      });
  };

  return (
    <Container style={{flex: 1}}>
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        title={'New requested details'}
        isCenterImage={false}
        centerText={I18n.t('lbl_new_request_details')}
        navigation="HomePage"
        titleTop={''}
      />
      <Loader loading={loading} />
      {getShow ? (
        <ScrollView style={{flex: 1, marginHorizontal: width * (12 / 375)}}>
          {type == 'reject' ? (
            <TouchableOpacity style={styles.renderOuterView} onPress={() => {}}>
              <View style={styles.nestedView}>
                <View style={styles.coverView}>
                  <View style={styles.profileOuter}>
                    <Image
                      source={{uri: salonBannerUrl + bookingDetails.profile}}
                      style={styles.image}
                      resizeMode={'cover'}
                      onLoadStart={() => profileAnimationShow(true)}
                      onLoad={() => profileAnimationShow(false)}
                    />
                    {profileLoad ? (
                      <ActivityIndicator
                        style={{
                          position: 'absolute',
                          marginLeft: width * (50 / 375),
                        }}
                        size="small"
                        color={'rgb(196,170,153)'}
                        animating={profileLoad}
                      />
                    ) : null}
                  </View>
                  <View style={styles.detailsView}>
                    <View style={styles.coverView}>
                      <View style={{flex: 1}}>
                        <Text style={styles.id_view}>
                          {'#' + bookingDetails.booking_number}
                        </Text>
                      </View>
                      <View style={{marginRight: 15}}>
                        <Text style={styles.priceText}>
                          {'SAR ' + bookingDetails.total_price}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.userName}>
                      {bookingDetails.user_fullname}
                    </Text>
                    <Text style={styles.serviceName}>
                      {'Beauty salon - Hair Cut'}
                    </Text>
                    {bookingTime ? (
                      <Text
                        style={{
                          color: colors.themeColor,
                          fontSize: 12,
                          fontFamily: fonts.type.NunitoSans_Regular,
                          marginBottom: 5,
                        }}>
                        {'Booking Slot : ' + bookingTime}
                      </Text>
                    ) : null}
                    <Text
                      style={{
                        color: colors.themeColor,
                        fontSize: 12,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginBottom: 5,
                      }}>
                      {'Total Amount : SAR ' + amount}
                    </Text>

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
                    <View style={styles.date_outer}>
                      <View style={styles.date_view}>
                        <Text style={styles.dateText}>
                          {bookingDetails.start_date}
                        </Text>
                      </View>
                      <View style={styles.rejectedOuter}>
                        <View style={styles.rejectedView}>
                          <Text style={styles.rejectedText}>
                            {I18n.t('lbl_rejected_request')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.renderOuterView} onPress={() => {}}>
              <View style={styles.nestedView}>
                <View style={styles.coverView}>
                  <View style={styles.profileOuter}>
                    <Image
                      source={{uri: salonBannerUrl + bookingDetails.profile}}
                      style={styles.image}
                      resizeMode={'cover'}
                      onLoadStart={() => profileAnimationShow(true)}
                      onLoad={() => profileAnimationShow(false)}
                    />
                    {profileLoad ? (
                      <ActivityIndicator
                        style={{
                          position: 'absolute',
                          marginLeft: width * (50 / 375),
                        }}
                        size="small"
                        color={'rgb(196,170,153)'}
                        animating={profileLoad}
                      />
                    ) : null}
                  </View>
                  <View style={styles.detailsView}>
                    <View style={styles.coverView}>
                      <View style={{flex: 1}}>
                        <Text style={styles.id_view}>
                          {'#' + bookingDetails.booking_number}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.userName}>
                      {bookingDetails.user_fullname}
                    </Text>
                    <Text style={styles.serviceName}>
                      {'Beauty salon - Hair Cut'}
                    </Text>
                    {bookingTime ? (
                      <Text
                        style={{
                          color: colors.themeColor,
                          fontSize: 12,
                          fontFamily: fonts.type.NunitoSans_Regular,
                          marginBottom: 5,
                        }}>
                        {'Booking Slot : ' + bookingTime}
                      </Text>
                    ) : null}
                    <Text
                      style={{
                        color: colors.themeColor,
                        fontSize: 12,
                        fontFamily: fonts.type.NunitoSans_Regular,
                        marginBottom: 5,
                      }}>
                      {'Total Amount : SAR ' + amount}
                    </Text>

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

                    <View style={styles.date_outer}>
                      <View style={styles.date_view}>
                        <Text style={styles.dateText}>
                          {bookingDetails.start_date}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          marginRight: width * (10 / 375),
                        }}>
                        <View
                          style={{
                            borderRadius: 3,
                            backgroundColor:
                              bookingDetails.status == 0
                                ? 'rgb(198,235,252)'
                                : bookingDetails.status == 1 &&
                                  bookingDetails.payment_status == 0
                                ? 'rgb(255,243,229)'
                                : bookingDetails.status == 1 &&
                                  bookingDetails.payment_status == 1
                                ? 'rgb(253,245,213)'
                                : bookingDetails.status == 2
                                ? 'rgb(255,213,213)'
                                : bookingDetails.status == 3
                                ? 'rgb(240,255,213)'
                                : '#ffffff',
                            padding: 4,
                            borderRadius: width * (3 / 375),
                            paddingVertical: width * (5 / 375),
                            paddingHorizontal: width * (10 / 375),
                            borderWidth: 1,
                            borderColor:
                              bookingDetails.status == 0
                                ? 'rgb(40,134,175)'
                                : bookingDetails.status == 1 &&
                                  bookingDetails.payment_status == 0
                                ? 'rgb(252,195,136)'
                                : bookingDetails.status == 1 &&
                                  bookingDetails.payment_status == 1
                                ? 'rgb(242,217,112)'
                                : bookingDetails.status == 2
                                ? 'rgb(255,213,213)'
                                : bookingDetails.status == 3
                                ? 'rgb(240,255,213)'
                                : '#ffffff',
                          }}>
                          <Text
                            style={{
                              color:
                                bookingDetails.status == 0
                                  ? 'rgb(40,134,175)'
                                  : bookingDetails.status == 1 &&
                                    bookingDetails.payment_status == 0
                                  ? 'rgb(255,118,0)'
                                  : bookingDetails.status == 1 &&
                                    bookingDetails.payment_status == 1
                                  ? 'rgb(178,144,0)'
                                  : bookingDetails.status == 2
                                  ? 'rgb(255,0,0)'
                                  : bookingDetails.status == 3
                                  ? 'rgb(92,126,31)'
                                  : '#ffffff',
                              fontSize: 12,
                              textAlign: 'center',
                            }}>
                            {bookingDetails.status == 0
                              ? I18n.t('lbl_waiting_approval')
                              : bookingDetails.status == 1 &&
                                bookingDetails.payment_status == 0
                              ? I18n.t('lbl_tobe_paid')
                              : bookingDetails.status == 1 &&
                                bookingDetails.payment_status == 1
                              ? I18n.t('lbl_upcoming')
                              : bookingDetails.status == 2
                              ? I18n.t('lbl_reject')
                              : bookingDetails.status == 3
                              ? I18n.t('lbl_completed')
                              : ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.horizontalView} />
                <View style={{}}>
                  <Text style={styles.contectText}>
                    {I18n.t('lbl_contact_details')}
                  </Text>
                </View>
                {bookingDetails.uaddress && bookingDetails.uaddress.address ? (
                  <View style={styles.locationOuter}>
                    <View style={{marginTop: 2}}>
                      <Image
                        source={globalImagePath.locationIcon}
                        style={{}}
                        resizeMode={'cover'}
                      />
                    </View>
                    <View style={styles.addressView}>
                      <Text style={styles.address}>
                        {bookingDetails.uaddress &&
                          bookingDetails.uaddress.address}
                      </Text>
                    </View>
                  </View>
                ) : null}
                <View style={styles.contact_outer}>
                  <View style={{justifyContent: 'center'}}>
                    <Image source={globalImagePath.mob_icon}></Image>
                  </View>
                  <View
                    style={{marginLeft: 10, justifyContent: 'center', flex: 1}}>
                    <Text style={styles.address}>
                      {'+' +
                        bookingDetails.country_code +
                        '-' +
                        bookingDetails.phone}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      dialCall(
                        bookingDetails.country_code + bookingDetails.phone,
                      );
                    }}>
                    <Image source={globalImagePath.phone_Icon}></Image>
                  </TouchableOpacity>
                </View>

                <View style={styles.horizontalView} />
                <View style={styles.cancelOuter}>
                  <View style={styles.usdPriceText}>
                    <Text style={styles.priceText}>
                      {'SAR ' + bookingDetails.total_price}
                    </Text>
                  </View>

                  {bookingDetails?.status == 1 && (
                    <View style={{flexDirection: 'row', marginRight: 20}}>
                      {/* {status == 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          ConfirmAlert(2, 'cancel');
                        }}
                        style={styles.editOuter}>
                        <Text style={styles.btnText2}>
                          {I18n.t('lbl_cancel')}
                        </Text>
                      </TouchableOpacity>
                    ) : null} */}
                      {bookingDetails?.assign_details?.visit_status == 2 ? (
                        <>
                          {bookingDetails?.assign_details
                            ?.visit_completed_at ? (
                            <View
                              style={{
                                borderRadius: 3,
                                backgroundColor: 'rgb(240,255,213)',
                                padding: 4,
                                borderRadius: width * (3 / 375),
                                paddingVertical: width * (5 / 375),
                                paddingHorizontal: width * (10 / 375),
                                borderWidth: 1,
                                borderColor: 'rgb(240,255,213)',
                              }}>
                              <Text
                                style={{
                                  color: 'rgb(92,126,31)',
                                  fontSize: 12,
                                  textAlign: 'center',
                                }}>
                                {I18n.t('lbl_completed')}
                              </Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => bookingCompleteAlert()}
                              style={styles.editOuter}>
                              <Text style={styles.btnText2}>
                                {I18n.t('lbl_Complete_Booking')}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('TrackOrder', {
                              bookingID: bookingId,
                              roomID: roomId,
                              user_lat:
                                bookingDetails?.uaddress?.location
                                  ?.coordinates[1],
                              user_long:
                                bookingDetails?.uaddress?.location
                                  ?.coordinates[0],
                            });
                          }}
                          style={styles.editOuter}>
                          {bookingDetails?.assign_details?.visit_status == 1 ? (
                            <Text style={styles.btnText2}>
                              {I18n.t('lbl_go_to_map')}
                            </Text>
                          ) : (
                            <Text style={styles.btnText2}>
                              {I18n.t('lbl_start_visit')}
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          <View style={{flex: 1, marginBottom: 60}}>
            <View style={styles.serviceTitleView}>
              <Text style={styles.serviceText}>{I18n.t('lbl_srvice')}</Text>
            </View>
            <View style={{}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={ServiceList}
                renderItem={({item, index}) => serviceList(item, index)}
                keyExtractor={(item, index) => String(index)}
              />
            </View>
          </View>
        </ScrollView>
      ) : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  renderOuterView: {
    flexDirection: 'row',
    marginVertical: width * (10 / 375),
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
  nestedView: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: width * (10 / 375),
    paddingVertical: width * (10 / 375),
    paddingLeft: width * (12 / 375),
  },
  image: {
    // borderWidth: 5,
    height: width * (100 / 375),
    width: width * (110 / 375),
    borderRadius: 10,
  },
  serviceImage: {
    // borderWidth: 5,
    height: width * (43 / 375),
    width: width * (48 / 375),
    borderRadius: width * (6 / 375),
  },
  coverView: {
    flexDirection: 'row',
  },
  profileOuter: {
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0, 0.06)'
  },
  detailsView: {
    flex: 1,
    marginLeft: width * (10 / 375),
    marginTop: width * (15 / 375),
  },
  id_view: {
    color: 'rgb(150,136,125)',
    fontSize: width * (12 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
  },
  priceText: {
    color: '#000',
    fontSize: width * (16 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
  },
  userName: {
    fontSize: width * (14 / 375),
    fontWeight: 'bold',
  },
  serviceName: {
    marginTop: width * (5 / 375),
    color: colors.themeColor,
    fontSize: width * (10 / 375),
    fontFamily: fonts.type.NunitoSans_Regular,
  },
  date_outer: {
    flexDirection: 'row',
    marginTop: width * (18 / 375),
  },
  date_view: {
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    color: colors.themeColor,
    fontSize: width * (10 / 375),
    fontFamily: fonts.type.NunitoSans_Regular,
  },
  rejectedOuter: {
    flexDirection: 'row',
    marginRight: width * (10 / 375),
  },
  rejectedView: {
    borderRadius: width * (3 / 375),
    backgroundColor: 'rgb(255,213,213)',
    paddingVertical: width * (5 / 375),
    paddingHorizontal: width * (20 / 375),
    borderWidth: 1,
    borderColor: 'rgb(255,100,100)',
  },
  rejectedText: {
    color: 'rgb(255,100,100)',
    fontSize: width * (12 / 375),
  },
  acceptOuter: {
    flexDirection: 'row',
    marginRight: width * (10 / 375),
  },
  acceptView: {
    borderRadius: width * (3 / 375),
    backgroundColor: 'rgb(239,255,248)',
    paddingVertical: width * (5 / 375),
    paddingHorizontal: width * (20 / 375),
    borderWidth: 1,
    borderColor: 'rgb(11, 199, 117)',
  },
  acceptText: {
    color: 'rgb(11, 199, 117)',
    fontSize: width * (12 / 375),
  },
  btnText2: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (15 / 375),
    color: colors.whiteColor,
  },
  editOuter: {
    borderRadius: 5,
    backgroundColor: colors.themeColor,
    paddingHorizontal: width * (30 / 375),
    paddingVertical: width * (8 / 375),

    justifyContent: 'center',
  },
  horizontalView: {
    marginVertical: width * (20 / 375),
    height: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginRight: width * (20 / 375),
  },
  contectText: {
    fontSize: width * (18 / 375),
    fontWeight: 'bold',
  },
  locationOuter: {
    flexDirection: 'row',
    marginTop: width * (15 / 375),
  },
  addressView: {
    marginLeft: width * (10 / 375),
    marginRight: width * (20 / 375),
  },
  address: {
    fontSize: width * (12 / 375),
    color: colors.themeColor,
  },
  contact_outer: {
    flexDirection: 'row',
    marginTop: width * (15 / 375),
    marginRight: width * (20 / 375),
  },
  cancelOuter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeOuter: {
    // flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: width * (20 / 375),
    marginTop: width * (10 / 375),
  },
  usdPriceText: {
    marginRight: width * (10 / 375),
    flex: 1,
  },
  serviceTitleView: {
    marginLeft: width * (15 / 375),
    marginTop: width * (20 / 375),
  },
  serviceText: {
    fontSize: width * (18 / 375),
    fontWeight: 'bold',
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
  // editOuter: {
  //     borderRadius: 5,
  //     backgroundColor: colors.themeColor,
  //     paddingHorizontal: width * (30 / 375),
  //     paddingVertical: width * (8 / 375),
  //     justifyContent: 'center'
  // },
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
