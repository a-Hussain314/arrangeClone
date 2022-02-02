
//    backup

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput

} from 'react-native';
import { Container, Content } from 'native-base';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { style } from './style';
import NavBar from '../../../../components/NavBar';
import { getService } from '../../../../services/getServices';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
export default function SearchSalon({ navigation }) {
    const [toggle, setToggle] = React.useState(true);
    const [recommendSalon, setRecommendSalon] = React.useState([
        { title: 'The Galaxy Unisex Salon & Spa', img: globalImagePath.bg, },
        { title: 'Cute Herbal Beauty Parlour', img: globalImagePath.bg, },
        { title: 'Beauty Parlour', img: globalImagePath.bg, },
    ]);

    const [letlongDetails, setLetlongDetails] = React.useState([
        { coordinates: { latitude: 24.421555, longitude: 54.576599, } },
        { coordinates: { latitude: 25.266666, longitude: 55.316666, } },
        { coordinates: { latitude: 25.276987, longitude: 55.296249, } },
    ]);


    React.useEffect(() => { }, []);

    //***** For home screen information */
    // function getHomeData() {

    //   //***** api calling */
    //   getService('homescreendata')
    //     .then(res => {
    //       console.log("getHomeData =", res.data);
    //       if (res.data.status === 1) {
    //         setLoading(false);

    //         let data = res.data.response;

    //         console.log('homescreendata data ==> ', data);
    //         setHomeData(data);

    //       } else {
    //         setLoading(false);
    //         setTimeout(function () {
    //           showDangerToast(res.data.message);
    //         }, 100);
    //       }
    //     })
    //     .catch(error => {
    //       setLoading(false);
    //       setTimeout(function () {
    //         alert(error);
    //       }, 100);
    //     });
    // };

    const renderMarker = () => {
        return (
            <Marker
                coordinate={{}}
                key={'map-marker_'}
            >
                {/* <Icon type="MaterialIcons" name="location-on" style={{ color: 'red', fontSize: 50 }} /> */}
                <Callout onPress={() => { }}>
                    <TouchableOpacity style={styles.mapDescriptionView}>
                        <View style={styles.infoWindoOuter}>
                            <View style={styles.infoDetailOuter}>
                                <Text style={styles.infoTitle} numberOfLines={1} >{'hello'}</Text>
                                <Text style={styles.infoUserName} numberOfLines={1}>{'hello2'}</Text>
                                <Text style={styles.infoUserName} numberOfLines={1}>{'hello3'}</Text>
                                <Text style={styles.infoUserName} numberOfLines={1}>{'hello4'}</Text>

                            </View>
                            <View style={styles.infoUserIconOuter}>
                                {/* {this.renderUserIcon(data.userDetail)} */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Callout>
            </Marker>
        )
    }

    // Render recommand salon
    const recommandSalon = (item, index) => {
        return (
            <TouchableOpacity style={style.renderOuterView} onPress={() => navigation.navigate('SalonDetails')}>
                <View style={{ alignItems: 'center', }}>
                    <Image source={item.img} style={style.image} resizeMode={'cover'} />
                </View>
                <View style={style.treatmentOptionTitle_1}>
                    <Text style={style.titleText} numberOfLines={1}>{item.title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={style.ratingOuter}>
                            <View style={style.sterImg}>
                                <Image source={globalImagePath.star} style={{}} />
                            </View>
                            <View>
                                <Text style={style.rateText}>{'4.5'}</Text>
                            </View>
                        </View>
                        <View style={style.reviewView}>
                            <Text style={style.reviewText}>{'35 reviews'}</Text>
                        </View>
                    </View>
                    <View style={style.locationOuter}>
                        <View style={style.locationImg}>
                            <Image source={globalImagePath.locationIcon} style={style.starImg} />
                        </View>
                        <View >
                            <Text style={style.locationText}>{'4.2 KM'}</Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        );
    };

    const _renderToggle = (val) => {

        setToggle(val)
    }

    return (
        <Container style={{ backgroundColor: 'rgba(255,255,255 0.1)' }}>

            {toggle == false ? <View style={{ flex: 1 }}>
                <View style={{ borderRadius: 5, marginHorizontal: 20, paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.whiteColor }}>
                    <View style={{ alignItems: 'center', }}>
                        <Image source={globalImagePath.search} style={{ height: 20, width: 20 }} resizeMode={'cover'} />
                    </View>
                    <View style={{ flex: 1, height: 50, }}>

                        <TextInput placeholder={'Search'} style={{
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
                    <View style={{ alignItems: 'center', }}>
                        <Image source={globalImagePath.LeftArrow} style={{ height: 20, width: 20 }} resizeMode={'cover'} />
                    </View>
                </View>
                <Content>

                    <View>
                        <View style={{ flexDirection: 'row', marginTop: 20, paddingHorizontal: 15, alignSelf: 'center' }}>
                            <View style={{ flex: 0.8, alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 18, fontFamily: fonts.type.NunitoSans_bold }}>{I18n.t('lbl_recommended_salon')}</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'flex-end', }}>
                                <Text style={{ fontFamily: fonts.type.NunitoSans_bold, textDecorationLine: "underline", fontSize: 14, color: colors.themeColor }}>{I18n.t('lbl_view_all')}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <FlatList
                                numColumns={2}
                                data={recommendSalon}

                                renderItem={({ item, index }) =>
                                    recommandSalon(item, index)
                                }
                                keyExtractor={(item, index) => String(index)}
                            />
                        </View>
                    </View>

                </Content>
            </View> : <View style={{ flex: 1 }}>
                    <View style={{ zIndex: 99, position: 'absolute', borderRadius: 5, marginHorizontal: 20, paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.whiteColor }}>
                        <View style={{ alignItems: 'center', }}>
                            <Image source={globalImagePath.search} style={{ height: 20, width: 20 }} resizeMode={'cover'} />
                        </View>
                        <View style={{ flex: 1, height: 50, }}>

                            <TextInput placeholder={'Search'} style={{
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
                        <View style={{ alignItems: 'center', }}>
                            <Image source={globalImagePath.LeftArrow} style={{ height: 20, width: 20 }} resizeMode={'cover'} />
                        </View>

                    </View>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ flex: 1, zIndex: -1 }}
                        initialRegion={{
                            latitude: 25.276987,
                            longitude: 55.296249,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {letlongDetails.map((ele) => (
                            <MapView.Marker
                                coordinate={ele.coordinates}
                                // title={'arrange'}
                                image={globalImagePath.location_marker}
                                description={"marker.description"}
                            >
                                <MapView.Callout tooltip={true} style={{ flex: -1, position: 'absolute', minWidth: 150, minHeight: 60 }} >
                                    <TouchableOpacity style={style.marker_renderOuterView} onPress={() => { }}>
                                        <View style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 10,
                                            flexDirection: 'row',
                                            flex: 1,
                                            paddingVertical: 12,
                                            paddingHorizontal: 8
                                        }}>

                                            <Text style={{ justifyContent: 'center', }}>
                                                <Image source={globalImagePath.bg} style={style.marker_image} resizeMode="cover" />
                                            </Text>

                                            <View style={{ flex: 1, marginLeft: 20, }}>
                                                <View style={{}}>
                                                    <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 14, }}>{'The Galaxy Unisex Salon & ...'}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                                    <View style={style.marker_ratingOuter}>

                                                        <Text > <Image source={globalImagePath.star} style={{}} /></Text>

                                                        <View>
                                                            <Text style={style.rateText}>{'4.5'}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={style.reviewView}>
                                                        <Text style={style.reviewText}>{'35 reviews'}</Text>
                                                    </View>
                                                </View>
                                                <View style={{}}>
                                                    <View style={style.marker_locationOuter}>
                                                        <Text style={style.locationImg}>

                                                            <Image source={globalImagePath.locationIcon} style={style.starImg} />
                                                        </Text>
                                                        <View >
                                                            <Text style={style.locationText}>{'4.2 KM'}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                    {/* <View style={{ height: 100, width: 150, }}>
                                    <Text>{'test'}{"\n"}{"marker.description"}</Text>
                                </View> */}
                                </MapView.Callout>
                            </MapView.Marker>
                        ))
                        }

                    </MapView>


                </View>}
            <View style={{ position: 'absolute', bottom: 20, right: 20, }}>
                {toggle == false ? <TouchableOpacity onPress={() => { _renderToggle(true) }}>
                    <Image source={globalImagePath.mapFloatIcon} style={{}} resizeMode={'cover'} />
                </TouchableOpacity> : null}
                {toggle == true ? <TouchableOpacity onPress={() => { _renderToggle(false) }}>
                    <Image source={globalImagePath.listIcon} style={{}} resizeMode={'cover'} />
                </TouchableOpacity> : null}
            </View>
        </Container>
    );
}

