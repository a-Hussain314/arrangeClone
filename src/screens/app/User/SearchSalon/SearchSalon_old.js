import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {Container, Content} from 'native-base';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {height, width} from '../../../../constants/screenSize';
import {colors, fonts} from '../../../../Theme';
import {globalImagePath} from '../../../../constants/globalImagePath';
import {style} from './style';
import NavBar from '../../../../components/NavBar';
import {getService} from '../../../../services/getServices';
import {postService} from '../../../../services/postServices';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../../components/Loader';
import {showToast} from '../../../../components/ToastMessage';
export default function SearchSalon({navigation, route}) {
  let onEndReachedCalledDuringMomentum = true;
  const [toggle, setToggle] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [curruntLatLng, setCurruntLatLng] = React.useState('');
  const [recommendSalon, setRecommendSalon] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [pageNo, setPageNo] = React.useState(1);
  const [listTitle, setListTitle] = React.useState('lbl_recommended_salon');
  const [coordinate, setCoordinate] = React.useState([
    {
      longitude: 55.405403,
      latitude: 25.348766,
    },
    {
      longitude: 54.366669,
      latitude: 24.466667,
    },
  ]);

  React.useEffect(() => {
    AsyncStorage.getItem('curruntLocation').then((item) => {
      var locationDetails = JSON.parse(item);
      if (locationDetails) {
        setCurruntLatLng(locationDetails);
      }
    });

    let title = route.params && route.params.title;
    if (title) {
      setListTitle(title);
      setToggle(false);
    }
  }, [navigation]);

  React.useEffect(() => {
    getSalonList();
  }, [curruntLatLng]);

  //***** For home screen information */
  function getSalonList() {
    setLoading(true);
    const data = {
      keyword: search,
      latitude: curruntLatLng.latitude,
      longitude: curruntLatLng.longitude,
      page: pageNo,
    };
    console.log('getSalonList data', data);

    //***** api calling */
    postService('salonlist', data)
      .then((res) => {
        setLoading(false);
        console.log('res.data =>', res.data);
        if (res.data.status === 1) {
          setLoading(false);
          setRefreshing(false);
          if (!res.data.response) {
            showToast(res.data.message);
          }
          let data = res.data.response.records ? res.data.response.records : [];
          setRecommendSalon(data);
        } else {
          setLoading(false);
          setRefreshing(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  }

  // Render recommand salon
  const recommandSalon = (item, index) => {
    return (
      <TouchableOpacity
        style={style.renderOuterView}
        onPress={() =>
          navigation.navigate('SalonDetails', {
            salonId: item._id,
          })
        }>
        <View style={{alignItems: 'center'}}>
          <Image
            source={
              item.banner_salon
                ? {
                    uri:
                      'https://35.208.113.133:17345/public/uploads/salonbanners/' +
                      item.banner_salon,
                  }
                : globalImagePath.default_img
            }
            style={style.image}
            resizeMode={'cover'}
          />
        </View>
        <View style={style.treatmentOptionTitle_1}>
          <Text style={style.titleText} numberOfLines={1}>
            {item.salon_name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={style.ratingOuter}>
              <View style={style.sterImg}>
                <Image source={globalImagePath.star} style={{}} />
              </View>
              <View>
                <Text style={style.rateText}>{item.rating}</Text>
              </View>
            </View>
            <View style={style.reviewView}>
              <Text style={style.reviewText}>{item.review + ' reviews'}</Text>
            </View>
          </View>
          <View style={style.locationOuter}>
            <View style={style.locationImg}>
              <Image
                source={globalImagePath.locationIcon}
                style={style.starImg}
              />
            </View>
            <View>
              <Text style={style.locationText}>
                {item.distance && item.distance.toFixed(1) + ' KM'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const _renderToggle = (val) => {
    setToggle(val);
  };

  const emptyComponent = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={{}}>oops! There's no data here!</Text>
      </View>
    );
  };

  const onRefresh = () => {
    console.log('call onRefresh');
    setRefreshing(true);
    setPageNo(1);
    getSalonList();
  };

  const onReached = () => {
    console.log('call onReached');
    setRefreshing(true);
    setPageNo(pageNo + 1);
    getSalonList();
  };

  const _renderFooter = () => {
    if (!refreshing) return null;

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

  return (
    <Container style={{flex: 1, backgroundColor: 'rgba(255,255,255 0.1)'}}>
      <Loader loading={loading} />
      {toggle == false ? (
        <View style={{flex: 1}}>
          <View
            style={{
              borderRadius: 5,
              marginHorizontal: 20,
              paddingHorizontal: 20,
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.whiteColor,
            }}>
            <View style={{flex: 1, height: 50}}>
              <TextInput
                autoCorrect={false}
                placeholder={'Search'}
                onChangeText={(value) => setSearch(value)}
                defaultValue={search}
                style={{
                  fontFamily: fonts.type.NunitoSans_Regular,
                  borderRadius: 5,
                  marginTop: 4,
                  paddingHorizontal: 15,
                  height: 50,
                  color: 'rgb(38, 38, 38)',
                  fontSize: 14,
                  flex: 1,
                }}
              />
            </View>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() => {
                getSalonList();
              }}>
              <Image
                source={globalImagePath.LeftArrow}
                style={{height: 20, width: 20}}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>

          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                paddingHorizontal: 15,
                alignSelf: 'center',
              }}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.type.NunitoSans_bold,
                  }}>
                  {I18n.t(listTitle)}
                </Text>
              </View>
            </View>
            <View style={{flex: 1}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={recommendSalon}
                renderItem={({item, index}) => recommandSalon(item, index)}
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
                ListEmptyComponent={emptyComponent()}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              zIndex: 99,
              position: 'absolute',
              borderRadius: 5,
              marginHorizontal: 20,
              paddingHorizontal: 20,
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.whiteColor,
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={globalImagePath.search}
                style={{height: 20, width: 20}}
                resizeMode={'cover'}
              />
            </View>
            <View style={{flex: 1, height: 50}}>
              <TextInput
                placeholder={'Search'}
                style={{
                  fontFamily: fonts.type.NunitoSans_Regular,
                  borderRadius: 5,
                  marginTop: 4,
                  paddingHorizontal: 15,
                  height: 50,
                  color: 'rgb(38, 38, 38)',
                  fontSize: 14,
                  flex: 1,
                }}></TextInput>
            </View>
            <View style={{alignItems: 'center'}}>
              <Image
                source={globalImagePath.LeftArrow}
                style={{height: 20, width: 20}}
                resizeMode={'cover'}
              />
            </View>
          </View>

          {curruntLatLng ? (
            <MapView
              style={{flex: 1, zIndex: -1}}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: curruntLatLng.latitude,
                longitude: curruntLatLng.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              {recommendSalon.map(
                (ele) =>
                  ele.location && (
                    <MapView.Marker
                      coordinate={{
                        latitude: ele.location[1],
                        longitude: ele.location[0],
                      }}
                      // title={'arrange'}
                      image={globalImagePath.location_marker}
                      description={'marker.description'}>
                      <MapView.Callout
                        tooltip={true}
                        style={{
                          flex: -1,
                          position: 'absolute',
                          minWidth: 150,
                          minHeight: 60,
                        }}
                        onPress={() =>
                          navigation.navigate('SalonDetails', {
                            salonId: ele._id,
                          })
                        }>
                        <View style={style.marker_renderOuterView}>
                          <View
                            style={{
                              backgroundColor: '#fff',
                              borderRadius: 10,
                              flexDirection: 'row',
                              flex: 1,
                              paddingVertical: 12,
                              paddingHorizontal: 8,
                            }}>
                            <Text style={{textAlign: 'center'}}>
                              <Image
                                source={globalImagePath.bg}
                                style={style.marker_image}
                                resizeMode="cover"
                              />
                            </Text>

                            <View style={{flex: 1, marginLeft: 20}}>
                              <View style={{}}>
                                <Text
                                  style={{
                                    fontWeight: 'bold',
                                    color: '#000',
                                    fontSize: 14,
                                  }}>
                                  {ele.salon_name}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginVertical: 10,
                                }}>
                                <View style={style.marker_ratingOuter}>
                                  <Text>
                                    {' '}
                                    <Image
                                      source={globalImagePath.star}
                                      style={{}}
                                    />
                                  </Text>

                                  <View>
                                    <Text style={style.rateText}>
                                      {ele.rating}
                                    </Text>
                                  </View>
                                </View>
                                <View style={style.reviewView}>
                                  <Text style={style.reviewText}>
                                    {ele.review + ' reviews'}
                                  </Text>
                                </View>
                              </View>
                              <View style={{}}>
                                <View style={style.marker_locationOuter}>
                                  <Text style={style.locationImg}>
                                    <Image
                                      source={globalImagePath.locationIcon}
                                      style={style.starImg}
                                    />
                                  </Text>
                                  <View>
                                    <Text style={style.locationText}>
                                      {ele.distance &&
                                        ele.distance.toFixed(1) + ' KM'}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </MapView.Callout>
                    </MapView.Marker>
                  ),
              )}
            </MapView>
          ) : null}
        </View>
      )}
      <View style={{position: 'absolute', bottom: 20, right: 20}}>
        {toggle == false ? (
          <TouchableOpacity
            onPress={() => {
              _renderToggle(true);
            }}>
            <Image
              source={globalImagePath.mapFloatIcon}
              style={{}}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        ) : null}
        {toggle == true ? (
          <TouchableOpacity
            onPress={() => {
              _renderToggle(false);
            }}>
            <Image
              source={globalImagePath.listIcon}
              style={{}}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </Container>
  );
}