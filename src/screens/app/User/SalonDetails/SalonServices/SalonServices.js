import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { height, width } from '../../../../../constants/screenSize';
import { fonts, colors } from '../../../../../Theme';
// import { styles } from './styles';
import { globalImagePath } from '../../../../../constants/globalImagePath';
import { postService } from '../../../../../services/postServices';
import font from '../../../../../Theme/font';
import Loader from '../../../../../components/Loader';
import { useIsFocused } from "@react-navigation/native";
import { showToast, showDangerToast } from '../../../../../components/ToastMessage';
import I18n from '../../../../../I18n';
import { SALON_SERVICE } from '../../../../../utils/constants'
var add_serices = [];
export default function SalonServices({ navigation, salonId }) {
    const isFocused = useIsFocused();
    const [loading, setLoading] = React.useState(false);
    const [services, setService] = React.useState([]);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [totalService, setTotalService] = React.useState(0);
    const [bookShowHide, setBookShowHide] = React.useState(true);

    React.useEffect(() => {
        isFocused ? getServiceDetails(salonId) : null;
        isFocused ? setBookShowHide(true) : null;
    }, [isFocused]);

    function getServiceDetails(salonId) {
        setLoading(true);
        const data = {
            salon_id: salonId
        }

        //***** api calling */
        postService('salonlist/salonservices-byid', data)
            .then(res => {
                setLoading(false);
                console.log("salonlist/salonservices-byid ==> ", res);
                if (res.data.status === 1) {
                    setLoading(false);
                    let data = res.data.response;
                    setService(data.records);
                    setTotalPrice(data.total_price ? data.total_price : 0);
                    setTotalService(data.total_services ? data.total_services : 0);

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

    const addRemoveProduct = async (item, index, value) => {
        setLoading(true);
        let apiName = value ? 'cart/addCart' : 'cart/removeCart';

        const postData = {
            service_id: item._id,
            price: item.price,
            name: item.name,
            salon_id: salonId
        }
        console.log("postData =>", postData);
        //***** api calling */
        postService(apiName, postData)
            .then(async res => {
                setLoading(false);
                console.log("cart res ==> ", res);
                if (res.data.status === 1) {
                    setLoading(false);

                    let serviceArr = [...services]
                    serviceArr[index].added = value;
                    setService(await serviceArr);

                    let price = value ? (totalPrice + item.price) : (totalPrice - item.price);
                    let serviceCount = value ? (totalService + 1) : (totalService - 1);

                    setTotalPrice(price);
                    setTotalService(serviceCount);

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
    }

    const animationShow = async (key, val) => {
        let data = [...services];
        data[key].animate = val;
        setService(await data);
    };
    // Render recommand salon
    const recommandSalon = (item, index) => {
        return (
            <TouchableOpacity style={styles.renderOuterView} onPress={() => { }}>
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
                            source={{ uri: SALON_SERVICE + item.image }}
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

                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 12, }}>{item.salon_service}</Text>
                            <Text style={{ marginTop: 5, color: colors.darkShade, fontSize: 14, }}>{'SAR ' + item.price}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.darkShade, fontSize: 14, }}>{item.service_type}</Text>
                            </View>

                            <TouchableOpacity onPress={() => { item.added ? addRemoveProduct(item, index, false) : addRemoveProduct(item, index, true) }} style={{ borderRadius: 5, alignSelf: 'flex-end', paddingHorizontal: 8, paddingVertical: 7, justifyContent: 'center', alignItems: 'center', width: 80, flexDirection: 'row', borderWidth: 0.8, borderColor: colors.themeColor }}>
                                <View style={{ justifyContent: "center" }}>
                                    <Image source={item.added ? globalImagePath.removeIcon : globalImagePath.addIcon} style={styles.addimage} resizeMode={'cover'} />
                                </View>
                                <View style={{ marginLeft: 5 }}>
                                    <Text style={{ color: colors.darkShade, fontSize: 14, }}>{item.added ? I18n.t("lbl_remove") : I18n.t("lbl_add")}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </TouchableOpacity >
        );
    };

    const emptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ marginTop: 100, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular, }}>{I18n.t('lbl_no_service')}</Text>
            </View>);
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff'
        }}>
            <Loader loading={loading} />
            <View style={{ marginHorizontal: width * (20 / 375), flex: 1, marginTop: 20 }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={services}
                    renderItem={({ item, index }) =>
                        recommandSalon(item, index)
                    }
                    keyExtractor={(item, index) => String(index)}
                    ListEmptyComponent={emptyComponent()}
                />

            </View>
            { totalPrice > 0 ?
                <View style={{
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    bottom: width * (100 / 375),
                    width: bookShowHide ? width * (334 / 375) : width * (155 / 375),
                    alignSelf: bookShowHide ? 'center' : 'flex-start',
                    position: 'absolute',
                    marginHorizontal: 20,
                    height: 80,
                    borderRadius: 10,
                    backgroundColor: 'rgba(0,0,0,0.3)'
                }}
                >
                    <View style={{ flexDirection: 'row', }}>
                        {bookShowHide ? <View style={{ flex: 1 }}>
                            <View>
                                <Text style={{ color: '#fff', fontSize: 10, fontFamily: fonts.type.proximanova_semibold }}>{totalService + ' ' + I18n.t('lbl_service_add')}</Text>
                            </View>
                            <Text style={{ color: '#fff', fontSize: 18 }}>{'SAR ' + totalPrice.toFixed(2)}</Text>
                        </View> : null}
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('SelectDateAndTime', {
                                    salon_id: salonId
                                })
                            }}
                            style={{
                                height: width * (35 / 375),
                                backgroundColor: '#fff',
                                borderRadius: 5,
                                alignSelf: 'flex-end',
                                paddingHorizontal: 8,
                                paddingVertical: 7,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 100,
                                flexDirection: 'row',
                                borderWidth: 0.8,
                                borderColor: colors.themeColor
                            }}
                        >
                            <View style={{ marginLeft: 5 }}>
                                <Text style={{ color: colors.darkShade, fontSize: 14, }}>{I18n.t('lbl_book_now')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setBookShowHide(!bookShowHide) }} style={{ marginLeft: 10, justifyContent: 'center' }}>
                            <View style={{ justifyContent: "center", backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
                                <Image source={bookShowHide ? globalImagePath.removeIcon : globalImagePath.addIcon} style={styles.addimage} resizeMode={'cover'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                : null}
        </View>
    );

}

const styles = StyleSheet.create({
    renderOuterView: {
        flexDirection: 'row',
        marginBottom: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: colors.lightThemeColor
    },
    image: {
        // borderWidth: 5,
        height: width * (88 / 375),
        width: width * (88 / 375),
        borderRadius: 10,
    },
    addimage: {
        // borderWidth: 5,
        borderRadius: 10,
    },
    titleStyle: {
        color: 'black'
    }
})
