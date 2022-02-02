import React, { Component } from 'react';
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
    ActivityIndicator
} from 'react-native';
import { Container, Content } from 'native-base';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { style } from './style';
import NavBar from '../../../../components/NavBar';
import { getService } from '../../../../services/getServices';
import { postService } from '../../../../services/postServices';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/ToastMessage';
import { useIsFocused } from "@react-navigation/native";
import { check, PERMISSIONS, openSettings } from "react-native-permissions";
import { USER_HOME_SALON_URL } from '../../../../utils/constants';
var pageNo = 1;
export default function SearchSalon({ navigation, route }) {
    let onEndReachedCalledDuringMomentum = true;
    const isFocused = useIsFocused();
    const [loading, setLoading] = React.useState(false);
    const [curruntLatLng, setCurruntLatLng] = React.useState('');
    const [recommendSalon, setRecommendSalon] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [refreshing, setRefreshing] = React.useState(false);
    const [loadMore, setLoadMore] = React.useState(false);
    //  const [pageNo, setPageNo] = React.useState(1);
    const [imageUrl, setImageUrl] = React.useState('');
    const [listTitle, setListTitle] = React.useState('lbl_recommended_salon')

    React.useEffect(() => {
        pageNo = 1;
        checkLocationPermission();
        let title = route.params && route.params.title;
        if (title) {
            setListTitle(title);
        }
    }, [isFocused]);

    const checkLocationPermission = () => {
        console.log("call 3");
        if (Platform.OS == "ios") {
            console.log("call 4");
            check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
                if (result == "blocked" || result == "denied" || result == "unavailable") {
                    if (global.lat) {
                        let curruntLocation = {
                            latitude: global.lat,
                            longitude: global.lng,
                        }
                        setCurruntLatLng(curruntLocation);
                    } else {
                        Alert.alert(
                            "",
                            "Arrange would like to access your location",
                            [
                                {
                                    text: "Not Now",
                                    onPress: () => console.log("Cancel Pressed!")
                                },
                                {
                                    text: "Open Settings",
                                    onPress: () => openSettings()
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                } else {
                    getCurrentLocation();
                }
            });
        } else if (Platform.OS == "android") {
            console.log("call 5");
            check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
                if (result == "blocked" || result == "denied") {
                    if (global.lat) {
                        let curruntLocation = {
                            latitude: global.lat,
                            longitude: global.lng,
                        }
                        setCurruntLatLng(curruntLocation);
                    } else {
                        Alert.alert(
                            "",
                            "Arrange would like to access your location",
                            [
                                {
                                    text: "Not Now",
                                    onPress: () => console.log("Cancel Pressed!")
                                },
                                {
                                    text: "Open Settings",
                                    onPress: () => openSettings()
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                } else {
                    getCurrentLocation();
                }
            });
        }
    }
    const getCurrentLocation = () => {
        console.log("call 6");
        Geolocation.getCurrentPosition(
            //Will give you the current location
            async (position) => {
                console.log("call 7");
                global.lat = position.coords.latitude;
                global.lng = position.coords.longitude;
                let curruntLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,

                }
                setCurruntLatLng(curruntLocation);
            },
            (error) => {
                console.log("call 8");
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 10000
            },
        );
    }

    React.useEffect(() => {
        getSalonList(true)
    }, [curruntLatLng])

    //***** For home screen information */
    function getSalonList(val) {
        setLoading(val);
        const data = {
            keyword: search,
            latitude: curruntLatLng.latitude,
            longitude: curruntLatLng.longitude,
            page: pageNo,
        }


        //***** api calling */
        postService('salonlist', data)
            .then(res => {
                setLoading(false);
                //console.log("res.data top rated=> Recommendeandtopsalon", res.data.response);
                if (res.data.status === 1) {
                    setLoading(false);
                    setRefreshing(false);
                    if (!res.data.response) {
                        showToast(res.data.message)
                    }
                    setImageUrl(res.data.response.banner_salon_url);
                    // let data = res.data.response.records ? res.data.response.records : [];
                    // setRecommendSalon(data);
                    let data = res.data.response;
                    if (pageNo == 1) {
                        setRecommendSalon([...data.records]);
                    } else {
                        data && data.records ? setRecommendSalon([...recommendSalon, ...data.records]) : setRecommendSalon([...recommendSalon]);
                    }


                } else {
                    setLoading(false);
                    setRefreshing(false);
                    setTimeout(function () {
                        showDangerToast(res.data.message);
                    }, 100);
                }
            })
            .catch(error => {
                setLoading(false);
                setRefreshing(false);
                setTimeout(function () {
                    alert(error);
                }, 100);
            });
    };

    // Render recommand salon
    const recommandSalon = (item, index) => {

        return (
            <TouchableOpacity style={style.list_renderOuterView} onPress={() => navigation.navigate('SalonDetails', {
                salonId: item._id
            })}>
                <View style={{ alignItems: 'center', }}>
                    <Image source={item.banner_salon ? { uri: imageUrl + item.banner_salon } : globalImagePath.default_img} style={style.list_image} resizeMode={'cover'} />
                </View>
                <View style={style.treatmentOptionTitle_list}>
                    <Text style={style.titleText_list} numberOfLines={1}>{item.salon_name}</Text>
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
                            <Text style={style.reviewText}>{item.review + ' reviews'}</Text>
                        </View>
                    </View>
                    <View style={style.locationOuter}>
                        <View style={style.locationImg}>
                            <Image source={globalImagePath.locationIcon} style={style.starImg} />
                        </View>
                        <View >
                            <Text style={style.locationText}>{item.distance && item.distance.toFixed(1) + ' KM'}</Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        );
    };



    const emptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{}}>{I18n.t('lbl_no_data')}</Text>
            </View>
        );
    };

    const onRefresh = () => {
        console.log("call onRefresh");
        setRefreshing(true);
        pageNo = 1;
        getSalonList(false);
    };

    const onReached = () => {
        console.log("call onReached");
        setLoadMore(true);
        pageNo = parseInt(pageNo) + 1;
        getSalonList(false);
    };

    const _renderFooter = () => {
        if (!loadMore) return null;
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
                        <ActivityIndicator color="rgb(74,74,74)" style={{ marginLeft: 8 }} />
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Container style={{ flex: 1, backgroundColor: 'rgba(255,255,255 0.1)' }}>
            <Loader loading={loading} />
            <View style={{ flex: 1 }}>
                <View style={{ borderRadius: 5, marginHorizontal: 20, paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.whiteColor }}>

                    <View style={{ flex: 1, height: 50, }}>

                        <TextInput
                            placeholder={I18n.t('lbl_search')}
                            onChangeText={value => setSearch(value)}
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

                            }} />
                    </View>
                    <TouchableOpacity style={{ alignItems: 'center', }} onPress={() => { getSalonList(true) }}>
                        <Image source={globalImagePath.LeftArrow} style={{ height: 20, width: 20 }} resizeMode={'cover'} />
                    </TouchableOpacity>
                </View>


                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', marginTop: 20, paddingHorizontal: 15, alignSelf: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 18, fontFamily: fonts.type.NunitoSans_bold }}>{I18n.t(listTitle)}</Text>
                        </View>

                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            data={recommendSalon}
                            renderItem={({ item, index }) =>
                                recommandSalon(item, index)
                            }
                            keyExtractor={(item, index) => String(index)}
                            onRefresh={() => onRefresh()}
                            refreshing={refreshing}
                            onEndReached={({ distanceFromEnd }) => {
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

        </Container>
    );
}