import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Container, Content } from 'native-base';
import { height, width } from '../../../../constants/screenSize';
import { fonts, colors } from '../../../../Theme';
// import { styles } from './styles';
import { globalImagePath } from '../../../../constants/globalImagePath'
import font from '../../../../Theme/font';
import Loader from '../../../../components/Loader';
import NavBar from '../../../../components/NavBar';
import I18n from '../../../../I18n';
import { useIsFocused } from "@react-navigation/native";
import { postService } from '../../../../services/postServices';
import { showToast, showDangerToast, } from '../../../../components/ToastMessage';
import { USER_HOME_SALON_URL } from '../../../../utils/constants';
import moment from 'moment';

var pageNo = 1;
export default function Bookings({ navigation }) {
    let onEndReachedCalledDuringMomentum = true;
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [showLoadMore, setShowLoadMore] = React.useState(false);
    //const [pageNo, setPageNo] = React.useState(1);
    const [recommendSalon, setRecommendSalon] = React.useState([]);

    React.useEffect(() => {

        pageNo = 1;
        if (isFocused) {
            setLoading(true);
            getBookingList();
        }
    }, [isFocused]);

    const getBookingList = () => {

        const postData = {
            page: pageNo
        };
        // ***** api calling */
        postService('home/booking/list', postData)
            .then(res => {
                console.log('result booking/list = ', res);
                setLoading(false);
                if (res.status === 200) {
                    setLoading(false);
                    setRefreshing(false);
                    setShowLoadMore(false);
                    let data = res.data.response;
                    // console.log("data.list =>", data.list);
                    if (pageNo == 1) {
                        setRecommendSalon([...data.list]);
                    } else {
                        data && data.list ? setRecommendSalon([...recommendSalon, ...data.list]) : setRecommendSalon([...recommendSalon]);
                    }
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

    const _renderEmptyComponent = type => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center'
                }}>
                <Text style={{ marginTop: 100, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular, }}>
                    {I18n.t('lbl_no_booking')}
                </Text>
            </View>
        );
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

    const animationShow = async (key, val) => {
        let data = [...recommendSalon];
        data[key].animate = val;
        setRecommendSalon(await data);
    };

    // Render recommand salon
    const recommandSalon = (item, index) => {

        return (
            <TouchableOpacity
                style={styles.renderOuterView}
                onPress={() => navigation.navigate('BookingDetails', { booking_id: item._id })}
            >
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    flexDirection: 'row',
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 8,

                }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Image
                            source={item.salon_id && item.salon_id.banner_salon ? { uri: USER_HOME_SALON_URL + item.salon_id.banner_salon } : globalImagePath.user_dummy}
                            style={styles.image}
                            resizeMode={'cover'}
                            onLoadStart={() => animationShow(index, true)}
                            onLoad={() => animationShow(index, false)}
                        />
                        {item.animate ? (
                            <ActivityIndicator
                                style={{ position: 'absolute', marginLeft: width * (30 / 375) }}
                                size='small'
                                color={'rgb(196,170,153)'}
                                animating={item.animate}
                            />
                        ) : null}
                    </View>
                    <View style={{ flex: 1, marginLeft: 20, }}>

                        <View style={{ flex: 1 }}>
                            <Text style={{ color: 'rgb(150,136,125)', fontSize: 12, fontFamily: fonts.type.NunitoSans_bold }}>{'#' + item.booking_number}</Text>
                            <Text style={{ marginTop: 5, fontSize: 14, fontWeight: 'bold', }}>{item.salon_id && item.salon_id.salon_name}</Text>
                            <Text style={{ color: colors.themeColor, fontSize: 12, fontFamily: fonts.type.NunitoSans_Regular }}>{item.start_date + " " + item.slot}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <View
                                style={{
                                    borderRadius: 3,
                                    backgroundColor: item.status == 0 ? 'rgb(198,235,252)' : item.status == 1 && item.payment_status == 0 ? 'rgb(253,245,213)' : item.status == 1 && item.payment_status == 1 ? 'rgb(253,245,213)' : item.status == 2 ? 'rgb(255,213,213)' : item.status == 3 ? 'rgb(240,255,213)' : '#ffffff',
                                    paddingHorizontal: 4,
                                    paddingVertical: 4
                                    // borderWidth: 1, 
                                    // borderColor: colors.lightThemeColor 
                                }}
                            >
                                <Text
                                    style={{
                                        color: item.status == 0 ? 'rgb(40,134,175)' : item.status == 1 && item.payment_status == 0 ? 'rgb(178,144,0)' : item.status == 1 && item.payment_status == 1 ? 'rgb(178,144,0)' : item.status == 2 ? 'rgb(255,0,0)' : item.status == 3 ? 'rgb(92,126,31)' : '#ffffff',
                                        fontSize: 12,
                                        textAlign: 'center'
                                    }}
                                >
                                    {item.status == 0 ? I18n.t('lbl_waiting_approval') : item.status == 1 && item.payment_status == 0 ? I18n.t('lbl_tobe_paid') : item.status == 1 && item.payment_status == 1 ? I18n.t('lbl_upcoming') : item.status == 2 ? I18n.t('lbl_reject') : item.status == 3 ? I18n.t('lbl_completed') : ''}
                                </Text>
                            </View>
                            {item.status == 3 ? <TouchableOpacity
                                style={{
                                    marginLeft: 10,
                                    borderRadius: 3,
                                    backgroundColor: 'rgb(150,136,125)',
                                    padding: 4,
                                }}
                                onPress={() => navigation.navigate('ReviewRating', {
                                    salon_id: item.salon_id._id,
                                    booking_id: item._id,
                                    salon_detail: item.salon_id,
                                    booking_price: item.total_price
                                })}
                            >
                                <Text
                                    style={{
                                        color: '#ffffff',
                                        fontSize: 12,
                                        textAlign: 'center'
                                    }}
                                >
                                    {I18n.t('lbl_give_rating')}
                                </Text>
                            </TouchableOpacity> :
                                item.status == 4 ?
                                    <View
                                        style={{
                                            // marginLeft: 10,
                                            borderRadius: 3,
                                            backgroundColor: 'rgb(255,0,0)',
                                            padding: 4,
                                        }}

                                    >
                                        <Text
                                            style={{
                                                color: '#ffffff',
                                                fontSize: 12,
                                                textAlign: 'center'
                                            }}
                                        >
                                            {'Cancelled'}
                                        </Text>
                                    </View> :
                                    null}
                        </View>
                        {/* <View style={{ borderWidth: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 10 }} >
                            <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 2, paddingHorizontal: 20 }}>
                                <Text style={{ fontSize: 14, textDecorationLine: 'underline' }}>{'Rate Salon'}</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>

                </View>

            </TouchableOpacity>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        pageNo = 1;
        getBookingList();
    };

    const onReached = () => {

        setRefreshing(true);
        setShowLoadMore(true);
        pageNo = parseInt(pageNo) + 1;
        getBookingList();
    };


    return (
        <Container style={{
            flex: 1,
            backgroundColor: '#fff',
        }}>
            <Loader loading={loading} />
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
                centerText={I18n.t('lbl_booking')}
            />
            <View style={{ flex: 1, marginHorizontal: width * (20 / 375), marginTop: width * (10 / 375), }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
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
                    ListEmptyComponent={() => _renderEmptyComponent()}
                />

            </View>

        </Container>
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
        height: width * (79 / 375),
        width: width * (90 / 375),
        borderRadius: 10,
    },
    addimage: {
        // borderWidth: 5,
        height: width * (11 / 375),
        width: width * (11 / 375),
        borderRadius: 10,
    },
})
