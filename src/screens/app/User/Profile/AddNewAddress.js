//***** import libraries */
import React from 'react';
import { Text, View, Image, FlatList } from 'react-native';
import Button from '../../../../components/Button';
import { Container, Content } from 'native-base';
import { postService } from '../../../../services/postServices';

import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import { colors, fonts, matrics } from '../../../../Theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { height, width } from '../../../../constants/screenSize';
import I18n from '../../../../I18n';
import { CommonStyles } from '../../../../assets/css';
import ErrorMessage from '../../../../components/ErrorMessage';
import TextInput from '../../../../components/TextInput';
import GoogleSearchInput from '../../../../components/googleSearchPlaceModal';
import validate from '../../../../components/Validations/validate_wrapper';
import { showToast, showDangerToast } from '../../../../components/ToastMessage';
import Geolocation from '@react-native-community/geolocation';

export default function ManageAddress({ route, navigation }) {
  const [isAddressUpdate, setIsAddressUpdate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [placeName, setPlaceName] = React.useState('');
  const [currentLat, setCurrentLat] = React.useState('');
  const [currentLng, setCurrentLng] = React.useState('');
  const [lat, setLat] = React.useState('');
  const [lng, setLng] = React.useState('');
  const [tag, set] = React.useState('');
  const [placeNameError, setPlaceNameError] = React.useState(false);
  const [searchModal, setSearchModal] = React.useState(false);
  const [landmark, setLandmark] = React.useState(false);
  const [landmarkError, setLandmarkError] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState(1);
  const [edit, setEdit] = React.useState(false);
  const [treatmentCategory, setTreatmentCategory] = React.useState([
    { title: 'Home', active: true, value: 1 },
    { title: 'Office', active: false, value: 2 },
    { title: 'Other', active: false, value: 3 },
  ]);

  React.useEffect(() => {
    let id = route.params && route.params.addressId;
    if (id) {
      getAddress(route.params.addressId);
      setEdit(true);
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setCurrentLat(position.coords.latitude);
          setCurrentLng(position.coords.longitude);
        },
        (error) => console.log('error.message =>', error.message),
        // { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
      );
    }
  }, []);

  React.useEffect(() => {
    if (route.params?.selectedAddress) {
      selectLocation();
    }
  }, [route.params?.selectedAddress]);

  const getAddress = (id) => {
    const data = {
      _id: id,
    };
    // ***** api calling */
    postService('address/getaddress', data)
      .then((res) => {
        console.log('getAddress result = ', res.data);

        if (res.data.status === 1) {
          setLoading(false);
          setPlaceName(res.data.response.address);
          setLandmark(res.data.response.landmark);
          setCurrentLat(
            res.data.response.location &&
              res.data.response.location.coordinates[1]
              ? res.data.response.location.coordinates[1]
              : res.data.response.lat,
          );
          setCurrentLng(
            res.data.response.location &&
              res.data.response.location.coordinates[0]
              ? res.data.response.location.coordinates[0]
              : res.data.response.lng,
          );
          setLat(
            res.data.response.location &&
              res.data.response.location.coordinates[1]
              ? res.data.response.location.coordinates[1]
              : res.data.response.lat,
          );
          setLng(
            res.data.response.location &&
              res.data.response.location.coordinates[0]
              ? res.data.response.location.coordinates[0]
              : res.data.response.lng,
          );
          // setActiveCategory(res.data.response.tag_location);
          if (res.data.response.tag_location == 1) {
            handleCategory('', 0, res.data.response.tag_location);
          } else if (res.data.response.tag_location == 2) {
            handleCategory('', 1, res.data.response.tag_location);
          } else if (res.data.response.tag_location == 3) {
            handleCategory('', 2, res.data.response.tag_location);
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

  const addAddress = () => {
    //***** For validate input fields */

    const landmark_error = validate('landmark', landmark);
    const placeName_errr = placeName == '' ? I18n.t('lbl_select_location') : '';
    setLandmarkError(landmark_error);
    setPlaceNameError(placeName_errr);
    if (landmark_error || placeName_errr) {
    } else {
      if (lat == '' || lng == '') {
        showDangerToast('Please choose proper address');
        return;
      }

      setLoading(true);
      let data = {
        address: placeName,
        latitude: lat,
        longitude: lng,
        landmark: landmark,
        tag_location: activeCategory,
        _id: route.params && route.params.addressId,
      };

      let apiName = edit ? 'address/edit' : 'address/manage';

      // ***** api calling */
      postService(apiName, data)
        .then((res) => {
          console.log('add address res ==> ', res);
          if (res.data.status === 1) {
            setLoading(false);
            showToast(res.data.message);
            navigation.navigate('ManageAddress');
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

  // Render offers subcategory
  const _renderTreatmentCategory = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleCategory(item.title, index, item.value);
        }}
        style={item.active ? styles.deleteBtn_2 : styles.deleteBtn}>
        <Text style={item.active ? styles.btnText_2 : styles.btnText}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  // Handle Offers subcategory selection
  const handleCategory = (title, index, value) => {
    let Arr = treatmentCategory;
    for (var i = 0; i < Arr.length; i++) {
      if (i == index) {
        Arr[i].active = true;
        // console.log("value =>", value);
        setActiveCategory(value);
      } else {
        Arr[i].active = false;
      }
    }
    setTreatmentCategory(Arr);
    // console.log("index of selected option ", index);
  };

  const _getPlaceValue = (placeVal, lat, lng) => {
    setSearchModal(false);
    setPlaceName(placeVal);
    setLat(lat);
    setLng(lng);
  };

  const _setTag = (num) => {
    setTag(num);
  };

  const showMapView = () => {
    setIsAddressUpdate(true);
    navigation.navigate('LocationPicker', {
      screenName: 'AddNewAddress',
      currentLat: currentLat,
      currentLong: currentLng,
    });
  };

  const selectLocation = () => {
    console.log('navigation  ==> ', route);
    console.log('route params ==> ', route.params); //navigation
    console.log('navigation 2  ==> ', navigation);
    setPlaceName(
      route.params && route.params.selectedAddress
        ? route.params.selectedAddress.address
        : '',
    );
    setCurrentLat(
      route.params && route.params.selectedAddress
        ? route.params.selectedAddress.latitude
        : currentLat,
    );
    setCurrentLng(
      route.params && route.params.selectedAddress
        ? route.params.selectedAddress.longitude
        : currentLng,
    );
    setLat(
      route.params && route.params.selectedAddress
        ? route.params.selectedAddress.latitude
        : '',
    );
    setLng(
      route.params && route.params.selectedAddress
        ? route.params.selectedAddress.longitude
        : '',
    );
    setPlaceNameError(
      isAddressUpdate
        ? placeName == ''
          ? I18n.t('err_select_location')
          : ''
        : '',
    );
  };

  //***** For rendering UI */
  return (
    <Container>
      <Loader loading={loading} />
      <GoogleSearchInput
        visible={searchModal}
        _placeValue={(value, lat, lng) => _getPlaceValue(value, lat, lng)}
        _goBack={() => {
          setSearchModal(false);
        }}
      />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        title={I18n.t('lbl_manage_address')}
        isCenterImage={false}
        centerText={
          edit ? I18n.t('lbl_update_address') : I18n.t('lbl_manage_address')
        }
        navigation="HomePage"
        titleTop={''}
      />

      <Content
        enableResetScrollToCoords={false}
      //enableOnAndroid={true}
      >
        <View style={styles.container}>
          <View
            style={{ borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...CommonStyles.InputLabelStyle() }}>
                {I18n.t('lbl_enter_location')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                showMapView();
              }}
              style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
              <Text
                style={{
                  borderRadius: 5,
                  // paddingHorizontal: 15,
                  color: placeName ? '#000' : 'rgb(183,190,197)',
                  fontSize: 14,
                  flex: 1,
                }}>
                {placeName ? placeName : I18n.t('lbl_enter_location')}
              </Text>
              <Image
                source={globalImagePath.locationIcon}
                resizeMode="cover"
                style={{ alignSelf: 'center', height: 24, width: 20 }}
              />
            </TouchableOpacity>
          </View>
          <ErrorMessage text={placeNameError} />
          <TextInput
            isPlaceHolder={true}
            placeholder={I18n.t('lbl_landmark')}
            isLevelShow={true}
            level={I18n.t('lbl_landmark')}
            error={landmarkError}
            onChangeText={(landmark) => {
              setLandmark(landmark);
              setLandmarkError(validate('landmark', landmark));
            }}
            value={landmark}
          />
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: 'rgb(110,118,130)' }}>
              {I18n.t('lbl_tag_location')}
            </Text>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={treatmentCategory}
              renderItem={({ item, index }) =>
                _renderTreatmentCategory(item, index)
              }
              keyExtractor={(item, index) => String(index)}
            />
          </View>
          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Button
              label={edit ? I18n.t('lbl_update') : I18n.t('lbl_add')}
              textSize={16}
              onPress={() => {
                addAddress();
              }}
            />
          </View>
        </View>
      </Content>
    </Container>
  );
}

//***** Define style */
const styles = {
  container: {
    paddingHorizontal: width * (20 / 375),
  },
  deleteBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.themeColor,
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  deleteBtn_2: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.whiteColor,
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: colors.themeColor,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  btnText: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (12 / 375),
    color: colors.themeColor,
  },
  btnText_2: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (12 / 375),
    color: colors.whiteColor,
  },
};
