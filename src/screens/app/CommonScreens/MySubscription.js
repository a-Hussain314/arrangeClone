//***** import libraries */
import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageBackground,
  Modal,
  NativeModules,
  I18nManager,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import {Container, Content} from 'native-base';
import {getService} from '../../../services/getServices';
import {postService} from '../../../services/postServices';
import I18n from '../../../I18n';
import {showToast, showDangerToast} from '../../../components//ToastMessage';
import validate from '../../../components/Validations/validate_wrapper';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {globalImagePath} from '../../../constants/globalImagePath';
import NavBar from '../../../components/NavBar';
import Loader from '../../../components/Loader';
import {height, width} from '../../../constants/screenSize';
import {colors, fonts} from '../../../Theme';

import {RadioButton} from '../../../components/index';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

export default function ({navigation}) {
  const [userID, setUserID] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [bannerData, setBannerData] = React.useState([]);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [subscription, setSubscription] = React.useState('');
  const [subscribFullData, setSubscribFullData] = React.useState('');
  const [checkData, setCheckData] = React.useState('');
  const {NativeMethodModule} = NativeModules;
  // React.useEffect(() => {
  //     getSubscriptionDetails();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getSubscriptionDetails();
    }, []),
  );

  //***** For home screen information */
  const getSubscriptionDetails = () => {
    setLoading(true);
    //***** api calling */
    getService('get-current-subscription')
      .then((res) => {
        console.log('res.data.response =>', res);

        if (res.data.status == 1) {
          if (res.data.response) {
            let data = res.data.response;
            console.log('res.data =>', data);
            var headerData = [];
            var slideData = {
              id: data._id,
              price: data.subscription.total_price,
              duration: data.subscription.duration,
              subscription_name:
                I18nManager.isRTL == true
                  ? data.subscription.subscription_name_ar
                  : data.subscription.subscription_name_en,
            };
            setCheckData('');
            headerData.push(slideData);
            setBannerData(headerData);
            setLoading(false);
            setSubscription(data.subscription);

            setSubscribFullData(data);
          }
        } else {
          setCheckData('no data');
          setLoading(false);
          showDangerToast(res.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };

  // slider bottom dots
  const pagination = () => {
    return (
      <Pagination
        dotsLength={bannerData.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.dotContainer}
        dotStyle={styles.activeDot}
        inactiveDotStyle={styles.inactiveDot}
      />
    );
  };

  const renderItem = ({item, index}) => {
    //console.log("item =>", item);
    return (
      <>
        <View style={styles.sliderContainer}>
          <ImageBackground
            source={globalImagePath.subscriptionHeadBack}
            style={styles.sliderImg}
            resizeMode={'contain'}>
            <View style={styles.nav_view_slider}>
              <Text style={styles.enterPrisetext}>
                {I18n.t('lbl_enterprise')}
              </Text>
              <View style={styles.slidePriceView}>
                <Text style={styles.mainText}>
                  {'SAR ' + item.price + '/'}
                  <Text style={styles.subText}>{item.subscription_name}</Text>
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </>
    );
  };

  const cancelSubsriptions = (_id) => {
    setLoading(true);
    console.log('_id', _id);
    let data = {
      _id: _id ? _id : subscribFullData._id,
    };

    console.log('data =>', data);
    // ***** api calling */
    postService('payment/cancelSubscription', data)
      .then(async (res) => {
        // console.log("payment/cancelSubscription ==> ", res);
        if (res.data.status === 1) {
          setLoading(false);
          showToast(res.data.message);
          getSubscriptionDetails();
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

  const cancelPlanAlert = (_id) => {
    Alert.alert(
      `${I18n.t('lbl_cancel_subscription')}`,
      '',
      [
        {
          text: `${I18n.t('lbl_cancel')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: `${I18n.t('lbl_ok')}`,
          onPress: () => {
            cancelSubsriptions(_id);
          },
        },
      ],
      {cancelable: false},
    );
  };

  //***** For rendering UI */
  return (
    <Container style={{flex: 1}}>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        title={I18n.t('lbl_my_subscription')}
        isCenterImage={false}
        centerText={I18n.t('lbl_my_subscription')}
        navigation="HomePage"
        titleTop={''}
      />
      {subscribFullData ? (
        <View style={{flex: 1}}>
          <View style={styles.carouselContainer}>
            <Carousel
              data={bannerData}
              renderItem={(item) => renderItem(item)}
              onSnapToItem={(index) => setActiveSlide(index)}
              sliderWidth={width}
              itemWidth={width}
              autoplay={false}
              autoplayDelay={100}
              enableSnap={true}
              loop={false}
              layout={'default'}
            />
          </View>
          <View style={styles.paginationContainer}>{pagination()}</View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.nestedView}>
              <View style={styles.topView}>
                <Text style={styles.heading_text}>
                  {I18n.t('lbl_enperprice_membership')}
                </Text>
                <View style={styles.monthView}>
                  {subscription.total_price ? (
                    <View style={{justifyContent: 'center'}}>
                      <Text style={styles.priceText}>
                        {'SAR ' + subscription.total_price}
                      </Text>
                    </View>
                  ) : null}
                  {subscription.duration_type ? (
                    <TouchableOpacity style={styles.editOuter}>
                      <Text style={styles.btnText2}>
                        {!I18nManager.isRTL
                          ? subscription.subscription_name_en
                          : subscription.subscription_name_ar}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              <View style={styles.datesView}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.4}}>
                    <Text style={styles.subscriptionDates}>
                      {I18n.t('lbl_created')}
                    </Text>
                  </View>
                  <Text style={styles.subscriptionDates}>{' : '}</Text>
                  <View style={{flex: 0.6}}>
                    <Text style={styles.subscriptionDates}>
                      {moment(subscribFullData.created).format('MM/DD/YYYY')}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.4}}>
                    <Text style={styles.subscriptionDates}>
                      {I18n.t('lbl_expireDate')}
                    </Text>
                  </View>
                  <Text style={styles.subscriptionDates}>{' : '}</Text>
                  <View style={{flex: 0.6}}>
                    <Text style={styles.subscriptionDates}>
                      {moment(subscribFullData.expire_date).format(
                        'MM/DD/YYYY',
                      )}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.4}}>
                    <Text style={styles.subscriptionDates}>
                      {I18n.t('lbl_payment_status')}
                    </Text>
                  </View>
                  <Text style={styles.subscriptionDates}>{' : '}</Text>
                  <View style={{flex: 0.6}}>
                    <Text style={styles.paymentStatus}>
                      {subscribFullData.status == 0
                        ? I18n.t('lbl_pending')
                        : I18n.t('lbl_completed')}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.description_outer}>
                <View style={{marginLeft: 15}}>
                  <Image
                    source={globalImagePath.circleCheck}
                    style={{height: 18, width: 18}}
                    resizeMode={'contain'}></Image>
                </View>
                <View style={styles.nav_describe}>
                  <Text style={styles.description_text}>
                    {!I18nManager.isRTL
                      ? subscription.description_en
                      : subscription.description_ar}
                  </Text>
                </View>
              </View>
              {subscribFullData.status == 1 ? (
                <TouchableOpacity
                  onPress={() => {
                    cancelPlanAlert(0);
                  }}
                  style={styles.datesView}>
                  <Text style={styles.cancelSubscription}>
                    {I18n.t('lbl_cancel_subscribe')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.datesView}>
                  <Text style={styles.cancelledSubscription}>
                    {'Subscription Cancelled'}
                  </Text>
                </View>
              )}

              {subscribFullData.upgrade_plan ? (
                <View style={styles.datesView}>
                  <Text style={styles.upgradSubscription}>
                    {'Upcoming subscription plan :'}
                  </Text>
                  <View style={{marginLeft: 20}}>
                    <View style={styles.monthView}>
                      {subscribFullData.upgrade_plan.amount ? (
                        <View style={{justifyContent: 'center'}}>
                          <Text style={styles.upcoming_priceText}>
                            {'SAR ' + subscribFullData.upgrade_plan.amount}
                          </Text>
                        </View>
                      ) : null}
                      {subscribFullData.upgrade_plan.subscription
                        .duration_type ? (
                        <TouchableOpacity style={styles.editOuter}>
                          <Text style={styles.btnText2}>
                            {!I18nManager.isRTL
                              ? subscribFullData.upgrade_plan.subscription
                                  .subscription_name_en
                              : subscribFullData.upgrade_plan.subscription
                                  .subscription_name_ar}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.datesView}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.4}}>
                        <Text style={styles.subscriptionDates}>
                          {I18n.t('lbl_created')}
                        </Text>
                      </View>
                      <Text style={styles.subscriptionDates}>{' : '}</Text>
                      <View style={{flex: 0.6}}>
                        <Text style={styles.subscriptionDates}>
                          {moment(
                            subscribFullData.upgrade_plan.start_date,
                          ).format('MM/DD/YYYY')}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.4}}>
                        <Text style={styles.subscriptionDates}>
                          {I18n.t('lbl_expireDate')}
                        </Text>
                      </View>
                      <Text style={styles.subscriptionDates}>{' : '}</Text>
                      <View style={{flex: 0.6}}>
                        <Text style={styles.subscriptionDates}>
                          {moment(
                            subscribFullData.upgrade_plan.expire_date,
                          ).format('MM/DD/YYYY')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      cancelPlanAlert(subscribFullData.upgrade_plan._id);
                    }}
                    style={styles.datesView}>
                    <Text style={styles.cancelSubscription}>
                      {I18n.t('lbl_cancel_subscribe')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={styles.btnView}>
                <Button
                  label={I18n.t('lbl_upgrade')}
                  textSize={16}
                  onPress={() => {
                    navigation.navigate('Subscription', {
                      current_plan: subscribFullData._id,
                    });
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          {checkData == 'no data' ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 20,
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 18, textAlign: 'center'}}>
                  {
                    'User do not have any subscription plan. Please purchase subscriptions.'
                  }
                </Text>
              </View>
              <View style={{marginTop: 20, height: 50, width: '100%'}}>
                <Button
                  label={'Please Subscribe'}
                  textSize={16}
                  onPress={() => {
                    navigation.navigate('Subscription');
                  }}
                />
              </View>
            </View>
          ) : null}
        </View>
      )}
    </Container>
  );
}

//***** Define style */
const styles = {
  container: {
    paddingHorizontal: 20,
  },
  paginationContainer: {
    // backgroundColor: colors.bgColor,
    paddingHorizontal: width * (21 / 375),
    zIndex: 1,
    height: width * (40 / 375),
  },
  carouselContainer: {
    paddingTop: width * (13 / 375),
    alignItems: 'center',
  },
  activeDot: {
    width: width * (10 / 375),
    height: width * (10 / 375),
    borderRadius: 100,
    marginHorizontal: -5,
    backgroundColor: colors.themeColor,
  },
  inactiveDot: {
    width: width * (18 / 375),
    height: width * (18 / 375),
    borderRadius: 100,
    // backgroundColor: colors.sliderInactivDot,
  },
  paginationContainer: {
    // backgroundColor: colors.bgColor,
    paddingHorizontal: width * (21 / 375),
    zIndex: 1,
    height: width * (40 / 375),
  },
  dotContainer: {
    // color: colors.transparent,
    width: width * 0.89,
    marginTop: -25,
    zIndex: 1,
    height: width * (90 / 375),
  },
  sliderContainer: {
    // marginHorizontal: width * (20 / 375),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderImg: {
    height: width * 0.5,
    width: '100%',
  },
  editOuter: {
    marginLeft: width * (10 / 375),
    borderRadius: 5,
    backgroundColor: colors.themeColor,
    paddingHorizontal: width * (30 / 375),
    paddingVertical: width * (8 / 375),
    justifyContent: 'center',
  },
  btnText2: {
    fontFamily: fonts.type.NunitoSans_Regular,
    fontSize: width * (14 / 375),
    color: colors.whiteColor,
  },
  scrollView: {
    flex: 1,
    marginBottom: width * (20 / 375),
  },
  nestedView: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(0,0,0, 0.2)',
    borderRightWidth: 1,
    flex: 1,
    borderTopLeftRadius: width * (35 / 375),
    borderTopRightRadius: width * (35 / 375),
  },
  topView: {
    marginLeft: width * (20 / 375),
    marginTop: width * (20 / 375),
  },
  datesView: {
    marginLeft: width * (20 / 375),
    marginTop: width * (5 / 375),
  },
  heading_text: {
    fontSize: width * (22 / 375),
    fontFamily: fonts.type.NunitoSans_SemiBold,
    color: '#000',
  },
  monthView: {
    flexDirection: 'row',
    marginTop: width * (15 / 375),
  },
  priceText: {
    fontSize: width * (22 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
    color: colors.themeColor,
  },
  upcoming_priceText: {
    fontSize: width * (14 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
    color: colors.themeColor,
  },
  subscriptionDates: {
    fontSize: width * (14 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
    color: colors.themeColor,
  },
  paymentStatus: {
    fontSize: width * (14 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
  },
  cancelSubscription: {
    fontSize: width * (14 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
    color: colors.themeColor,
    textDecorationLine: 'underline',
  },
  cancelledSubscription: {
    fontSize: width * (14 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
    color: colors.themeColor,
  },
  upgradSubscription: {
    fontSize: width * (14 / 375),
    fontFamily: fonts.type.NunitoSans_bold,
    color: colors.themeColor,
    textDecorationLine: 'underline',
  },
  listView: {
    marginHorizontal: width * (20 / 375),
    marginTop: width * (25 / 375),
  },
  btnView: {
    marginTop: width * (20 / 375),
    height: width * (50 / 375),
    marginBottom: width * (10 / 375),
    marginHorizontal: width * (20 / 375),
  },
  skipView: {
    marginHorizontal: width * (20 / 375),
    marginTop: width * (10 / 375),
    alignItems: 'center',
  },
  description_outer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginHorizontal: 10,
    marginTop: 15,
  },
  description_text: {
    fontFamily: fonts.type.NunitoSans_Regular,
    flexWrap: 'wrap',
    lineHeight: 16,
    marginLeft: 5,
    fontSize: 12,
    color: colors.themeColor,
  },
  nav_describe: {
    flex: 1,
    justifyContent: 'center',
  },
  nav_view_slider: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 20,
  },
  enterPrisetext: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.type.NunitoSans_SemiBold,
  },
  slidePriceView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  mainText: {
    color: colors.white,
    fontSize: 28,
    fontFamily: fonts.type.NunitoSans_bold,
    fontWeight: 'bold',
  },
  subText: {
    fontWeight: 'bold',
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.type.NunitoSans_bold,
  },
  defaultOuter: {
    paddingHorizontal: width * (10 / 375),
    paddingVertical: width * (3 / 375),
    borderRadius: 3,
    backgroundColor: colors.lightThemeColor,
  },
  default_text: {
    color: '#fff',
    fontFamily: fonts.type.NunitoSans_Regular,
    fontSize: width * (10 / 375),
  },
};
