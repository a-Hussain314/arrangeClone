import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform, ImageBackground, Alert, ActivityIndicator, } from 'react-native';
import { Container, Content } from 'native-base';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import { getService } from '../../../../services/getServices';
import { postService } from '../../../../services/postServices';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../../components/Loader';
import { showToast } from '../../../../components/ToastMessage';
import { USER_HOME_SALON_URL } from '../../../../utils/constants';
import { check, PERMISSIONS, openSettings } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
var pageNo = 1;
export default function SalonServiceList({ navigation, route }) {
    const [loading, setLoading] = React.useState(false);
    const [salonServices, setSalonService] = React.useState('');
    const [refreshing, setRefreshing] = React.useState(false);
    const [title, setTitle] = React.useState(false);
    const [curruntLatLng, setCurruntLatLng] = React.useState('');
    let onEndReachedCalledDuringMomentum = true;
    React.useEffect(() => {
        checkLocationPermission();
    }, [])

    React.useEffect(() => {
        if (route.params.serviceDetails) {
            setTitle(route.params.serviceDetails.service_name)
            getSalonServiceList(route.params.serviceDetails._id);
        }
    }, [curruntLatLng])

    const checkLocationPermission = () => {

        if (Platform.OS == 'ios') {

            check(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
                if (
                    result == 'blocked' ||
                    result == 'denied' ||
                    result == 'unavailable'
                ) {

                    if (global.lat) {
                        let curruntLocation = {
                            latitude: global.lat,
                            longitude: global.lng,
                        };
                        setCurruntLatLng(curruntLocation);
                    } else {
                        Alert.alert(
                            '',
                            I18n.t('lbl_permission_msg'),
                            [
                                {
                                    text: I18n.t('lbl_notNow'),
                                    onPress: () => console.log('Cancel Pressed!'),
                                },
                                {
                                    text: I18n.t('lbl_open_setting'),
                                    onPress: () => openSettings(),
                                },
                            ],
                            { cancelable: false },
                        );
                    }
                } else {
                    getCurrentLocation();
                }
            });
        } else if (Platform.OS == 'android') {

            check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
                if (result == 'blocked' || result == 'denied') {

                    if (global.lat) {
                        let curruntLocation = {
                            latitude: global.lat,
                            longitude: global.lng,
                        };
                        setCurruntLatLng(curruntLocation);
                    } else {
                        Alert.alert(
                            '',
                            I18n.t('lbl_permission_msg'),
                            [
                                {
                                    text: I18n.t('lbl_notNow'),
                                    onPress: () => console.log('Cancel Pressed!'),
                                },
                                {
                                    text: I18n.t('lbl_open_setting'),
                                    onPress: () => openSettings(),
                                },
                            ],
                            { cancelable: false },
                        );
                    }
                } else {
                    getCurrentLocation();
                }
            });
        }
    };



    const getCurrentLocation = () => {

        Geolocation.getCurrentPosition(
            //Will give you the current location
            async (position) => {

                global.lat = position.coords.latitude;
                global.lng = position.coords.longitude;
                let curruntLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setCurruntLatLng(curruntLocation);
            },
            (error) => {
                console.log('call 8');
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 10000,
            },
        );
    };

    //***** For getting BookingDetails Api*/
    const getSalonServiceList = (id) => {
        const data = {
            service_id: id,
            page: pageNo,
            latitude: curruntLatLng.latitude,
            longitude: curruntLatLng.longitude,
        }
        console.log("data =>", data);
        setLoading(true);
        //***** api calling */ 
        postService('salonlist/salon-by-service', data)
            .then(res => {
                console.log("res =>", res);
                if (res.data.status === 1) {
                    setLoading(false);
                    let data = res.data.response;
                    // setSalonService(data);
                    if (data != '') {
                        if (!res.data.response) {
                            showToast(res.data.message);
                        }
                        if (pageNo == 1) {
                            setSalonService([...data.records]);
                        } else {
                            data && data.records
                                ? setSalonService([...salonServices, ...data.records])
                                : setSalonService([...salonServices]);
                        }
                    }
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

    const onRefresh = () => {
        setLoading(true);
        pageNo = 1;
        getSalonServiceList(route.params.serviceDetails._id);
    };

    const onReached = () => {
        setLoading(true);
        pageNo = parseInt(pageNo) + 1;
        getSalonServiceList(route.params.serviceDetails._id);
    };
    const emptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
                <Text style={{}}>oops! There's no data here!</Text>
            </View>
        );
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
                        <ActivityIndicator color="rgb(74,74,74)" style={{ marginLeft: 8 }} />
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    };

    const animationShow = async (key, val) => {

        let data = [...salonServices];
        data[key].animate = val;
        setSalonService(await data);
    };

    // Render salonservice salon
    const _renderSalonService = (item, index) => {
        return (
            <TouchableOpacity
                style={style.renderOuterView}
                onPress={() =>
                    navigation.navigate('SalonDetails', {
                        salonId: item._id,
                    })
                }>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0.5,
                    height: width * (139 / 375),
                    width: width * (164 / 375),
                    borderRadius: width * (10 / 375),
                    borderColor: 'rgba(0,0,0, 0.1)',
                    backgroundColor: '#fff'
                }}>
                    <Image
                        source={{ uri: USER_HOME_SALON_URL + item.banner_salon }}
                        style={style.image}
                        resizeMode={'cover'}
                        onLoadStart={() => animationShow(index, true)}
                        onLoad={() => animationShow(index, false)}
                    />
                    {!item.animate ? (
                        <ActivityIndicator
                            style={{ position: 'absolute', marginLeft: width * (15 / 375), }}
                            size='small'
                            color={'rgb(196,170,153)'}
                            animating={item.animate}
                        />
                    ) : null}
                </View>

                <View style={style.treatmentOptionTitle_1}>
                    <Text style={style.titleText} numberOfLines={1}>
                        {item.salon_name}
                    </Text>
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
                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                        <View style={{}}>
                            <Image source={globalImagePath.locationIcon} />
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

    return (
        <Container style={{ flex: 1, backgroundColor: 'rgba(255,255,255 0.1)' }}>
            <NavBar
                textColor={'black'}
                isLeftIconUrl={false}
                leftIcon={globalImagePath.back_icon}
                navigator={navigation}
                backgroundColor={'#ffffff'}
                title={'Salon service list'}
                isCenterImage={false}
                centerText={I18n.t('lbl_new_request_details')}
                navigation="HomePage"
                titleTop={''}
            />
            <Loader loading={loading} />

            <View style={{ flex: 1 }}>

                <View style={{ alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 20 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: fonts.type.NunitoSans_bold,
                        }}>
                        {title}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        data={salonServices}
                        renderItem={({ item, index }) => _renderSalonService(item, index)}
                        keyExtractor={(item, index) => String(item._id)}
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
        </Container>
    )
}

export const style = StyleSheet.create({
    renderOuterView: {
        marginLeft: width * (10 / 375),
        width: width * (164 / 375),
        marginRight: width * (10 / 375),
        marginTop: width * (10 / 375),

    },
    image: {
        height: width * (139 / 375),
        width: width * (164 / 375),
        borderTopLeftRadius: width * (10 / 375),
        borderTopRightRadius: width * (10 / 375),
        //bottom: Platform.OS === 'ios' ? 0 : 150
    },
    treatmentOptionTitle_1: {
        justifyContent: 'center',
        // alignItems: 'center',
        paddingHorizontal: width * (10 / 375),
        paddingVertical: width * (2 / 375),

        //  marginTop: 10,
        backgroundColor: colors.whiteColor,
        borderBottomLeftRadius: width * (10 / 375),
        borderBottomRightRadius: width * (10 / 375),
    },
    titleText: {
        fontSize: width * (14 / 375),
        fontFamily: fonts.type.NunitoSans_bold,
    },
    ratingOuter: {
        backgroundColor: 'rgb(11,199,117)',
        flexDirection: 'row',
        paddingVertical: width * (2 / 375),
        paddingHorizontal: width * (10 / 375),
        borderRadius: width * (5 / 375),
    },
    sterImg: {
        justifyContent: 'center',
    },
    rateText: {
        color: colors.whiteColor,
        marginLeft: width * (2 / 375),
    },
    reviewView: {
        justifyContent: 'center',
        paddingLeft: width * (10 / 375),
    },
    reviewText: {
        fontSize: width * (12 / 375),
        color: colors.themeColor,
    },
    locationText: {
        marginLeft: 5,
        fontSize: width * (10 / 375),
        color: colors.themeColor,
    },
})