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
import { styles } from '../../../../components/CustomLangauge/CustomLanguage';
var pageNo = 1;
export default function OfferList({ navigation, props }) {
    let onEndReachedCalledDuringMomentum = true;
    const [loading, setLoading] = React.useState(false);
    const [offerList, setOfferList] = React.useState([]);
    const [imageUrl, setImageUrl] = React.useState([]);
    const [isData, setIsData] = React.useState(false);
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = React.useState(false);
    const [showLoadMore, setShowLoadMore] = React.useState(false);
    //  const [pageNo, setPageNo] = React.useState(1);
    const [addressList, setAddressList] = React.useState([]);

    React.useEffect(() => {
        pageNo = 1;
        if (isFocused) {
            setLoading(true);
            getOfferList();
        }
    }, [isFocused]);

    function getOfferList() {
        const data = {
            page: pageNo
        }
        //***** api calling */
        postService('/home/offerlist', data)
            .then(res => {
                setLoading(false);
                setRefreshing(false);
                setShowLoadMore(false);
                //  console.log("res.data.response.list =>", res.data.response);
                if (res.data.status === 1) {
                    setOfferList(res.data.response.list);
                    setIsData(true);
                    setImageUrl(res.data.response.offer_image);
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

    const animationShow = async (key, val) => {
        let data = [...offerList];
        data[key].animate = val;
        setOfferList(await data);
    };


    const renderOfferList = (item, index) => {

        return (
            <TouchableOpacity style={style.renderOuterView} onPress={() => {
                navigation.navigate('OfferDetails', {
                    offerDetails: item,
                    imageUrl: imageUrl
                })
            }}>
                <View style={{ alignItems: 'center', }}>
                    <Image
                        source={item && item.image ? { uri: imageUrl + item.image } : globalImagePath.default_img}
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

                </View>
                <View style={style.treatmentOptionTitle_1}>
                    <Text style={style.titleText} numberOfLines={1}>{item.offer_name}</Text>
                    <View style={{ marginVertical: width * (8 / 375) }}>
                        {item.offer_type != 1 ?
                            <Text style={style.discountValue}>{item.discount_value + '%' + ' ' + I18n.t('lbl_discount')}</Text>
                            :
                            <Text style={style.discountValue}>{item.discount_value + 'SAR' + ' ' + I18n.t('lbl_Flat')}</Text>
                        }
                    </View>
                    <View>
                        <Text style={{ fontSize: 12, color: colors.themeColor }} numberOfLines={3}>
                            {item.description}
                        </Text>
                    </View>
                </View>

            </TouchableOpacity>
        );
    };

    const _renderEmptyComponent = (type) => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        marginTop: 100,
                        fontSize: 22,
                        fontWeight: 'bold',
                        fontFamily: fonts.type.NunitoSans_Regular,
                    }}>
                    {I18n.t('lbl_no_offer')}
                </Text>
            </View>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        pageNo = 1;
        getOfferList();
    };

    const onReached = () => {
        setRefreshing(true);
        setShowLoadMore(true);
        pageNo = parseInt(pageNo) + 1;
        getOfferList();
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
                title={'Offers'}
                isCenterImage={false}
                centerText={I18n.t('lbl_offer')}
                navigation="HomePage"
                titleTop={''}
            />

            <View style={{ flex: 1 }}>
                <FlatList
                    numColumns={2}
                    data={offerList}
                    renderItem={({ item, index }) =>
                        renderOfferList(item, index)
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
                    ListEmptyComponent={() => _renderEmptyComponent()}
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
        paddingHorizontal: width * (10 / 375),
        paddingVertical: width * (15 / 375),

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
        paddingVertical: width * (3 / 375),
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
    discountValue: {
        fontSize: width * (14 / 375),
        color: 'rgb(252,174,0)'
    }
})