import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { height, width } from '../../../../constants/screenSize';
import { fonts, colors } from '../../../../Theme';
// import { styles } from './styles';
import { globalImagePath } from '../../../../constants/globalImagePath'
import font from '../../../../Theme/font';
import NavBar from '../../../../components/NavBar';
import I18n from '../../../../I18n';
import { postService } from '../../../../services/postServices';
import Loader from '../../../../components/Loader';
import moment from "moment";
import { showToast, showDangerToast } from '../../../../components//ToastMessage';
import { useIsFocused } from "@react-navigation/native";

var pageNo = 1;
export default function NewRequests({ navigation, currentTabNum }) {
    let onEndReachedCalledDuringMomentum = true;
    const isFocused = useIsFocused();
    const [loading, setLoading] = React.useState(false);
    const [newRequest, setNewRequest] = React.useState([]);
    const [getProfileUrl, setProfileUrl] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [showLoadMore, setShowLoadMore] = React.useState(false);
    // const [pageNo, setPageNo] = React.useState(1);
    const [changeTab, setChangeTab] = React.useState('');

    React.useEffect(() => {
        console.log("currentTabNum new request =>", currentTabNum);
        pageNo = 1;
        setLoading(true);
        getNewRequestApi();
    }, [currentTabNum, isFocused]);

    //***** For getting New Request Api*/
    const getNewRequestApi = () => {
        const data = {
            type: "new",
            page: pageNo
        }

        //***** api calling */ 
        postService('salon-appointment', data)
            .then(res => {
                setLoading(false);
                console.log("salon-appointment/new", res.data.response);
                if (res.data.status === 1) {
                    //  console.log("salon-appointment/new", res.data.response);
                    setLoading(false);
                    setRefreshing(false);
                    setShowLoadMore(false);
                    //  let data = res.data.response.list;
                    // setNewRequest(data);
                    let profileUrl = res.data.response.profileUrl;
                    setProfileUrl(profileUrl);

                    let data = res.data.response;
                    if (data != '') {
                        if (!res.data.response) {
                            showToast(res.data.message)
                        }
                        if (pageNo == 1) {
                            setNewRequest([...data.list]);
                        } else {
                            data && data.list ? setNewRequest([...newRequest, ...data.list]) : setNewRequest([...newRequest]);
                        }
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


    //***** For booking accept and cancel Api*/
    const bookAcceptAndReject = (id, type, index) => {

        const data = {
            booking_id: id,
            status: type == 'accept' ? 1 : 2
        }
        //console.log("data =>", data, listData);
        setLoading(true);

        console.log("data =>", data);
        //***** api calling */ 
        postService('salon-appointment/update-booking', data)
            .then(res => {
                setLoading(false);
                if (res.data.status === 1) {
                    setLoading(false);
                    console.log("salon-appointment/update-booking", res.data.response);
                    showToast(res.data.message);
                    const newRequestList = [...newRequest];
                    newRequestList.splice(index, 1);
                    setNewRequest(newRequestList);
                    if (type == 'accept') {
                        navigation.navigate('UpcomingAppointment')
                    } else {
                        onRefresh();
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

    const acceptAlert = (_id, type, index) => {
        Alert.alert(
            `Are you sure want to accept appointment`,
            '',
            [
                {
                    text: `${I18n.t('lbl_cancel')}`,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: `${I18n.t('lbl_ok')}`, onPress: () => bookAcceptAndReject(_id, type, index) },
            ],
            { cancelable: false },
        );
    };

    const rejectAlert = (_id, type, index) => {
        Alert.alert(
            `${I18n.t('lbl_cancel_appintment')}`,
            '',
            [
                {
                    text: `${I18n.t('lbl_cancel')}`,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: `${I18n.t('lbl_ok')}`, onPress: () => bookAcceptAndReject(_id, type, index) },
            ],
            { cancelable: false },
        );
    };

    const animationShow = async (key, val) => {
        let data = [...newRequest];
        data[key].animate = val;
        setNewRequest(await data);
    };

    // Render recommand salon
    const getNewRequest = (item, index) => {

        return (
            <TouchableOpacity style={styles.renderOuterView} onPress={() => {
                navigation.navigate('RequestedDetails', {
                    requestType: 'accept',
                    bookingId: item._id
                })
            }}>
                <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, paddingLeft: 12 }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Image
                                source={item.user_id && { uri: getProfileUrl + item.user_id.profile }}
                                style={styles.image}
                                resizeMode={'cover'}
                                onLoadStart={() => animationShow(index, true)}
                                onLoad={() => animationShow(index, false)} />
                            {item.animate ? (
                                <ActivityIndicator
                                    style={{ position: 'absolute', marginLeft: width * (15 / 375) }}
                                    size='small'
                                    color={'rgb(196,170,153)'}
                                    animating={item.animate}
                                />
                            ) : null}
                        </View>
                        <View style={{ flex: 1, marginLeft: 20, }}>

                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, color: 'rgb(150,136,125)', fontSize: 12, fontFamily: fonts.type.NunitoSans_bold }}>{'#' + item.booking_number}</Text>
                                    <Text style={{ marginRight: 20, color: 'rgb(150,136,125)', fontSize: 12, fontFamily: fonts.type.NunitoSans_bold }}>{item.start_date}</Text>
                                </View>
                                <View style={{ marginRight: 20, }}>
                                    <Text style={{ marginTop: 2, fontSize: 14, fontWeight: 'bold', }}>{item.user_id && item.user_id.first_name}</Text>
                                    <Text style={{ marginTop: 7, color: colors.themeColor, fontSize: 12, fontFamily: fonts.type.NunitoSans_Regular }}>{'Beauty salon - Hair Cut'}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                    {item.status == 0 ? <View>
                        <View style={{ height: 0.5, backgroundColor: 'rgba(0,0,0, 0.2)', marginVertical: 15, marginRight: 20 }} />
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ flex: 1, justifyContent: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: 16, fontFamily: font.type.NunitoSans_bold }}>{'SAR ' + item.total_price}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                <TouchableOpacity onPress={() => { acceptAlert(item._id, 'accept', index) }} style={styles.deleteBtn}>
                                    <Text style={styles.btnText}>{I18n.t('lbl_accept')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { rejectAlert(item._id, 'reject', index) }} style={styles.editOuter}>
                                    <Text style={styles.btnText2}>{I18n.t('lbl_reject')}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View> : null}
                    {item.status == 5 ?
                        <View>
                            <View style={{ height: 0.5, backgroundColor: 'rgba(0,0,0, 0.2)', marginVertical: 15, marginRight: 20 }} />
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: colors.themeColor, fontSize: 14, fontFamily: fonts.type.NunitoSans_Regular }}>
                                    {"Payment Due SAR : "}
                                </Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', }}>
                                    {item.online_pay_amount.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        : null
                    }
                </View>
            </TouchableOpacity>
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

    const _renderEmptyComponent = type => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center'
                }}>
                <Text style={{ alignItems: 'center', marginTop: 100, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular, }}>
                    {I18n.t('lbl_request_not_found')}
                </Text>
            </View>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        pageNo = 1;
        getNewRequestApi();
    };

    const onReached = () => {
        setRefreshing(true);
        setShowLoadMore(true);
        pageNo = parseInt(pageNo) + 1;
        getNewRequestApi();
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
        }}>
            <Loader loading={loading} />
            <View style={{ flex: 1, marginHorizontal: width * (20 / 375), marginTop: width * (10 / 375), }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={newRequest}
                    renderItem={({ item, index }) =>
                        getNewRequest(item, index)
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
        </View>
    );

}

const styles = StyleSheet.create({
    renderOuterView: {
        flexDirection: 'row',

        marginBottom: width * (10 / 375),
        padding: 2,
        borderRadius: 15,
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
        height: width * (55 / 375),
        width: width * (55 / 375),
        borderRadius: 10,
    },
    addimage: {
        // borderWidth: 5,
        height: width * (11 / 375),
        width: width * (11 / 375),
        borderRadius: 10,
    },

    btnText: {
        fontFamily: fonts.type.NunitoSans_SemiBold,
        fontSize: width * (12 / 375),
        color: colors.themeColor
    },
    btnText2: {
        fontFamily: fonts.type.NunitoSans_SemiBold,
        fontSize: width * (12 / 375),
        color: colors.whiteColor
    },
    editOuter: {
        borderRadius: 5,
        backgroundColor: colors.themeColor,
        paddingHorizontal: width * (30 / 375),
        paddingVertical: width * (8 / 375),
        justifyContent: 'center'
    },
    deleteBtn: {
        borderWidth: 1,
        borderColor: colors.themeColor,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: colors.whiteColor,
        paddingHorizontal: width * (30 / 375),
        paddingVertical: width * (8 / 375),
        justifyContent: 'center'
    },
})
