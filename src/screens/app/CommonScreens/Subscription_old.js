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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import {Container, Content} from 'native-base';
import {getService} from '../../../services/getServices';
import I18n from '../../../I18n';
import {showToast, showDangerToast} from '../../../components//ToastMessage';
import validate from '../../../components/Validations/validate_wrapper';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {globalImagePath} from '../../../constants/globalImagePath';
import NavBar from '../../../components/NavBar';
import Loader from '../../../components/Loader';
import {height, width} from '../../../constants/screenSize';
import {colors, fonts} from '../../../Theme';
import {USER_HOME_BANNER_URL} from '../../../utils/constants';
import Picker from 'react-native-picker';
import {postService} from '../../../services/postServices';
import ErrorMessage from '../../../components/ErrorMessage';
import {Checkbox, Lable} from '../../../components';
import {I18nManager} from 'react-native';
import {RadioButton} from '../../../components/index';
export default function ({navigation}) {
  const [userID, setUserID] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [bannerData, setBannerData] = React.useState([]);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [subscription, setSubscription] = React.useState(['']);
  const [visibleCardModal, setVisibleCardModal] = React.useState(false);
  const [isAddNewCard, setIsAddNewCard] = React.useState(false);
  const [addressData, setAddressData] = React.useState([]);
  const [cardData, setCardData] = React.useState([]);
  const [cardName, setCardName] = React.useState('');
  const [cardNameError, setCardNameError] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardNumberError, setCardNumberError] = React.useState('');
  const [cardMonth, setCardMonth] = React.useState('');
  const [cardMonthError, setCardMonthError] = React.useState('');
  const [cardYear, setCardYear] = React.useState('');
  const [cardYearError, setCardYearError] = React.useState('');
  const [cardCVV, setCardCVV] = React.useState('');
  const [cardCVVError, setCardCVVError] = React.useState('');
  const [monthData, setMonthData] = React.useState('');
  const [yearData, setYearData] = React.useState('');
  const [salonID, setSalonID] = React.useState('');
  const [services, setServices] = React.useState([]);
  const [saveCard, setSaveCard] = React.useState(false);
  const [totalPrice, setTotalPrice] = React.useState('');
  const [selectedCardID, setSelectedCardID] = React.useState('');

  const {NativeMethodModule} = NativeModules;
  React.useEffect(() => {
    AsyncStorage.getItem('user', (err1, item1) => {
      var userDetail = JSON.parse(item1);
      setUserID(userDetail._id);
      getSubscriptionDetails();
      setVisibleCardModal(false);
      getYearAndMonth();
      getCartDetails();
    });
  }, []);

  const getCartDetails = async () => {
    setLoading(true);

    const postData = {};
    //***** api calling */
    postService('usercards', postData)
      .then(async (res) => {
        setLoading(false);
        // console.log("usercards ==> ", res.data.response);

        if (res.data.status === 1) {
          let data = res.data.response;

          let cardArr = [];
          (await data.card_list) &&
            data.card_list.map((item, key) => {
              if (item.isdefault == 1) {
                item.active = true;
                setSelectedCardID(item._id);
              } else {
                item.active = false;
              }
              cardArr.push(item);
            });

          let monData = [];
          let yearData = [];
          for (let month = 1; month <= 12; month++) {
            monData.push(month);
          }

          for (let year = new Date().getFullYear(); year <= 2050; year++) {
            yearData.push(year);
          }
          setIsAddNewCard(cardArr.length != 0 ? false : true);
          setMonthData(await monData);
          setYearData(await yearData);

          setLoading(false);
          setSalonID(data.salon_id ? data.salon_id._id : '');
          setServices(data.services);

          setCardData(await cardArr);
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

  const getCheckOutId = async () => {
    setLoading(true);

    const postData = {
      amount: subscription[activeSlide].total_price,
      subscription_id: subscription[activeSlide]._id,
      coupan: '',
    };
    console.log('postData =>', postData);
    //***** api calling */
    postService('payment/checkout', postData)
      .then(async (res) => {
        setLoading(false);
        setVisibleCardModal(false);
        if (res.data.status === 1) {
          let data = res.data.response;
          console.log('data ==> ', data.id);
          navigation.navigate('PaymentWebView', {
            checkOutId: data.id,
          });
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

  const getYearAndMonth = async () => {
    let monData = [];
    let yearData = [];
    for (let month = 1; month <= 12; month++) {
      monData.push(month);
    }

    for (let year = new Date().getFullYear(); year <= 2050; year++) {
      yearData.push(year);
    }

    setMonthData(await monData);
    setYearData(await yearData);
  };

  //***** For home screen information */
  const getSubscriptionDetails = () => {
    setLoading(true);
    //***** api calling */
    console.log('getSubscriptionDetails ===>');
    getService('subscription')
      .then((res) => {
        if (res.data.response) {
          let data = res.data.response;
          console.log('subscription ===>', data);
          var headerData = [];
          data.map((ele, index) => {
            var data = {
              id: ele._id,
              price: ele.total_price,
              duration: ele.duration,
              subscription_name: ele.subscription_name,
            };
            headerData.push(data);
          });
          setBannerData(headerData);
          setLoading(false);
          setSubscription(data);
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
    return (
      <>
        <View style={styles.sliderContainer}>
          <ImageBackground
            source={globalImagePath.subscriptionHeadBack}
            style={styles.sliderImg}
            resizeMode={'contain'}>
            <View style={styles.nav_view_slider}>
              <Text style={styles.enterPrisetext}>{'Plan'}</Text>
              <View style={styles.slidePriceView}>
                <Text style={styles.mainText}>
                  {'SAR' + item.price + '/'}
                  <Text style={styles.subText}>{item.subscription_name}</Text>
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </>
    );
  };

  // Render subscription plan
  const _renderSubscription = (item, index) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        <Image source={globalImagePath.circleCheck}></Image>
        <View style={{justifyContent: 'center'}}>
          <Text
            style={{marginLeft: 10, fontSize: 11, color: colors.themeColor}}>
            {item.title}
          </Text>
        </View>
      </View>
    );
  };

  const payment = () => {
    const cardNumberError = validate('card_number', cardNumber);
    const cardNameError = validate('card_name', cardName);
    const monthError = validate('card_month', cardMonth);
    const yearError = validate('card_year', cardYear);
    const cvvError = validate('card_cvv', cardCVV);

    setCardNumberError(cardNumberError);
    setCardNameError(cardNameError);
    setCardMonthError(monthError);
    setCardYearError(yearError);
    setCardCVVError(cvvError);

    if (
      cardNumberError ||
      cardNameError ||
      monthError ||
      yearError ||
      cvvError
    ) {
    } else {
      setLoading(true);

      let data = {
        user_id: '5e5f7308fec61fabb726b73e',
        stripeToken: 'tok_1GXXfOHW3vqob9oDIe7g1Bqv',
        amount: totalPrice,
        subscription_id: '5e86015089a31c31daeb279a',
        payment_type: 'stripe',
        stripe_id: 'plan_H1XqVcRQoh36P5',
        coupon: '',
        is_new: 1,
      };

      console.log('data =>', data);
      // ***** api calling */
      postService('saveTransaction', data)
        .then(async (res) => {
          console.log('add card res ==> ', res);
          if (res.data.status === 1) {
            setLoading(false);
            showToast(res.data.message);
            setVisibleCardModal(false);
            if (saveCard) {
              addCard();
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
    }
  };

  const selectedCardpayment = () => {
    setLoading(true);
    let data = {
      user_id: userID,
      amount: subscription[activeSlide].total_price,
      subscription_id: subscription[activeSlide]._id,
      coupon: '',
      is_new: 0,
    };

    console.log('data =>', data);
    // ***** api calling */
    postService('saveTransaction', data)
      .then(async (res) => {
        console.log('add card res ==> ', res);
        if (res.data.status === 1) {
          setLoading(false);
          showToast(res.data.message);
          setVisibleCardModal(false);
          if (saveCard) {
            addCard();
          } else {
            setTimeout(() => {
              navigation.navigate('Home');
            }, 2000);
          }
          setTimeout(() => {
            navigation.navigate('Home');
          }, 2000);
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

  const addCard = () => {
    // console.log("enter in add card");
    const cardNumberError = validate('card_number', cardNumber);
    const cardNameError = validate('card_name', cardName);
    const monthError = validate('card_month', cardMonth);
    const yearError = validate('card_year', cardYear);
    const cvvError = validate('card_cvv', cardCVV);

    setCardNumberError(cardNumberError);
    setCardNameError(cardNameError);
    setCardMonthError(monthError);
    setCardYearError(yearError);
    setCardCVVError(cvvError);

    if (
      cardNumberError ||
      cardNameError ||
      monthError ||
      yearError ||
      cvvError
    ) {
    } else {
      setLoading(true);
      let data = {
        card_number: cardNumber,
        nameoncard: cardName,
        month: cardMonth,
        year: cardYear,
        cvv: cardCVV,
      };

      // ***** api calling */
      postService('usercards/addCard', data)
        .then(async (res) => {
          //   console.log("add card res ==> ", res);
          if (res.data.status === 1) {
            setLoading(false);
            if (!saveCard) {
              showToast(res.data.message);
            }
            setCardName('');
            setCardNumber('');
            setCardMonth('');
            setCardYear('');
            setCardCVV('');
            let data = res.data.response;
            let cardArr = [];
            (await data) &&
              data.map((item, key) => {
                if (item.isdefault == 1) {
                  item.active = true;
                  setSelectedCardID(item._id);
                } else {
                  item.active = false;
                }
                cardArr.push(item);
              });
            setCardData(await cardArr);
            setIsAddNewCard(false);
            setTimeout(() => {
              navigation.navigate('Home');
            }, 2000);
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

  const closeCardModal = async () => {
    setVisibleCardModal(false);
  };

  const _renderEmptyCardComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text
          style={{
            marginTop: 20,
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {I18n.t('lbl_no_card')}
        </Text>
      </View>
    );
  };

  const handleMonthPress = () => {
    const pickerStyle = {
      pickerConfirmBtnColor: [255, 255, 255, 1],
      pickerBg: [255, 255, 255, 1],
      pickerToolBarBg: [196, 170, 153, 1],
      pickerTitleColor: [255, 255, 255, 1],
      pickerCancelBtnColor: [255, 255, 255, 1],
    };
    Picker.init({
      ...pickerStyle,
      pickerData: monthData,
      selectedValue: [`${cardMonth ? cardMonth : monthData[0]}`],
      pickerTextEllipsisLen: 25,
      pickerCancelBtnText: 'Cancel',
      pickerConfirmBtnText: 'Confirm',
      pickerTitleText: 'Select Month',
      onPickerConfirm: (data) => {
        setCardMonth(parseInt(data[0]));
        setCardMonthError(validate('card_month', data[0]));
      },
      onPickerCancel: (data) => {},
      onPickerSelect: (data) => {},
    });
    Picker.show();
  };

  const handleYearPress = () => {
    const pickerStyle = {
      pickerConfirmBtnColor: [255, 255, 255, 1],
      pickerBg: [255, 255, 255, 1],
      pickerToolBarBg: [196, 170, 153, 1],
      pickerTitleColor: [255, 255, 255, 1],
      pickerCancelBtnColor: [255, 255, 255, 1],
    };
    Picker.init({
      ...pickerStyle,
      pickerData: yearData,
      selectedValue: [`${cardYear ? cardYear : yearData[0]}`],
      pickerTextEllipsisLen: 25,
      pickerCancelBtnText: 'Cancel',
      pickerConfirmBtnText: 'Confirm',
      pickerTitleText: 'Select Year',
      onPickerConfirm: (data) => {
        setCardYear(data[0]);
        setCardYearError(validate('card_year', data[0]));
      },
      onPickerCancel: (data) => {},
      onPickerSelect: (data) => {},
    });
    Picker.show();
  };

  const _selectPlan = () => {
    setVisibleCardModal(true);
    setTotalPrice(subscription[activeSlide].total_price);
  };

  const _renderCards = (item, index) => {
    var str = item.card_number.replace(/\d(?=\d{4})/g, '*');
    return (
      <View
        style={{
          flex: 1,
          marginVertical: 7,
          backgroundColor: 'rgb(245,241,238)',
          padding: 15,
          borderRadius: 8,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <RadioButton
              placeholder=""
              title={str}
              checkedIcon={globalImagePath.selectRadio}
              uncheckedIcon={globalImagePath.nonSelectRadio}
              marginRight={10}
              fontSize={14}
              titleColor={'rgb(25,27,28)'}
              checked={item.active ? true : false}
              onPress={async () => {
                let cardArr = [...cardData];
                await cardArr.map((itm, key) => {
                  if (key == index) {
                    itm.active = true;
                    setSelectedCardID(itm._id);
                  } else {
                    itm.active = false;
                  }
                });
                setCardData(await cardArr);
              }}
            />
          </View>
          {item.active ? (
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity style={styles.defaultOuter}>
                <Text style={styles.default_text}>{I18n.t('lbl_default')}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <Text
          style={{
            marginLeft: width * (20 / 375),
            color: 'rgb(25,27,28)',
            fontSize: 14,
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {item.nameoncard}
        </Text>
        {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <TouchableOpacity style={styles.editOuter}>
                        <Text style={styles.btnText2}>{I18n.t('lbl_edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn}>
                        <Text style={styles.btnText}>{I18n.t('lbl_delete')}</Text>
                    </TouchableOpacity>
                    {item.status ? <TouchableOpacity style={styles.makeDefaultBtn} onPress={() => { _makeDefault(index) }}>
                        <Text style={styles.btnText2}>{I18n.t('lbl_make_default')}</Text>
                    </TouchableOpacity> : null}
                </View> */}
      </View>
    );
  };

  const requestHyperPay = (checkOutId) => {
    // console.log("checkOutId =>", checkOutId);
    let data = {checkoutId: checkOutId};
    console.log('data =>', data);
    setTimeout(() => {
      NativeMethodModule.openHyperPay(
        data,
        (response) => {
          console.log(
            'subscription[activeSlide] =>',
            subscription[activeSlide],
          );
          setTimeout(() => {
            console.log('success', response);
            showToast('success');
            //get resoucePath
            // Toast.show({
            //     text: Identify.__('Payment success !'),
            //     type: 'success',
            //     duration: 3000,
            // });
          }, 500);
          selectedCardpayment();
        },
        (message) => {
          setTimeout(() => {
            showDangerToast('Sorry, payment failed !');
            //request cancel
            // Toast.show({
            //     text: Identify.__('Sorry, payment failed !'),
            //     type: 'danger',
            //     duration: 3000,
            // });
          }, 500);
        },
      );
    }, 500);
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
        title={I18n.t('lbl_subscription_plan')}
        isCenterImage={false}
        centerText={I18n.t('lbl_subscription_plan')}
        navigation="HomePage"
        titleTop={''}
      />
      <View style={styles.carouselContainer}>
        <Carousel
          data={bannerData}
          renderItem={(item) => renderItem(item)}
          onSnapToItem={(index) => setActiveSlide(index)}
          sliderWidth={width}
          itemWidth={width * (300 / 375)}
          autoplay={false}
          autoplayDelay={100}
          enableSnap={true}
          loop={true}
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
              {subscription[activeSlide].total_price ? (
                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.priceText}>
                    {'SAR ' + subscription[activeSlide].total_price}
                  </Text>
                </View>
              ) : null}
              {subscription[activeSlide].duration_type ? (
                <TouchableOpacity style={styles.editOuter}>
                  <Text style={styles.btnText2}>
                    {!I18nManager.isRTL
                      ? subscription[activeSlide].subscription_name_en
                      : subscription[activeSlide].subscription_name_ar}
                  </Text>
                </TouchableOpacity>
              ) : null}
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
                  ? subscription[activeSlide].description_en
                  : subscription[activeSlide].description_ar}
              </Text>
            </View>
          </View>

          <View style={styles.btnView}>
            <Button
              label={I18n.t('lbl_buy_now')}
              textSize={16}
              onPress={() => {
                _selectPlan();
              }}
              //onPress={() => { getCheckOutId() }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home');
            }}
            style={styles.skipView}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.type.NunitoSans_bold,
                color: colors.themeColor,
              }}>
              {I18n.t('lbl_skip')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal transparent={true} visible={visibleCardModal} onRequestClose={''}>
        <TouchableOpacity
          activeOpacity={1}
          style={{width: '100%', height: '100%'}}
          onPress={() => {}}>
          <Content
            scrollEnabled={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  padding: 20,
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'rgb(25,27,28)',
                      fontSize: 18,
                      fontFamily: fonts.type.NunitoSans_SemiBold,
                    }}>
                    {I18n.t('lbl_select_card')}
                  </Text>
                  <TouchableOpacity onPress={() => closeCardModal()} style={{}}>
                    <Image
                      source={globalImagePath.crossIcon}
                      style={{height: 50, width: 40}}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: isAddNewCard ? '100%' : '100%',
                    flexDirection: 'row',
                  }}>
                  {/* <TouchableOpacity
                                        onPress={() => { setIsAddNewCard(!isAddNewCard) }}
                                        style={{
                                            borderRadius: 5,
                                            paddingHorizontal: 8,
                                            paddingVertical: 7,
                                            borderWidth: 0.8,
                                            borderColor: colors.themeColor,
                                            height: 45,
                                            marginTop: -10,
                                            justifyContent: 'center'
                                        }}
                                    > */}

                  <View style={{flex: 1}}>
                    <Text style={{color: colors.darkShade, fontSize: 14}}>
                      {'Payment amount'}
                    </Text>
                    <Text style={{color: colors.darkShade, fontSize: 24}}>
                      {'SAR ' + totalPrice + '.00'}
                    </Text>
                  </View>
                  <View style={{alignSelf: 'center'}}>
                    <TouchableOpacity
                      onPress={() => setIsAddNewCard(!isAddNewCard)}>
                      <Text
                        style={{
                          textDecorationLine: 'underline',
                          color: colors.darkShade,
                          fontSize: 14,
                          textAlign: 'center',
                        }}>
                        {isAddNewCard
                          ? I18n.t('lbl_select_card')
                          : I18n.t('lbl_add_new_card')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* </TouchableOpacity> */}
                </View>
                {isAddNewCard ? (
                  <>
                    <TextInput
                      isPlaceHolder={true}
                      placeholder={I18n.t('lbl_enter_name_card')}
                      isLevelShow={false}
                      level={'Name on card'}
                      error={cardNameError}
                      maxLength={55}
                      onChangeText={(cardName) => {
                        setCardName(cardName);
                        setCardNameError(validate('card_name', cardName));
                      }}
                      value={cardName}
                    />
                    <TextInput
                      isPlaceHolder={true}
                      placeholder={I18n.t('lbl_card_number')}
                      isLevelShow={false}
                      level={'Card number'}
                      keyboardType={'number-pad'}
                      error={cardNumberError}
                      maxLength={19}
                      onChangeText={(cardNumber) => {
                        setCardNumber(cardNumber);
                        setCardNumberError(validate('card_number', cardNumber));
                      }}
                      value={cardNumber}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{width: '48%'}}>
                        {/* <TextInput
                                                    isPlaceHolder={true}
                                                    placeholder={'Enter expiry month'}
                                                    isLevelShow={false}
                                                    level={'Expiry month'}
                                                    keyboardType={'number-pad'}
                                                    error={cardMonthError}
                                                    onChangeText={cardMonth => {
                                                        setCardMonth(cardMonth);
                                                        setCardMonthError(validate("card_month", cardMonth))
                                                    }}
                                                    value={cardMonth}
                                                /> */}
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            borderBottomColor: 'rgba(196,170,153,0.5)',
                            borderBottomWidth: 1,
                            marginTop: 0,
                            //marginBottom: 10,
                            paddingHorizontal: 0,
                            height: 50,
                          }}
                          onPress={() => {
                            handleMonthPress();
                          }}>
                          {cardMonth ? (
                            <Text
                              style={{
                                fontFamily: fonts.type.NunitoSans_Regular,
                                color: '#000000',
                              }}>{`${cardMonth}`}</Text>
                          ) : (
                            <Text
                              style={{
                                fontFamily: fonts.type.NunitoSans_Regular,
                                color: 'rgb(183,190,197)',
                                fontSize: 14,
                              }}>{`${I18n.t('lbl_expiry_month')}`}</Text>
                          )}
                        </TouchableOpacity>
                        {cardMonthError.length > 0 && (
                          <ErrorMessage text={cardMonthError} />
                        )}
                      </View>
                      <View style={{width: '48%'}}>
                        {/* <TextInput
                                                    isPlaceHolder={true}
                                                    placeholder={'Enter expiry year'}
                                                    isLevelShow={false}
                                                    level={'Expiiry year'}
                                                    keyboardType={'number-pad'}
                                                    error={cardYearError}
                                                    onChangeText={cardYear => {
                                                        setCardYear(cardYear);
                                                        setCardYearError(validate("card_year", cardYear))
                                                    }}
                                                    value={cardYear}
                                                /> */}
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            borderBottomColor: 'rgba(196,170,153,0.5)',
                            borderBottomWidth: 1,
                            marginTop: 0,
                            //marginBottom: 10,
                            paddingHorizontal: 0,
                            height: 50,
                          }}
                          onPress={() => handleYearPress()}>
                          {cardYear ? (
                            <Text
                              style={{
                                fontFamily: fonts.type.NunitoSans_Regular,
                                color: '#000000',
                              }}>{`${cardYear}`}</Text>
                          ) : (
                            <Text
                              style={{
                                fontFamily: fonts.type.NunitoSans_Regular,
                                color: 'rgb(183,190,197)',
                                fontSize: 14,
                              }}>{`${I18n.t('lbl_expiry_year')}`}</Text>
                          )}
                        </TouchableOpacity>
                        {cardYearError.length > 0 && (
                          <ErrorMessage text={cardYearError} />
                        )}
                      </View>
                    </View>
                    <TextInput
                      isPlaceHolder={true}
                      placeholder={I18n.t('lbl_enter_cvv')}
                      isLevelShow={false}
                      level={'Card CVV'}
                      secureTextEntry={true}
                      keyboardType={'number-pad'}
                      error={cardCVVError}
                      maxLength={5}
                      onChangeText={(cardCVV) => {
                        setCardCVV(cardCVV);
                        setCardCVVError(validate('card_cvv', cardCVV));
                      }}
                      value={cardCVV}
                    />
                    <Checkbox
                      fontSize={14}
                      checked={saveCard}
                      onPress={() => setSaveCard(!saveCard)}
                      placeholder={'Save Card'}
                    />

                    <View style={{marginTop: 20, marginBottom: 10}}>
                      <Button
                        label={I18n.t('lbl_pay')}
                        textSize={16}
                        onPress={() => {
                          payment();
                        }}
                        // onPress={() => { getCheckOutId() }}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        flex: 1,
                        marginTop: 7,
                        height: addressData.length > 1 ? 200 : 150,
                      }}>
                      <FlatList
                        data={cardData}
                        nestedScrollEnabled={true}
                        renderItem={({item, index}) =>
                          _renderCards(item, index)
                        }
                        keyExtractor={(item, index) => String(index)}
                        ListEmptyComponent={() => _renderEmptyCardComponent()}
                      />
                      {/* <Button
                                                label={'Pay'}
                                                textSize={16}
                                                onPress={() => { }} /> */}
                    </View>
                    {cardData.length > 0 && (
                      <View style={{flex: 1, marginTop: 7}}>
                        <Button
                          label={I18n.t('lbl_pay')}
                          textSize={16}
                          onPress={async () => {
                            let cardArr = [...cardData];
                            await cardArr.map((itm, key) => {
                              if (itm.active) {
                                setSelectedCardID(itm._id);
                              }
                            });
                            selectedCardpayment();
                            setVisibleCardModal(false);
                          }}
                          // onPress={() => { getCheckOutId() }}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Content>
        </TouchableOpacity>
      </Modal>
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
  listView: {
    marginHorizontal: width * (20 / 375),
    marginTop: width * (25 / 375),
  },
  btnView: {
    marginTop: width * (10 / 375),
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
