import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Keyboard, FlatList, I18nManager, ActivityIndicator } from 'react-native';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { Container, Content } from 'native-base';
import { NavigationActions } from '@react-navigation/compat';
import TextInput from '../../../../components/TextInput';
import Button from '../../../../components/Button';
import { CommonStyles } from '../../../../assets/css';
import validate from '../../../../components/Validations/validate_wrapper';
import AsyncStorage from '@react-native-community/async-storage';
import { postService } from '../../../../services/postServices';
import { getService } from '../../../../services/getServices';
import I18n from '../../../../I18n';
import { normalize } from '../../../../components/Dimensions';
import NavBar from '../../../../components/NavBar';
import Picker from "react-native-picker";
import { countries } from '../../../../constants/countryCode';
import { openTime } from '../../../../constants/OpenTime';
import { closeTime } from '../../../../constants/CloseTime';
import { CUSTOMERIMAGEURL } from '../../../../utils/constants';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-picker';
import ErrorMessage from '../../../../components/ErrorMessage';
import Loader from '../../../../components/Loader';
import { RadioButton } from '../../../../components/index';
import GoogleSearchInput from '../../../../components/googleSearchPlaceModal';
import ActionSheet from 'react-native-actionsheet';
import CheckBox from 'react-native-check-box';
import RNPicker from '../../../../components/RNPicker';
import { checkPhotoPermission, checkCameraPermission, pickImageHandler, openCameraPickerView } from '../../../../components/imagePicker'
//import MultiImagePicker from 'react-native-image-crop-picker';
import {
  showToast,
  showDangerToast,
  showDangerToastLong,
} from '../../../../components/ToastMessage';
import {
  check,
  PERMISSIONS,
  openSettings,
  request,
} from 'react-native-permissions';

import { fonts, colors, metrics } from '../../../../Theme';
const height = metrics.screenHeight;
const width = metrics.screenWidth;
var weekDaysTime = [];

export default function ProviderProfileScreen({ route, navigation }) {
  const [isAddressUpdate, setIsAddressUpdate] = React.useState(false);
  const [placeName, setPlaceName] = React.useState('');
  const [userID, setUserID] = React.useState('');
  const [image, setImage] = React.useState('');
  const [salonProfile, setSalonProfile] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [imageError, setImageError] = React.useState('');
  const [salonName, setSalonName] = React.useState('');
  const [serviceName, setServiceName] = React.useState('')
  const [serviceNameError, setServiceNameError] = React.useState('')
  const [price, setPrice] = React.useState('');
  const [priceError, setPriceError] = React.useState('');
  const [placeNameError, setPlaceNameError] = React.useState(false);
  const [serviceType, setServiceType] = React.useState(1);
  const [salonNameError, setSalonNameError] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [descriptionError, setDescriptionError] = React.useState('');
  const [searchModal, setSearchModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false); //isChecked
  const [selectedCat, setSelectedCat] = React.useState('');
  const [lat, setLat] = React.useState('');
  const [lng, setLng] = React.useState('');
  const [isChecked, setIsChecked] = React.useState(0);
  const [isImageUpdate, setIsImageUpdate] = React.useState(false);
  const [salonGallery, setSalonGallery] = React.useState([]);
  const [salonGalleryError, setSalonGalleryError] = React.useState([]);
  const [langVal, setLangVal] = React.useState('+966');
  const [getPhone, setPhoneNumber] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [selectCountry, setSelectCountry] = React.useState('Select country');
  const [countryError, setCountryError] = React.useState();
  const [selected, setselected] = React.useState({});
  const [profileLoad, setProfileLoad] = React.useState(false);
  const [bannerUrl, setBannerUrl] = React.useState('');
  const [timeSlot, setTimeSlot] = React.useState([
    { day: 'Mon', img: globalImagePath.circleCheck, select: true },
    { day: 'Tue', img: globalImagePath.circleCheck, select: true },
    { day: 'Wed', img: globalImagePath.circleCheck, select: true },
    { day: 'Thu', img: globalImagePath.circleCheck, select: true },
    { day: 'Fri', img: globalImagePath.circleCheck, select: true },
    { day: 'Sat', img: globalImagePath.circleCheck, select: true },
    { day: 'Sun', img: globalImagePath.circleCheck, select: true },

  ]);

  const [timeManage, setTimeManage] = React.useState([{ "open": "", "close": "" }, { "open": "", "close": "" }, { "open": "", "close": "" }, { "open": "", "close": "" }, { "open": "", "close": "" }, { "open": "", "close": "" }, { "open": "", "close": "" }])
  const [timeManageOpenError, setTimeManageOpenError] = React.useState(['', '', '', '', '', '', '']);
  const [timeManageCloseError, setTimeManageCloseError] = React.useState(['', '', '', '', '', '', '']);

  React.useEffect(() => {
    AsyncStorage.getItem('user', (err1, item1) => {
      var userDetail = JSON.parse(item1);
      setUserID(userDetail._id);
      // setLoading(true);
      getUserProfileDetails();
    });
  }, []);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     AsyncStorage.getItem('user', (err1, item1) => {
  //       var userDetail = JSON.parse(item1);
  //       setUserID(userDetail._id);
  //       selectLocation();
  //     });
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  React.useEffect(() => {
    if (route.params?.selectedAddress) {
      selectLocation();
    }
  }, [route.params?.selectedAddress]);

  //***** For getting user's profile information */
  const getUserProfileDetails = user_id => {
    const postData = {
      update_status: 0,
      user_id: user_id,
    };

    //***** api calling */ 
    getService('profile/detail')
      .then(res => {
        if (res.data.status === 1) {
          setLoading(false);
          let data = res.data.response;
          console.log("data profile details=>", data);
          setSalonName(data.salon_name);
          setServiceType(data.servicetype)
          setDescription(data.description);
          setEmail(data.email);
          setImage(data.banner_salon);
          setPlaceName(data.address)
          setLat(data.lat);
          setLng(data.lng);
          setIsImageUpdate(false);
          setSalonGallery(data.image);
          setPhoneNumber(data.phoneno);
          // setSelectCountry(data.country);
          setLangVal(data.country_code);
          setTimeManage(data.availability);
          setIsChecked(data.is_cancellation);
          setPrice(data.cancellation);
          setBannerUrl(data.salon_banner_url)
        } else {
          setLoading(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch(error => {
        setLoading(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };


  //***** Function for showing confirm alert for camera and photo permission */
  const confirmAlert = () => {
    Alert.alert(
      '"ArrangeApp" Would Like to Access Your Camera and Photos',
      'Need for upload photo',
      [
        {
          text: 'Not Allow',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        { text: 'Open Settings', onPress: () => openSettings() },
      ],
    );
  };

  const checkPhotoPermissions = () => {
    if (Platform.OS == 'ios') {
      Promise.all([
        check(PERMISSIONS.IOS.CAMERA),
        check(PERMISSIONS.IOS.PHOTO_LIBRARY),
      ]).then(([cameraStatus, photosStatus]) => {
        console.log({ cameraStatus, photosStatus });
        if (cameraStatus == 'blocked' || photosStatus == 'blocked') {
          confirmAlert();
        } else {
          pickSingleImageHandler();
        }
      });
    } else if (Platform.OS == 'android') {
      Promise.all([
        check(PERMISSIONS.ANDROID.CAMERA),
        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
      ]).then(([cameraStatus, photosStatus]) => {
        console.log({ cameraStatus, photosStatus });
        if (cameraStatus == 'blocked' || photosStatus == 'blocked') {
          confirmAlert();
        } else {
          pickSingleImageHandler();
        }
      });
    }
  };

  // ***** Function for uploading images * /
  const pickSingleImageHandler = () => {
    ImagePicker.showImagePicker(
      { title: I18n.t('lbl_pick_image'), maxWidth: 800, maxHeight: 600 },
      res => {
        if (res.didCancel) {
        } else if (res.error) {
        } else {

          setImage(res.uri);
          setSalonProfile(res.uri)
          setIsImageUpdate(true);
          setImageError(validate('image', res.uri));
        }
      },
    );
  };

  const _multiImagePicker = () => {
    // MultiImagePicker.openPicker({
    //   mediaType: "photo",
    //   multiple: true
    // }).then(images => {
    //   setSalonGallery(images)
    //   console.log("_multiImagePicker =>", images);
    // });

    return (
      ImagePicker.openPicker({
        mediaType: "photo",
        multiple: true
      }).then(image => {
        if (multiple == true) {
          return image
        } else {
          return [image]
        }

      })
        .catch(err => {
          console.log("the error in image picker is ", err.message);
          return err.message
        })
    )

  }

  const changePass = async () => {
    //***** For validate input fields */ //price

    const price_error = isChecked ? validate("price", price) : '';
    const salonNameError = validate("salonName", salonName);
    const phoneError = validate('phone', getPhone);
    const email_error = validate('email', email);
    const description_Error = validate("description", description);
    const placeName_errr = placeName == '' ? 'Please Select Location' : '';
    // const salonGallery_errr = salonGallery == '' ? 'Please Select Salon Image' : ''
    // const country = selectCountry == 'undefined' || selectCountry == '' ? 'Please Select Country' : ''
    //  const service_name_error = validate("service_name", serviceName);
    //const email_error = validate('email', email);
    setPlaceNameError(placeName_errr);
    setPriceError(price_error);
    setSalonNameError(salonNameError);
    // setSalonGalleryError(salonGallery_errr);
    setDescriptionError(description_Error);
    setEmailError(email_error);
    // setCountryError(country);

    let err = [...timeManageOpenError];
    let err1 = [...timeManageCloseError];
    let stop = 0;
    timeManage.map((item, index) => {
      if (item.open == '' && item.close != '') {
        err[index] = 'Please select from time.'
      }

      if (item.open != '' && item.close == '') {
        err1[index] = 'Please select end time.'
      }
    });

    setTimeManageOpenError(await err);
    setTimeManageCloseError(await err1);

    await err.map(async (item) => {
      if (item != '') { stop = await 1; return; }
    });

    await err1.map(async (item) => {
      if (item != '') { stop = await 1; return; }
    });

    // if (stop == 1) {
    //   return;
    // }

    if (
      price_error || description_Error || salonNameError || phoneError || email_error

    ) {
    } else {

      setLoading(true);
      let body = new FormData();
      if (isImageUpdate) {
        body.append('banner_salon', {
          uri: image,
          name: 'avatar.png',
          filename: 'avatar.png',
          type: 'image/png',
        });
      }
      body.append('first_name', salonName);
      body.append('address', placeName);
      // body.append('country', selectCountry);
      body.append('cancellation', isChecked ? price : 0);
      body.append('is_cancellation', +isChecked);
      body.append('servicetype', serviceType);
      body.append('latitude', lat);
      body.append('longitude', lng)
      body.append('description', description)
      body.append('country_code', 91)
      body.append('availability', JSON.stringify(timeManage));
      // body.append('user_id', userID);

      console.log("body =>", body);
      // ***** api calling */
      postService('profile/update-profile-provider', body)
        .then(res => {
          console.log('result = ' + JSON.stringify(res));

          if (res.data.status === 1) {
            setLoading(false);
            showToast(res.data.message);
          } else {
            setLoading(false);
            var message = '';
            // res?.data?.errors?.map((val) => {
            //   message += Object.values(val) + ' '
            // })
            setTimeout(function () {
              showDangerToast(res.data.message);
            }, 100);
          }
        })
        .catch(error => {
          console.log("provider profile update", error);
          setLoading(false);
          setTimeout(function () {
            alert(error);
          }, 100);
        });
    }
  };

  // const onSelectLanguage = (lang, index) => {

  //   setSelectCountry(lang.name);
  //   setCountryError('');

  // }

  const selectOpenTime = async (time, index, i) => {

    await closeTime.map((itm) => {
      if (timeManage[i].close == itm.name) {
        timeManage[i].closeVal = itm.val;
      }
    });

    if (timeManage[i].closeVal <= time.val) {
      showDangerToast('From time should not be greater than or equal to end time.');
      return;
    }

    const some_array = [...timeSlot];
    const timeError = [...timeManageOpenError];
    timeManage[i].open = time.name;
    timeManage[i].opneVal = time.val;
    timeError[i] = '';
    setTimeSlot(await some_array);
    setTimeManageOpenError(await timeError);

    // timeManage[index].close = '5:00'
    // setSelectCountry(lang.name);
    // setTimeManage(timeManage);

  }

  const selectCloseTime = async (time, index, i) => {

    console.log("close time val ==> ", time);
    if (timeManage[i].open == '') {
      showDangerToast('Please select from time first.');
      return;
    }

    await openTime.map((itm) => {
      if (timeManage[i].open == itm.name) {
        timeManage[i].opneVal = itm.val;
      }
    });

    if (timeManage[i].opneVal >= time.val) {
      showDangerToast('End time should not be greater than or equal to from time.');
      return;
    }

    const some_array = [...timeSlot];
    const timeError = [...timeManageCloseError];
    timeManage[i].close = time.name;
    timeManage[i].closeVal = time.val;
    timeError[i] = '';
    setTimeSlot(await some_array);
    setTimeManageCloseError(await timeError);

    // timeManage[index].close = '5:00'
    // setSelectCountry(lang.name);
    // setTimeManage(timeManage);

  }

  const selectService = (f) => {
    // this.setState({ serviceType: f })

    setServiceType(f);
  };

  const _getPlaceValue = (placeVal, lat, lng) => {

    setSearchModal(false);
    setPlaceName(placeVal)
    setLat(lat);
    setLng(lng);
  }

  const _onSelect = (item, index) => {
    const some_array = [...timeSlot]
    if (some_array[index].select != true) {
      some_array[index].select = true;
      // selected[index]=ele;
    } else {
      some_array[index].select = false;
      delete selected[index]
    }
    setTimeSlot(some_array);

    if (some_array[index].select != true) {
      timeManage[index].open = ''
      timeManage[index].close = ''

    }
    const changeTimeManage = [...timeManage]
    if (some_array[index].select != true) {
      changeTimeManage[index].select = true
    } else {
      changeTimeManage[index].select = false
    }
    setTimeManage(changeTimeManage);

  }

  const showMapView = () => {

    setIsAddressUpdate(true);
    navigation.navigate("LocationPicker", {
      screenName: 'ProviderProfileScreen',
      currentLat: lat,
      currentLong: lng
    });
  }

  const selectLocation = () => {
    setPlaceName(route.params && route.params.selectedAddress ? route.params.selectedAddress.address : '');
    setLat(route.params && route.params.selectedAddress ? route.params.selectedAddress.latitude : '');
    setLng(route.params && route.params.selectedAddress ? route.params.selectedAddress.longitude : '');
    setPlaceNameError(isAddressUpdate ? placeName == '' ? I18n.t('err_select_location') : '' : '');

  }

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
      selectedValue: [`${cardMonth ? cardMonth : monthData[0]}`,],
      pickerTextEllipsisLen: 25,
      pickerCancelBtnText: "Cancel",
      pickerConfirmBtnText: "Confirm",
      pickerTitleText: "Select Month",
      onPickerConfirm: (data) => {
        setCardMonth(parseInt(data[0]));
        setCardMonthError(validate("card_month", data[0]))
      },
      onPickerCancel: (data) => { },
      onPickerSelect: (data) => { },
    });
    Picker.show();
  }


  const renderTimeSlots = (item, i) => {

    return (
      <TouchableOpacity onPress={() => { _onSelect(item, i) }} style={{ flexDirection: 'row' }}>
        <View style={{ flex: 0.25, flexDirection: 'row' }}>
          <View style={{ flex: 0.3, justifyContent: 'center', }}>
            {timeManage[i].select || timeManage[i].open ?
              <Image source={globalImagePath.greenCheckmark} resizeMode={'contain'} style={{ height: 20, width: 20 }}></Image>
              :
              <Image source={item.img} resizeMode={'contain'} style={{ height: 20, width: 20 }}></Image>
            }
          </View>
          <View style={{ marginLeft: 30, justifyContent: 'center', }}>
            <Text style={styles.weekDays}>{item.day}</Text>
          </View>
        </View>
        {timeManage[i].select || timeManage[i].open ?
          <View style={{ marginLeft: 10, alignSelf: 'center', flex: 0.75, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <View style={styles.Amtime}>


                <RNPicker
                  timeSlot={'open'}
                  ifCountry={true}
                  showIcon={false}
                  dataSource={openTime}
                  dummyDataSource={openTime}
                  defaultValue={timeManage != "" ? true : false}
                  pickerTitle={'hello'}
                  showSearchBar={false}
                  searchBarPlaceHolder={'jjjjjj'}
                  disablePicker={openTime.length > 0 ? false : true}
                  changeAnimation={"none"}
                  searchBarPlaceHolder={'Select Open time'}
                  showPickerTitle={false}
                  selectedLabel={timeManage[i].open ? timeManage[i].open : 'From Time'}
                  placeHolderLabel={''}
                  placeholderColor={'#4782c5'}
                  selectedValue={(index, item) =>
                    selectOpenTime(item, index, i)
                  }
                  selectedId={openTime}
                  value={timeManage[i].open}
                />
              </View>
              {timeManageOpenError[i].length > 0 && <ErrorMessage text={timeManageOpenError[i]} />}
            </View>
            <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
              <Text style={styles.toText}>{'To'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.pmTime}>
                <RNPicker
                  timeSlot={'close'}
                  ifCountry={true}
                  dataSource={closeTime}
                  showIcon={false}
                  dummyDataSource={closeTime}
                  defaultValue={timeManage != "" ? true : false}
                  pickerTitle={'hello'}
                  showSearchBar={false}
                  searchBarPlaceHolder={'jjjjjj'}
                  disablePicker={closeTime.length > 0 ? false : true}
                  changeAnimation={"none"}
                  searchBarPlaceHolder={'Select Close time'}
                  showPickerTitle={false}
                  selectedLabel={timeManage[i].close ? timeManage[i].close : 'End Time'}
                  placeHolderLabel={''}
                  placeholderColor={'#4782c5'}
                  selectedValue={(index, item) =>
                    selectCloseTime(item, index, i)
                  }
                  selectedId={closeTime}
                  value={closeTime[i].close}
                />

              </View>
              {timeManageCloseError[i].length > 0 && <ErrorMessage text={timeManageCloseError[i]} />}
            </View>
          </View>
          :
          <View style={{ marginBottom: 10, marginLeft: 35, flex: 0.24, borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5, justifyContent: 'center', height: 50 }}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={CommonStyles.TextInputStyle(14, 50), { color: "rgb(183,190,197)" }}>{'Closed'}</Text>
            </View>
          </View>}
      </TouchableOpacity>
    )
  }

  const showActionSheet = () => {
    return (
      <ActionSheet
        ref={o => (this.ActionSheet = o)}
        title={""}
        options={["Camera", "Gallery", "Cancel"]}
        cancelButtonIndex={2}
        destructiveButtonIndex={3}
        style={{ useNativeDriver: true }}
        onPress={async (index) => {
          if (index == 0) {
            Platform.OS == "ios"
              ? checkCameraPermission().then(res => { console.log('1st res is ', res); handleImgRes(res); })
              : openCameraPickerView().then(res => { console.log('2st res is ', res); handleImgRes(res); });
          } else if (index == 1) {
            Platform.OS == "ios"
              ? checkPhotoPermission(true).then(res => { console.log('3st res is ', res); handleImgRes(res); })
              : pickImageHandler(true).then(res => { console.log('4st res is ', res); handleImgRes(res); });
          }
        }}
      />
    );
  }

  const handleImgRes = (res) => {

    var tempImgList = []
    if (typeof (res) != 'string') {
      res.map(i => {
        var lstIndex = i.path.lastIndexOf('/')
        var fileNameAndroid = i.path.slice(lstIndex + 1, i.path.length)
        var name = Platform.OS == 'ios' ? i.filename : fileNameAndroid
        var type = i.mime
        var uri = i.path
        tempImgList.push({ name: name, type: type, uri: uri })
      })
      console.log("", tempImgList);
      setSalonGallery(tempImgList);
      //this.setState({ ImgList: tempImgList });
    }
  }

  const phoneDigit = (val, index) => {
    setLangVal(val.dc)
  }

  const profileAnimationShow = async (val) => {
    setProfileLoad(val);
  };

  return (
    <Container>
      <Loader loading={loading} />
      <GoogleSearchInput
        visible={searchModal}
        _placeValue={(value, lat, lng) => _getPlaceValue(value, lat, lng)}
        _goBack={() => { setSearchModal(false); }}
      />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={colors.white}
        titleTop={''}
        // centerImg={''}
        //rightImage={globalImagePath.notification}
        navigation="HomePage"
        centerText={I18n.t('lbl_myAccount')}
      />
      <Content
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        //enableOnAndroid={true}
        enableResetScrollToCoords={false}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{
            backgroundColor: colors.moreLight,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}>

          { }
          <View style={{ paddingHorizontal: 30, alignItems: 'center' }}>

            <Animatable.View animation="slideInDown">
              <View style={{ paddingHorizontal: 60, alignItems: 'center', paddingVertical: 20 }}>
                <TouchableOpacity onPress={() => checkPhotoPermissions()} style={{
                  borderWidth: 1, width: normalize(100),
                  height: normalize(100),
                  borderRadius: normalize(50 / 2),
                  borderColor: colors.lightThemeColor
                }}>
                  <Image
                    source={isImageUpdate ? { uri: salonProfile } : { uri: bannerUrl + image }}
                    style={{
                      width: normalize(100),
                      height: normalize(100),
                      borderRadius: normalize(50 / 2),
                      //marginTop: normalize(-50),
                    }}
                    onLoadStart={() => profileAnimationShow(true)}
                    onLoad={() => profileAnimationShow(false)}
                  />
                  {profileLoad ? (
                    <ActivityIndicator
                      style={{ position: 'absolute', marginLeft: width * (50 / 375), marginTop: width * (50 / 375), }}
                      size='small'
                      color={'rgb(196,170,153)'}
                      animating={profileLoad}
                    />
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity style={{}} onPress={() => checkPhotoPermissions()}>
                  <Image
                    source={globalImagePath.imageEdit}
                    style={{
                      marginTop: normalize(-15),
                    }}
                  />
                </TouchableOpacity>

              </View>

            </Animatable.View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={{ width: '100%', marginTop: normalize(30) }}>

            <TextInput
              showIcon={true}
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_dummy_salon_name')}
              isLevelShow={true}
              level={I18n.t('lbl_salon_name')}
              error={salonNameError}
              editable={false}
              inputStyle={{
                fontFamily: 'NunitoSans-Regular',
                borderRadius: 5,
                marginTop: 4,
                height: 50,
                color: 'rgb(38, 38, 38)',
                fontSize: 14,
                flex: 1,
                backgroundColor: '#efefef'
              }}
              onChangeText={salonName => { setSalonName(salonName); setSalonNameError(validate("salonName", salonName, "", true)); }}
              value={salonName}
            />

            <TextInput
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_email')}
              isLevelShow={true}
              level={I18n.t('lbl_email')}
              editable={false}
              inputStyle={{
                fontFamily: 'NunitoSans-Regular',
                borderRadius: 5,
                marginTop: 4,
                height: 50,
                color: 'rgb(38, 38, 38)',
                fontSize: 14,
                flex: 1,
                backgroundColor: '#efefef'
              }}
              error={emailError}
              keyboardType={'email-address'}
              onChangeText={email => {
                setEmail(email);
                setEmailError(validate('email', email));
              }}
              value={email}
            />

            <TextInput
              langVal={langVal}
              onSelect={(val) => phoneDigit(val)}
              picker={true}
              disablePicker={true}
              isPlaceHolder={true}
              placeholder={I18n.t('lbl_enter_phone')}
              isLevelShow={true}
              level={I18n.t('lbl_phone_number')}
              error={phoneError}
              editable={false}
              inputStyle={{
                fontFamily: 'NunitoSans-Regular',
                borderRadius: 5,
                marginTop: 4,
                height: 50,
                color: 'rgb(38, 38, 38)',
                fontSize: 14,
                flex: 1,
                backgroundColor: '#efefef'
              }}
              keyboardType={'phone-pad'}
              onChangeText={phone => { setPhoneNumber(phone); setPhoneError(validate('phone', phone,)); }}
              value={`${langVal}${getPhone}`}
            />

            {/* {showActionSheet()} */}
            <View style={{}}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_service_type')}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", marginVertical: 5 }}>
                <RadioButton
                  placeholder=""
                  title={I18n.t('lbl_home')}
                  checkedIcon={globalImagePath.selectRadio}
                  uncheckedIcon={globalImagePath.nonSelectRadio}
                  marginRight={10}
                  fontSize={14}
                  checked={serviceType == 1 ? true : false}
                  onPress={() => { selectService(1), Keyboard.dismiss() }}
                />
                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    placeholder=""
                    title={I18n.t('lbl_salon')}
                    checked={serviceType == 2 ? true : false}
                    checkedIcon={globalImagePath.selectRadio}
                    uncheckedIcon={globalImagePath.nonSelectRadio}
                    marginRight={10}
                    fontSize={14}
                    onPress={() => { Keyboard.dismiss(); selectService(2) }}
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    placeholder=""
                    title={I18n.t('lbl_both')}
                    checked={serviceType == 3 ? true : false}
                    checkedIcon={globalImagePath.selectRadio}
                    uncheckedIcon={globalImagePath.nonSelectRadio}
                    marginRight={10}
                    fontSize={14}
                    onPress={() => { Keyboard.dismiss(); selectService(3) }}
                  />
                </View>
              </View>
            </View>

            <View style={{ marginTop: 10, borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5, }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_enter_location')}</Text>
              </View>
              <TouchableOpacity onPress={() => { showMapView() }} style={{ width: '95%', flexDirection: 'row', height: 50, alignItems: 'center' }}>
                <Text style={{
                  borderRadius: 5,
                  paddingRight: 15,
                  color: placeName ? "#000" : "rgb(183,190,197)",
                  fontSize: 14,
                  textAlign: 'left'
                }}>
                  {placeName ? placeName : "Location"}
                </Text>
                <Image source={globalImagePath.locationIcon} resizeMode="cover" style={{ alignSelf: 'center', height: 24, width: 20 }} />
              </TouchableOpacity>

            </View>
            <ErrorMessage text={placeNameError} />

            <View style={{}}>
              <TextInput
                textAlignVertical={'top'}
                height={100}
                isPlaceHolder={true}
                placeholder={I18n.t('lbl_description')}
                isLevelShow={true}
                level={I18n.t('lbl_description')}
                error={descriptionError}
                onChangeText={description => { setDescription(description); setDescriptionError(validate("description", description, "", true)); }}
                value={description}
              />
            </View>

            {/* <TextInput
              showIcon={true}
              isPlaceHolder={true}
              placeholder={'Enter Service Name'}
              isLevelShow={true}
              level={I18n.t('lbl_service_name')}
              error={serviceNameError}
              onChangeText={serviceName => { setServiceName(serviceName); setServiceNameError(validate("service_name", serviceName, "", true)); }}
              value={serviceName}
            /> */}
            <CheckBox
              style={{ flex: 1, marginVertical: 20 }}
              onClick={() => { setIsChecked(!isChecked) }}
              isChecked={isChecked}
              rightText={I18n.t('lbl_cancel_charge')}
            />
            {isChecked ?
              <TextInput
                showIcon={true}
                isPlaceHolder={true}
                placeholder={'SAR 20.00'}
                isLevelShow={true}
                level={I18n.t('lbl_cancel_charge')}
                keyboardType={'numeric'}
                error={priceError}
                onChangeText={price => { setPrice(price); setPriceError(validate("price", price, "", true)); }}
                value={`${price}`}
              /> : null
            }

            {/* <View style={{ marginTop: 10, marginBottom: 10, }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_country')}</Text>
              </View>
              <View style={{ flexDirection: 'row', borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5, }}>
                <RNPicker
                  ifCountry={true}
                  dataSource={countries}
                  dummyDataSource={countries}
                  defaultValue={selectCountry != "" ? true : false}
                  pickerTitle={'hello'}
                  showSearchBar={true}
                  searchBarPlaceHolder={'jjjjjj'}
                  disablePicker={countries.length > 0 ? false : true}
                  changeAnimation={"none"}
                  searchBarPlaceHolder={I18n.t('lbl_search_country')}
                  showPickerTitle={false}
                  selectedLabel={selectCountry}
                  placeHolderLabel={'adfas'}
                  placeholderColor={'#4782c5'}
                  selectedValue={(index, item) =>
                    onSelectLanguage(item, index)
                  }
                  selectedId={countries}
                  value={selectCountry}
                />
              </View>

              {countryError ? <ErrorMessage text={countryError} /> : null}
            </View> */}
            <View style={{}}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_working_hours')}</Text>
              </View>
              <View>
                <View style={{ flex: 1, marginTop: 15 }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={timeSlot}
                    renderItem={({ item, index }) =>
                      renderTimeSlots(item, index)
                    }
                    keyExtractor={(item, index) => String(index)}
                  />

                </View>
              </View>
            </View>

            <View style={{ marginTop: 20, marginBottom: 10 }}>
              <Button
                label={I18n.t('lbl_submit')}
                textSize={16}
                onPress={() => { changePass() }}
              />
            </View>

          </View>
        </View>
      </Content>

    </Container>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  weekDays: {
    paddingHorizontal: 5,
    fontSize: 16,
    color: colors.darkShade,
    fontFamily: fonts.type.NunitoSans_bold,
    textAlign: 'center'
  },
  Amtime: {
    paddingLeft: 15,
    //  paddingVertical: 20,
    //marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightThemeColor,
  },
  pmTime: {
    paddingLeft: 15,
    //paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightThemeColor,
  },
  timeText: {
    fontSize: 14,
    color: 'rgb(212,212,212)',
    fontFamily: fonts.type.NunitoSans_bold
  },
  toText: {
    fontSize: 12,
    color: colors.darkShade,
    fontFamily: fonts.type.NunitoSans_bold
  },
  image: {
    height: width * (80 / 375),
    width: width * (92 / 375),
    borderTopLeftRadius: width * (10 / 375),
    borderTopRightRadius: width * (10 / 375),
    borderBottomLeftRadius: width * (10 / 375),
    borderBottomRightRadius: width * (10 / 375),
    borderRadius: 5,
    marginRight: 6,
    // borderWidth: 0.2,
    zIndex: 1
  },
};
