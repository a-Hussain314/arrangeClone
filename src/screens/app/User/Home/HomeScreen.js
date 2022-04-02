import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert
} from 'react-native';
import { Container, Content } from 'native-base';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { style } from './style';
import NavBar from '../../../../components/NavBar';
import { postService } from '../../../../services/postServices';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import Loader from '../../../../components/Loader';
import { getService } from '../../../../services/getServices';
import { USER_HOME_BANNER_URL, USER_HOME_SERVICE_URL, USER_HOME_SALON_URL, SALON_OFFERS } from '../../../../utils/constants';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../../../contexts/AuthContext';
import { useAuth } from '../../../../hooks/useAuth';
export default function HomeScreen({ navigation, route }) {

  const isFocused = useIsFocused();
  const [image, setImage] = React.useState('');
  const [homeData, setHomeData] = React.useState('');
  const [backCount, setBackCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [activeListing, setActiveListing] = React.useState(0);
  const [bannerData, setBannerData] = React.useState([]);
  const [treatmentCategory, setTreatmentCategory] = React.useState([]);
  const [recommendSalon, setRecommendSalon] = React.useState([]);
  const [topRatedSalon, setTopRatedSalon] = React.useState([]);
  const [name, setName] = React.useState('');

  React.useEffect(() => {

    getHomeData();
    getUserProfileDetails();
  }, [isFocused]);

  React.useEffect(() => {

  }, [route.params])

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
          let data = res.data.response;
          setName(data.first_name);
          setImage(data.salon_logo_url + data.profile);

        } else {

          var message = '';
          res?.data?.errors?.map((val) => {
            message += Object.values(val) + ' '
          })
          setTimeout(function () {
            showDangerToast(message != null ? message : res.data.message);
          }, 100);
        }
      })
      .catch(error => {

        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };

  //***** For home screen information */
  const getHomeData = () => {
    setLoading(true);
    //***** api calling */
    postService('home')
      .then(res => {
        if (res.data.response) {
          let data = res.data.response;
          // console.log("home data", data);

          setBannerData(data.banner);
          setTreatmentCategory(data.service);
          setRecommendSalon(data.recommended);
          setTopRatedSalon(data.top_rated)
          setLoading(false);
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
  const renderItem = ({ item, index }) => {

    return (
      <>
        <View style={style.sliderContainer}>
          <Image source={{ uri: USER_HOME_BANNER_URL + item.image }} style={style.sliderImg} resizeMode={'contain'} />
        </View>
      </>
    );
  };

  // slider bottom dots
  const pagination = () => {
    return (
      <Pagination
        dotsLength={bannerData.length}
        activeDotIndex={activeSlide}
        containerStyle={style.dotContainer}
        dotStyle={style.activeDot}
        inactiveDotStyle={style.inactiveDot}
      />
    );
  };

  // Render offers subcategory
  const _renderCategory = (item, index) => {

    return (
      <TouchableOpacity
        onPress={() => {
          handleCategory(item.service_name, index, item);
        }}
        style={{
          marginRight: width * 0.02,
          marginTop: 5,
          marginBottom: 5,

          // marginLeft: index == 0 ? 0 : width * 0.02,
        }}>
        <View
          style={[
            style.treatmentOption,
            { backgroundColor: item.active ? colors.darkShade : colors.moreLight },

          ]}>
          <Image source={{ uri: USER_HOME_SERVICE_URL + item.icon }} style={item.active ? style.treatmentOptionImg_2 : style.treatmentOptionImg} />
          <View style={style.treatmentOptionTitle}>
            <Text numberOfLines={1} style={[style.treatmentTitle, { color: item.active ? colors.whiteColor : colors.darkShade }]}>{item.service_name}</Text>
          </View>
        </View>

      </TouchableOpacity>
    );
  };

  // Render recommand salon
  const recommandSalon = (item, index) => {

    if (index < 10) {
      return (
        <TouchableOpacity style={style.renderOuterView} onPress={() => navigation.navigate('SalonDetails', {
          salonId: item._id
        })}>
          <View style={{ alignItems: 'center', }}>
            <Image source={{ uri: USER_HOME_SALON_URL + item.banner_salon }} style={style.image} resizeMode={'cover'} />
          </View>
          <View style={style.treatmentOptionTitle_1}>
            <Text style={style.titleText} numberOfLines={1}>{item.salon_name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={style.ratingOuter}>
                <View style={style.sterImg}>
                  <Image source={globalImagePath.star} style={{}} />
                </View>
                <View>
                  <Text style={style.rateText}>{item.rating}</Text>
                </View>
              </View>
              <View style={style.reviewView}>
                <Text style={style.reviewText}>{item.reviews + ' ' + I18n.t('lbl_reviews')}</Text>
              </View>
            </View>
            <View style={style.locationOuter}>
              <View style={style.locationImg}>
                <Image source={globalImagePath.locationIcon} style={style.starImg} />
              </View>
              <View >
                <Text style={style.locationText}>{`${item.distance}` + ' ' + I18n.t('lbl_KM')}</Text>
              </View>
            </View>
          </View>

        </TouchableOpacity>
      )
    }
  };

  // Render toprated salon
  const _topRatedSalon = (item, index) => {

    if (index < 10) {
      return (
        <TouchableOpacity style={style.renderOuterView} onPress={() => navigation.navigate('SalonDetails', {
          salonId: item._id
        })}>
          <View style={{ alignItems: 'center', }}>
            <Image source={{ uri: USER_HOME_SALON_URL + item.banner_salon }} style={style.image} resizeMode={'cover'} />
          </View>
          <View style={style.treatmentOptionTitle_1}>
            <Text style={style.titleText} numberOfLines={1}>{item.salon_name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={style.ratingOuter}>
                <View style={style.sterImg}>
                  <Image source={globalImagePath.star} style={{}} />
                </View>
                <View>
                  <Text style={style.rateText}>{item.rating}</Text>
                </View>
              </View>
              <View style={style.reviewView}>
                <Text style={style.reviewText}>{item.reviews + ' ' + I18n.t('lbl_reviews')}</Text>
              </View>
            </View>
            <View style={style.locationOuter}>
              <View style={style.locationImg}>
                <Image source={globalImagePath.locationIcon} style={style.starImg} />
              </View>
              <View >
                <Text style={style.locationText}>{`${item.distance}` + ' ' + I18n.t('lbl_KM')}</Text>
              </View>
            </View>
          </View>

        </TouchableOpacity>
      );
    }
  };
  // Handle Offers subcategory selection
  const handleCategory = (title, index, item) => {
    let Arr = treatmentCategory;
    for (var i = 0; i < Arr.length; i++) {
      if (i == index) {
        Arr[i].active = true;
        setActiveCategory(title);
        setTreatmentCategory(Arr);

        navigation.navigate('SalonServiceList', {
          serviceDetails: item
        });
      } else {
        Arr[i].active = false;
      }
    }

    // console.log("index of selected option ", index);
  };


  const backAction = () => {

    Alert.alert(
      '',
      I18n.t('lbl_closeApp_confirmation'), [
      {
        text: I18n.t('lbl_cancel'),
        onPress: () => null,
        style: "cancel"
      },
      { text: I18n.t('lbl_ok'), onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled()) {
          disableSelectionMode();
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener("hardwareBackPress", backAction);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);

    }, [])
  );

  return (

    <Container style={{ backgroundColor: 'rgba(255,255,255 0.1)' }} >
      <Loader loading={loading} />
      <AuthContext.Consumer>
        {
          (context) =>
            <NavBar
              textColor={'black'}
              isLeftIconUrl={true}
              leftIcon={image}
              navigator={navigation}
              backgroundColor={colors.white}
              // centerImg={''}
              notifyCount={global.notifyCount == 0 ? 0 : context.notificationCount}
              rightImage={globalImagePath.notification}
              navigation="HomePage"
              centerText={name}
            />
        }
      </AuthContext.Consumer>

      <Content>
        <View style={style.carouselContainer}>
          {console.log("🚀🚀🚀",bannerData)}
          <Carousel
            data={bannerData}
            renderItem={item => renderItem(item)}
            onSnapToItem={index => setActiveSlide(index)}
            sliderWidth={width}
            itemWidth={width}
            autoplay={false}
            autoplayDelay={100}
            enableSnap={true}
            loop={true}
          />
        </View>
        <View style={style.paginationContainer}>{pagination()}</View>
        <View style={{ paddingHorizontal: 10, }}>
          <FlatList
            numColumns={4}
            data={treatmentCategory}
            renderItem={({ item, index }) =>
              _renderCategory(item, index)
            }
            keyExtractor={(item, index) => String(index)}
          />
        </View>

        <View>
          <View style={{ flexDirection: 'row', marginTop: 20, paddingHorizontal: 15 }}>
            <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.type.NunitoSans_bold }}>{I18n.t('lbl_recommended_salon')}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              navigation.navigate('SearchSalon', {
                title: 'lbl_recommended_salon'
              })
            }} style={{ flex: 0.3, alignItems: 'flex-end', }}>
              <Text style={{ fontFamily: fonts.type.NunitoSans_bold, textDecorationLine: "underline", fontSize: 14, color: colors.themeColor }}>{I18n.t('lbl_view_all')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal={true}
            data={recommendSalon}
            renderItem={({ item, index }) =>
              recommandSalon(item, index)
            }
            keyExtractor={(item, index) => String(index)}
          />
        </View>
        <View>
          <View style={{ flexDirection: 'row', marginTop: 20, paddingHorizontal: 15 }}>
            <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.type.NunitoSans_bold }}>{I18n.t('lbl_top_rate_salon')}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              navigation.navigate('RecommendAndTopSalonList', {
                title: 'lbl_top_rate_salon'
              })
            }} style={{ flex: 0.3, alignItems: 'flex-end', }}>
              <Text style={{ fontFamily: fonts.type.NunitoSans_bold, textDecorationLine: "underline", fontSize: 14, color: colors.themeColor }}>{I18n.t('lbl_view_all')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal={true}
            data={topRatedSalon}

            renderItem={({ item, index }) =>
              _topRatedSalon(item, index)
            }
            keyExtractor={(item, index) => String(index)}
          />
        </View>
      </Content>

    </Container>
  );
}
