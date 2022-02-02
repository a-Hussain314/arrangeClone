import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { height, width } from '../../../../../constants/screenSize';
import { fonts, colors } from '../../../../../Theme';
// import { styles } from './styles';
import { globalImagePath } from '../../../../../constants/globalImagePath'
import font from '../../../../../Theme/font';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Loader from '../../../../../components/Loader';
import I18n from '../../../../../I18n';
import { useIsFocused } from "@react-navigation/native";
import { postService } from '../../../../../services/postServices';
import { showToast, showDangerToast } from '../../../../../components/ToastMessage';
import { CUSTOMERIMAGEURL } from '../../../../../utils/constants';
var pageNo = 1;
export default function SalonReview({ navigation, salonId }) {
    let onEndReachedCalledDuringMomentum = true;
    const isFocused = useIsFocused();
    const [loading, setLoading] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    // const [pageNo, setPageNo] = React.useState(1);
    const [overallRating, setOverallRating] = React.useState(0);
    const [starShow, setStarShow] = React.useState([]);
    const [totalReview, setTotalReview] = React.useState(0);
    const [reviews, setReviews] = React.useState([]);
    React.useEffect(() => {
        pageNo = 1;
        if (isFocused) {
            setLoading(true);
            getSalonReview(salonId)
        }
    }, [isFocused]);

    const getSalonReview = () => {
        const data = {
            salon_id: salonId,
            page: pageNo
        }

        //  console.log("post data ==> ", data);

        postService('reviews', data)
            .then(res => {
                setLoading(false);
                setRefreshing(false);
                //   console.log(" reviews data =>", res);

                if (res.data.status === 1) {
                    setLoading(false);
                    setRefreshing(false);
                    let data = res.data.response;
                    //  console.log(" reviews data =>", data);

                    let rate = Math.floor(data.overall_rating);

                    let rateArr = [];
                    for (let index = 1; index < 6; index++) {
                        if (index <= rate) {
                            rateArr.push(1);
                        } else {
                            rateArr.push(0);
                        }
                    }

                    setStarShow(rateArr);
                    setOverallRating(rate);
                    setTotalReview(data.total_review);

                    if (pageNo == 1) {
                        setReviews([...data.review_list]);
                    } else {
                        data && data.review_list ? setReviews([...reviews, ...data.review_list]) : setReviews([...reviews]);
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

    }

    // Render renderReview
    const renderReview = (item, index) => {
        return (
            <TouchableOpacity style={styles.renderOuterView} onPress={() => { }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    flexDirection: 'row',
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 8
                }}>

                    <Image source={item.user_id && item.user_id.profile ? { uri: CUSTOMERIMAGEURL + item.user_id.profile } : globalImagePath.default_img} style={styles.image} resizeMode={'cover'} />

                    <View style={{ flex: 1, marginLeft: 20, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 12, }}>{item.user_id ? item.user_id.first_name + " " + item.user_id.last_name : ''}</Text>
                                    </View>
                                    <View style={styles.ratingOuter}>
                                        <View style={styles.sterImg}>
                                            <Image source={globalImagePath.star} style={{}} />
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={styles.rateText}>{item.rating}</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* <View style={{}}>
                                    <Text style={{ marginBottom: 5, color: colors.themeColor, fontSize: 12, }}>{'Spot Lights - Organic Eye'}</Text>
                                </View> */}
                            </View>

                        </View>

                        <View style={{ justifyContent: 'center', }}>
                            <Text style={{ color: 'rgb(110,118,130)', fontSize: 12, }}>{item.description}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
    }

    const HeaderComponent = () => {
        return (
            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 14, color: colors.themeColor }}>{I18n.t('lbl_overall_rate')}</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 50, fontWeight: 'bold' }}>{overallRating}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <AirbnbRating
                            count={5}
                            defaultRating={overallRating}
                            reviews={['', '', '', '', '']}
                            size={30}
                            onFinishRating={ratingCompleted}
                        /> */}
                        {starShow.length > 0 ? starShow.map((data, keyy) =>
                            data == 1 ? (
                                <Image source={globalImagePath.fillStar} style={{ margin: 4 }} />
                            ) : (
                                    <Image source={globalImagePath.unFillStar} style={{ margin: 4 }} />
                                ),
                        ) : (
                                <>
                                    <Image source={globalImagePath.unFillStar} style={{ margin: 4 }} />
                                    <Image source={globalImagePath.unFillStar} style={{ margin: 4 }} />
                                    <Image source={globalImagePath.unFillStar} style={{ margin: 4 }} />
                                    <Image source={globalImagePath.unFillStar} style={{ margin: 4 }} />
                                    <Image source={globalImagePath.unFillStar} style={{ margin: 4 }} />
                                </>
                            )}
                    </View>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontSize: 14, color: colors.themeColor }}>{I18n.t('lbl_baseon')}{" " + totalReview}{" " + I18n.t('lbl_salon_reviews')}</Text>
                </View>
            </View>
        );
    }

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

    const onRefresh = () => {
        console.log("call onRefresh");
        setRefreshing(true);
        pageNo = 1;
        getSalonReview();
    };

    const onReached = () => {
        console.log("call onReached");
        setRefreshing(true);
        // setPageNo(pageNo + 1);
        pageNo = parseInt(pageNo) + 1;
        getSalonReview();
    };

    const _renderEmptyComponent = type => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center'
                }}>
                <Text style={{ marginTop: 100, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular, }}>
                    {I18n.t('lbl_reviews_not_found')}
                </Text>
            </View>
        );
    };

    return (
        <View style={{
            flex: 1,
            paddingHorizontal: width * (20 / 375),


        }}>
            <Loader loading={loading} />
            <View style={{ flex: 1, borderColor: 'red', }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={reviews}
                    renderItem={({ item, index }) =>
                        renderReview(item, index)
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
                    ListHeaderComponent={() => HeaderComponent()}
                    ListFooterComponent={() => _renderFooter()}
                    ListEmptyComponent={() => _renderEmptyComponent()}
                />

            </View>

        </View>
    );

}

const styles = StyleSheet.create({
    renderOuterView: {
        flexDirection: 'row',
        marginBottom: width * (10 / 375),
        paddingBottom: 2,
        paddingRight: 2,
        paddingTop: 2,
        paddingLeft: 2,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        //  marginRight: 10,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,

    },
    image: {
        // borderWidth: 5,
        height: width * (46 / 375),
        width: width * (46 / 375),
        borderRadius: 10,
    },
    addimage: {
        // borderWidth: 5,
        height: width * (11 / 375),
        width: width * (11 / 375),
        borderRadius: 10,
    },
    ratingOuter: {
        backgroundColor: 'rgb(11,199,117)',
        flexDirection: 'row',
        paddingVertical: width * (2 / 375),
        paddingHorizontal: width * (5 / 375),
        borderRadius: width * (5 / 375),
        height: width * (20 / 375)
    },
    sterImg: {
        justifyContent: 'center', alignSelf: 'center',

    },
    rateText: {
        color: colors.whiteColor,
        marginLeft: width * (2 / 375),
        fontSize: 10

    },
})
