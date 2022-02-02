import React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import Loader from '../../../../components/Loader';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { Container, Content } from 'native-base';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import I18n from '../../../../I18n';
import NavBar from '../../../../components/NavBar';
import { postService } from '../../../../services/postServices';
import { showToast, showDangerToast, } from '../../../../components/ToastMessage';
var pageNo = 1;
export default function FavoriteSalonList({ navigation, props }) {
    let onEndReachedCalledDuringMomentum = true;
    const [loading, setLoading] = React.useState(false);
    const [favoriteList, setFavoriteList] = React.useState([]);
    const [imageUrl, setImageUrl] = React.useState([]);
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = React.useState(false);
    const [showLoadMore, setShowLoadMore] = React.useState(false);
    // const [pageNo, setPageNo] = React.useState(1);
    const [addressList, setAddressList] = React.useState([]);

    React.useEffect(() => {
        pageNo = 1;
        if (isFocused) {
            setLoading(true);
            getFavoriteList();
        }
    }, [isFocused]);

    function getFavoriteList() {
        const data = {
            page: 1
        }
        //***** api calling */

        postService('/salonlist/favlist', data)
            .then(res => {
                setLoading(false);
                setRefreshing(false);
                setShowLoadMore(false);
                // console.log("res.data.response.list =>", res.data.response.list);
                if (res.data.status === 1) {
                    setFavoriteList(res.data.response.list);
                    setImageUrl(res.data.response.banner_salon_url);
                } else {
                    setLoading(false);
                    setRefreshing(false);
                    setShowLoadMore(false);
                    setTimeout(function () {
                        showDangerToast(res.data.message);
                    }, 100);
                }
            })
            .catch(error => {
                setLoading(false);
                setRefreshing(false);
                setShowLoadMore(false);
                setTimeout(function () {
                    alert(error);
                }, 100);
            });
    };

    function addAndRemoveFavSaloon(salonDetails, index) {
        setLoading(true);

        var salonId = salonDetails && salonDetails._id;
        const data = {
            salon_id: salonId,
            isFav: 0
        }
        // ***** api calling */

        postService('salonlist/adddel-fav', data)
            .then(res => {
                setLoading(false);
                if (res.data.status === 1) {
                    showToast(res.data.message);
                    const newFavList = [...favoriteList];
                    newFavList.splice(index, 1);
                    setFavoriteList(newFavList);

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

    function confirmAlert(item, index) {
        Alert.alert(
            I18n.t('lbl_confirm_alert'),
            '',
            [
                {
                    text: I18n.t('lbl_cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: I18n.t('lbl_ok'), onPress: () => addAndRemoveFavSaloon(item, index) },
            ],
            { cancelable: false },
        );
    }

    const animationShow = async (key, val) => {
        let data = [...favoriteList];
        data[key].animate = val;
        setFavoriteList(await data);
    };


    const renderfavoriteList = (item, index) => {

        return (
            <TouchableOpacity style={style.renderOuterView} onPress={() => navigation.navigate('SalonDetails', {
                salonId: item._id
            })}>
                <View style={{ alignItems: 'center', }}>
                    <Image
                        source={{ uri: imageUrl + item.banner_salon }}
                        style={style.image}
                        resizeMode={'cover'}
                        onLoadStart={() => animationShow(index, true)}
                        onLoad={() => animationShow(index, false)}
                    />
                    {item.animate ? (
                        <ActivityIndicator
                            style={{ position: 'absolute', marginTop: width * (53 / 375), marginLeft: width * (40 / 375) }}
                            size='small'
                            color={'rgb(196,170,153)'}
                            animating={item.animate}
                        />
                    ) : null}
                    <TouchableOpacity onPress={() => { confirmAlert(item, index) }} style={{ position: 'absolute', alignSelf: 'flex-end' }}>
                        <Image source={globalImagePath.crossCircle} resizeMode={'contain'} />
                    </TouchableOpacity>
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
                            <Text style={style.reviewText}>{item.review + ' reviews'}</Text>
                        </View>
                    </View>
                    {/* <View style={style.locationOuter}>
                        <View style={style.locationImg}>
                            <Image source={globalImagePath.locationIcon} style={style.starImg} />
                        </View>
                        <View >
                            <Text style={style.locationText}>{item.distance + ' KM'}</Text>
                        </View>
                    </View> */}
                </View>

            </TouchableOpacity>
        );
    };

    const emptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ marginTop: 100, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular, }}>{I18n.t('lbl_favorite_salon_notFound')}</Text>
            </View>);
    }

    const onRefresh = () => {
        setRefreshing(true);
        pageNo = 1;
        getFavoriteList();
    };

    const onReached = () => {
        setRefreshing(true);
        setShowLoadMore(true);
        pageNo = parseInt(pageNo) + 1;
        getFavoriteList();
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
                        <ActivityIndicator color="rgb(74,74,74)" style={{ marginLeft: 8 }} />
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <Container style={{ backgroundColor: 'rgba(255,255,255 0.1)' }}>
            <Loader loading={loading} />
            <NavBar
                textColor={'black'}
                isLeftIconUrl={false}
                leftIcon={globalImagePath.back_icon}
                navigator={navigation}
                backgroundColor={'#ffffff'}
                title={I18n.t('lbl_favorite_salon')}
                isCenterImage={false}
                centerText={I18n.t('lbl_favorite_salon')}
                navigation="HomePage"
                titleTop={''}
            />

            <View style={{ flex: 1 }}>
                <FlatList
                    numColumns={2}
                    data={favoriteList}
                    renderItem={({ item, index }) =>
                        renderfavoriteList(item, index)
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


        </Container >
    );
}


export const style = StyleSheet.create({
    renderOuterView: {
        marginLeft: width * (10 / 375),
        width: width * (164 / 375),
        marginRight: width * (10 / 375),
        marginTop: width * (10 / 375),
    },

    treatmentOptionTitle_1: {
        justifyContent: 'center',
        // alignItems: 'center',
        padding: width * (10 / 375),

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
        paddingHorizontal: width * (14 / 375),
        borderRadius: width * (5 / 375),
    },
    sterImg: {
        justifyContent: 'center',

        // borderWidth: 1
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
        color: colors.themeColor
    },
    locationOuter: {
        flexDirection: 'row',
        paddingVertical: width * (5 / 375),
        paddingHorizontal: width * (10 / 375),
        borderRadius: width * (5 / 375),
    },
    locationImg: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginRight: width * (5 / 375),
    },
    locationText: {
        fontSize: width * (10 / 375),
        color: colors.themeColor
    },
    image: {
        height: width * (139 / 375),
        width: width * (164 / 375),
        borderTopLeftRadius: width * (10 / 375),
        borderTopRightRadius: width * (10 / 375),
        //bottom: Platform.OS === 'ios' ? 0 : 150
    },
})