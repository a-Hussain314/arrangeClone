import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Container, Content} from 'native-base';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {height, width} from '../../../../../constants/screenSize';
import {colors, fonts} from '../../../../../Theme';
import {globalImagePath} from '../../../../../constants/globalImagePath';
import {postService} from '../../../../../services/postServices';
import font from '../../../../../Theme/font';
import I18n from '../../../../../I18n';
import Loader from '../../../../../components/Loader';
import {Tab, Tabs, TabHeading} from 'native-base';
import {CommonStyles} from '../../../../../assets/css';
import {getService} from '../../../../../services/getServices';
import moment from 'moment';

var pageNo = 1;
export default function Upcoming({navigation, currentTabNum}) {
  let onEndReachedCalledDuringMomentum = true;
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState('');
  const [name, setName] = React.useState('');
  const [getProfileUrl, setProfileUrl] = React.useState([]);
  const [upcomingSalon, setUpcomingRequest] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showLoadMore, setShowLoadMore] = React.useState(false);

  React.useEffect(() => {
    pageNo = 1;
    setLoading(true);
    getUpcomingRequest();
    getUserProfileDetails();
  }, [currentTabNum]);

  //***** For getting user's profile information */
  const getUserProfileDetails = (user_id) => {
    //***** api calling */
    getService('profile/detail')
      .then((res) => {
        if (res.data.status === 1) {
          let data = res.data.response;
          setName(data.salon_name);
          setImage(data.salon_banner_url + data.banner_salon);
        } else {
          var message = '';
          res?.data?.errors?.map((val) => {
            message += Object.values(val) + ' ';
          });
          setTimeout(function () {
            showDangerToast(message != null ? message : res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };

  //***** For get Upcoming request*/
  const getUpcomingRequest = () => {
    const data = {
      type: 'accepted',
      page: pageNo,
    };
    //***** api calling */
    postService('salon-appointment', data)
      .then((res) => {
        if (res.data.response) {
          console.log('res.data =>', res.data.response);
          let data = res.data.response.list;
          setUpcomingRequest(data);
          setProfileUrl(res.data.response.profileUrl);
          setRefreshing(false);
          setShowLoadMore(false);
          setLoading(false);
        } else {
          setRefreshing(false);
          setShowLoadMore(false);
          setLoading(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setRefreshing(false);
        setShowLoadMore(false);
        setLoading(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };

  // Render upcoming requested salon
  const render_upcomingSalon = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.renderOuterView}
        onPress={() => {
          // navigation.navigate('RequestedDetails', {
          //     requestType: 'upcoming',
          //     bookingId: item._id
          // })

          navigation.navigate('RequestedDetails', {
            requestType: 'upcoming',
            bookingId: item._id,
            employeeID: item.employee_id ? item.employee_id : '',
            employeeName:
              item.employee_details && item.employee_details.name
                ? item.employee_details.name
                : '',
          });
        }}>
        <View
          style={{
            paddingVertical: 12,
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingLeft: 12,
          }}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={
                  item.user_id && {uri: getProfileUrl + item.user_id.profile}
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
            <View style={{flex: 1, marginLeft: 10}}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      flex: 1,
                      color: 'rgb(150,136,125)',
                      fontSize: 12,
                      fontFamily: fonts.type.NunitoSans_bold,
                    }}>
                    {item.booking_number}
                  </Text>
                  <Text
                    style={{
                      marginRight: 20,
                      color: 'rgb(150,136,125)',
                      fontSize: 12,
                      fontFamily: fonts.type.NunitoSans_bold,
                    }}>
                    {moment(item.start_date).format('MM/DD/YYYY')}
                  </Text>
                </View>
                <Text
                  style={{
                    marginRight: 20,
                    marginTop: 2,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {item.user_id && item.user_id.first_name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginRight: width * (10 / 375),
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      marginTop: 5,
                      color: colors.themeColor,
                      fontSize: 10,
                      fontFamily: fonts.type.NunitoSans_Regular,
                    }}>
                    {'Beauty salon - Hair Cut'}
                  </Text>
                  <View
                    style={{
                      borderRadius: 3,
                      backgroundColor:
                        item.status == 0
                          ? 'rgb(198,235,252)'
                          : item.status == 1 && item.payment_status == 0
                          ? 'rgb(255,243,229)'
                          : item.status == 1 && item.payment_status == 1
                          ? 'rgb(253,245,213)'
                          : item.status == 2
                          ? 'rgb(255,213,213)'
                          : item.status == 3
                          ? 'rgb(240,255,213)'
                          : '#ffffff',
                      padding: 4,
                      borderRadius: width * (3 / 375),
                      paddingVertical: width * (5 / 375),
                      paddingHorizontal: width * (20 / 375),
                      borderWidth: 1,
                      borderColor:
                        item.status == 0
                          ? 'rgb(40,134,175)'
                          : item.status == 1 && item.payment_status == 0
                          ? 'rgb(252,195,136)'
                          : item.status == 1 && item.payment_status == 1
                          ? 'rgb(242,217,112)'
                          : item.status == 2
                          ? 'rgb(255,213,213)'
                          : item.status == 3
                          ? 'rgb(240,255,213)'
                          : '#ffffff',
                    }}>
                    <Text
                      style={{
                        color:
                          item.status == 0
                            ? 'rgb(40,134,175)'
                            : item.status == 1 && item.payment_status == 0
                            ? 'rgb(255,118,0)'
                            : item.status == 1 && item.payment_status == 1
                            ? 'rgb(178,144,0)'
                            : item.status == 2
                            ? 'rgb(255,0,0)'
                            : item.status == 3
                            ? 'rgb(92,126,31)'
                            : '#ffffff',
                        fontSize: 12,
                        textAlign: 'center',
                      }}>
                      {item.status == 0
                        ? I18n.t('lbl_waiting_approval')
                        : item.status == 1 && item.payment_status == 0
                        ? I18n.t('lbl_tobe_paid')
                        : item.status == 1 && item.payment_status == 1
                        ? 'Paid'
                        : item.status == 2
                        ? I18n.t('lbl_reject')
                        : item.status == 3
                        ? I18n.t('lbl_completed')
                        : ''}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View>
            <View
              style={{
                height: 0.5,
                backgroundColor: 'rgba(0,0,0, 0.2)',
                marginVertical: 15,
                marginRight: 20,
              }}
            />
            <View style={{flexDirection: 'row'}}>
              <View
                style={{flex: 1, justifyContent: 'center', marginRight: 20}}>
                <Text
                  style={{fontSize: 16, fontFamily: font.type.NunitoSans_bold}}>
                  {'SAR ' + item.total_price}
                </Text>
              </View>

              <TouchableOpacity onPress={() => {}} style={styles.editOuter}>
                <Text style={styles.btnText2}>{I18n.t('lbl_cancel')}</Text>
              </TouchableOpacity>
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
            marginTop: 100,
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {I18n.t('lbl_upcoming_request_not_found')}
        </Text>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    pageNo = 1;
    getUpcomingRequest();
  };

  const onReached = () => {
    setRefreshing(true);
    setShowLoadMore(true);
    pageNo = 1;
    getUpcomingRequest();
  };

  const animationShow = async (key, val) => {
    let data = [...upcomingSalon];
    data[key].animate = val;
    setUpcomingRequest(await data);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Loader loading={loading} />
      <View
        style={{flex: 1, marginHorizontal: width * (20 / 375), marginTop: 10}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={upcomingSalon}
          renderItem={({item, index}) => render_upcomingSalon(item, index)}
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
    //  marginTop: width * (10 / 375),
    marginBottom: 10,
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
  image: {
    // borderWidth: 5,
    height: width * (55 / 375),
    width: width * (55 / 375),
    borderRadius: 10,
  },

  btnText: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (12 / 375),
    color: colors.themeColor,
  },
  btnText2: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (16 / 375),
    color: colors.whiteColor,
  },
  editOuter: {
    borderRadius: 5,
    backgroundColor: colors.themeColor,
    paddingHorizontal: 30,
    paddingVertical: 8,
    marginRight: 20,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: colors.themeColor,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
});
