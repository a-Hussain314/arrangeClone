//***** import libraries */
import React from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, Keyboard, ScrollView, Modal, BackHandler, } from 'react-native';

import { Container, Content } from 'native-base';
import { postService } from '../../../../services/postServices';
import I18n from '../../../../I18n';
import { showToast, showDangerToast } from '../../../../components//ToastMessage';
import validate from '../../../../components/Validations/validate_wrapper';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import { colors, fonts } from '../../../../Theme';
import { height, width } from '../../../../constants/screenSize';
import Button from '../../../../components/Button';
import ErrorMessage from '../../../../components/ErrorMessage';
import GoogleSearchInput from '../../../../components/googleSearchPlaceModal';
import { CommonStyles } from "../../../../assets/css";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { SALON_SERVICE } from "../../../../utils/constants";
import { RadioButton } from '../../../../components/index';
import TextInput from '../../../../components/TextInput';
import Picker from "react-native-picker";
import Geolocation from '@react-native-community/geolocation';
import { TextInputMask } from 'react-native-masked-text';
import CheckBox from 'react-native-check-box';
import { Lable } from '../../../../components';
var isDissbled = false
// create a component
export default function Booking({ route, navigation }) {

    const isFocused = useIsFocused();
    const [loading, setLoading] = React.useState(false);
    const [salonID, setSalonID] = React.useState('');
    const [services, setServices] = React.useState([]);
    const [serviceLocation, setServiceLocation] = React.useState(0);
    const [serviceLocationError, setServiceLocationError] = React.useState('');
    const [serviceType, setServiceType] = React.useState(0);       //1 for home 2 for salon and 3 for both
    const [paymentMethod, setPaymentMethod] = React.useState(0);
    const [paymentMethodError, setPaymentMethodError] = React.useState('');
    const [isShowPromoInput, setIsShowPromoInput] = React.useState(false);
    const [isPromoApplied, setIsPromoApplied] = React.useState(false);
    const [visibleAddressModal, setVisibleAddressModal] = React.useState(false);
    const [visibleCardModal, setVisibleCardModal] = React.useState(false);
    const [addressData, setAddressData] = React.useState([]);
    const [cardData, setCardData] = React.useState([]);
    const [isAddNewAddress, setIsAddNewAddress] = React.useState(false);
    const [isAddNewCard, setIsAddNewCard] = React.useState(false);
    const [setTerm, setCheckTerm] = React.useState(false);
    const [termError, setCheckTermError] = React.useState(false);
    const [placeName, setPlaceName] = React.useState('');
    const [placeNameError, setPlaceNameError] = React.useState('');
    const [landmark, setLandmark] = React.useState('');
    const [landmarkError, setLandmarkError] = React.useState('');
    const [isChecked, setIsChecked] = React.useState(0);
    const [serviceActive, setServiceActive] = React.useState(true);
    const [lat, setLat] = React.useState('');
    const [lng, setLng] = React.useState('');
    const [tagData, setTagData] = React.useState([
        { title: I18n.t('lbl_home'), active: true, value: 1 },
        { title: I18n.t('lbl_office'), active: false, value: 2 },
        { title: I18n.t('lbl_other'), active: false, value: 3 },

    ]);
    const [tag, setTag] = React.useState(1);
    const [searchModal, setSearchModal] = React.useState(false);

    const [selectedAddressID, setSelectedAddressID] = React.useState('');
    const [selectedPlaceName, setSelectedPlaceName] = React.useState('');
    const [selectedLandmark, setSelectedLandmark] = React.useState('');
    const [selectedLat, setSelectedLat] = React.useState('');
    const [selectedLng, setSelectedLng] = React.useState('');
    const [selectedTag, setSelectedTag] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [currentLat, setCurrentLat] = React.useState('');
    const [currentLng, setCurrentLng] = React.useState('');

    const [selectedCardID, setSelectedCardID] = React.useState('');
    const [selectedCardNumber, setSelectedCardNumber] = React.useState('');
    const [cardName, setCardName] = React.useState('');
    const [cardNameError, setCardNameError] = React.useState('');
    const [cardNumber, setCardNumber] = React.useState('');
    const [cardNumberError, setCardNumberError] = React.useState('');
    const [cardMonth, setCardMonth] = React.useState('');
    const [cardMonthError, setCardMonthError] = React.useState('');
    const [cardYear, setCardYear] = React.useState('');
    const [cardYearError, setCardYearError] = React.useState('');
    const [cardCVV, setCardCVV] = React.useState('');
    const [cardCVVError, setCardCVVError] = React.useState('');

    const [monthData, setMonthData] = React.useState('');
    const [yearData, setYearData] = React.useState('');
    const [cancelCharge, setCancellationCharge] = React.useState('');

    const [cashOptionAvailable, setCashOptionAvailable] = React.useState(0);

    const [promocode, setPromocode] = React.useState('');
    const [promocodeError, setPromocodeError] = React.useState('');
    const [offerID, setOfferID] = React.useState('');
    const [walletAmount, setWalletAmount] = React.useState('');
    const [subTotal, setSubTotal] = React.useState(0);
    const [baseFee, setBaseFee] = React.useState(0);
    const [taxes, setTaxes] = React.useState(0);
    const [serviceCharge, setServiceCharge] = React.useState(0);
    const [discount, setDiscount] = React.useState(0);
    const [grandTotal, setGrandTotal] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [bookingId, setBookingId] = React.useState('');
    const [orderId, setOrderId] = React.useState('');


    React.useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                setCurrentLat(position.coords.latitude);
                setCurrentLng(position.coords.longitude);

            },
            (error) => console.log('error.message =>', error.message),
        );

        setVisibleAddressModal(false);
        setVisibleCardModal(false);
        getCartDetails();

    }, []);


    const backAction = () => {

        Alert.alert(
            '',
            'Wants to discard this process', [
            {
                text: I18n.t('lbl_cancel'),
                onPress: () => null,
                style: "cancel"
            },
            { text: I18n.t('lbl_ok'), onPress: () => navigation.navigate('Home') }
        ]);
        return true;
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (isSelectionModeEnabled()) {
                    disableSelectionMode();
                    return true;
                } else {
                    return false;
                }
            };
            BackHandler.addEventListener("hardwareBackPress", backAction);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", backAction);

        }, [])
    );

    React.useEffect(() => {
        if (route.params?.selectedAddress) {
            selectLocation();
        }
    }, [route.params?.selectedAddress]);

    const getCartDetails = async () => {
        setLoading(true);

        const postData = {}
        //***** api calling */
        postService('cart/viewCart', postData)
            .then(async res => {
                setLoading(false);
                console.log("viewCart res ==> ", res);
                if (res.data.status === 1) {
                    let data = res.data.response;

                    // if (data.services.length == 0) {
                    //     navigation.reset({
                    //         index: 0,
                    //         routes: [{ name: 'Home' }],
                    //     });
                    //     return;
                    // }

                    let addArr = [];
                    await data.address && data.address.map((item, key) => {
                        if (item.isdefault == 1) {
                            item.active = true;
                            setSelectedAddressID(item._id);
                            setSelectedPlaceName(item.address);
                            setSelectedLandmark(item.landmark);
                            setSelectedLat(item.location && item.location.coordinates[1]);
                            setSelectedLng(item.location && item.location.coordinates[0]);
                            setSelectedTag(item.tag_location);
                        } else {
                            item.active = false;
                        }
                        addArr.push(item);
                    });

                    let cardArr = [];
                    await data.usercards && data.usercards.map((item, key) => {
                        if (item.isdefault == 1) {
                            item.active = true;
                            setSelectedCardID(item._id);
                            setSelectedCardNumber(item.card_number);
                        } else {
                            item.active = false;
                        }
                        cardArr.push(item);
                    });

                    if (data.servicetype == 1) {
                        setServiceLocation(1);
                        setGrandTotal(grandTotal => grandTotal + data.grand_total + data.service_charge);
                        setTotalPrice(grandTotal => grandTotal + data.grand_total + data.service_charge)
                    }

                    if (data.servicetype == 2) {
                        setServiceLocation(2);
                        setGrandTotal(grandTotal => grandTotal + data.grand_total);
                        setTotalPrice(grandTotal => grandTotal + data.grand_total + data.service_charge)
                    }

                    if (data.servicetype == 3) {
                        setServiceLocation(1);
                        setGrandTotal(grandTotal => grandTotal + data.grand_total + data.service_charge);
                        setTotalPrice(grandTotal => grandTotal + data.grand_total + data.service_charge)
                    }

                    let monData = [];
                    let yearData = [];
                    for (let month = 1; month <= 12; month++) {
                        monData.push(month);
                    }

                    for (let year = new Date().getFullYear(); year <= 2050; year++) {
                        yearData.push(year);
                    }

                    let result = data.services.map(o => (o.isActive == 0));

                    if (result.includes(true)) {
                        setServiceActive(false);
                    } else {
                        setServiceActive(true);
                    }


                    setMonthData(await monData);
                    setYearData(await yearData);
                    setImageUrl(data.imageURL);
                    setLoading(false);
                    setSalonID(data.salon_id ? data.salon_id._id : '');
                    setServices(data.services);
                    setAddressData(await addArr);
                    setCardData(await cardArr)
                    setServiceType(data.servicetype);
                    setCashOptionAvailable(data.is_cancellation);
                    setSubTotal(data.sub_total);
                    setBaseFee(data.base_fee);
                    setTaxes(data.taxes);
                    setServiceCharge(data.service_charge);
                    setWalletAmount(data.wallet_amount);
                    setCancellationCharge(data.salon_id && data.salon_id.cancellation)
                    //setGrandTotal(data.grand_total);
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

    //***** Function for showing confirm alert for camera and photo permission */
    const confirmRemoveAlert = (item, index) => {
        Alert.alert(
            `${I18n.t('lbl_wantTo_remove_service')}`,
            '',
            [
                {
                    text: `${I18n.t('lbl_cancel')}`,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: `${I18n.t('lbl_ok')}`, onPress: () => removeProduct(item, index) },
            ],
            { cancelable: false },
        );
    };

    const removeProduct = async (item, index) => {
        setLoading(true);

        const postData = {
            service_id: item.service_id,
        }
        //***** api calling */
        postService('cart/removeCart', postData)
            .then(async res => {
                setLoading(false);
                // console.log("removeCart res ==> ", res);
                if (res.data.status === 1) {
                    setLoading(false);
                    let serviceArr = [...services];
                    serviceArr.splice(index, 1);
                    if (serviceArr.length == 0) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                        return;
                    }
                    let result = serviceArr.map(o => (o.isActive == 0));

                    if (result.includes(true)) {
                        setServiceActive(false);
                    } else {
                        setServiceActive(true);
                    }
                    setServices(await serviceArr);
                    setSubTotal(subTotal => subTotal - item.price);
                    setGrandTotal(grandTotal => grandTotal - item.price);
                    setTotalPrice(grandTotal => grandTotal - item.price);
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


    const handleMonthPress = () => {
        const pickerStyle = {
            pickerConfirmBtnColor: [255, 255, 255, 1],
            pickerBg: [255, 255, 255, 1],
            pickerToolBarBg: [196, 170, 153, 1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerCancelBtnColor: [255, 255, 255, 1],
        };
        Picker.init({
            ...pickerStyle,
            pickerData: monthData,
            selectedValue: [`${cardMonth ? cardMonth : monthData[0]}`,],
            pickerTextEllipsisLen: 25,
            pickerCancelBtnText: `${I18n.t('lbl_cancel')}`,
            pickerConfirmBtnText: `${I18n.t('lbl_confirm')}`,
            pickerTitleText: `${I18n.t('lbl_select_month')}`,
            onPickerConfirm: (data) => {
                setCardMonth(parseInt(data[0]));
                setCardMonthError(validate("card_month", data[0]))
            },
            onPickerCancel: (data) => { },
            onPickerSelect: (data) => { },
        });
        Picker.show();
    }

    const handleYearPress = () => {
        const pickerStyle = {
            pickerConfirmBtnColor: [255, 255, 255, 1],
            pickerBg: [255, 255, 255, 1],
            pickerToolBarBg: [196, 170, 153, 1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerCancelBtnColor: [255, 255, 255, 1],
        };
        Picker.init({
            ...pickerStyle,
            pickerData: yearData,
            selectedValue: [`${cardYear ? cardYear : yearData[0]}`,],
            pickerTextEllipsisLen: 25,
            pickerCancelBtnText: `${I18n.t('lbl_cancel')}`,
            pickerConfirmBtnText: `${I18n.t('lbl_confirm')}`,
            pickerTitleText: `${I18n.t('lbl_select_year')}`,
            onPickerConfirm: (data) => {
                setCardYear(data[0]);
                setCardYearError(validate("card_year", data[0]))
            },
            onPickerCancel: (data) => { },
            onPickerSelect: (data) => { },
        });
        Picker.show();
    }



    const animationShow = async (key, val) => {
        let data = [...services];
        data[key].animate = val;
        setServices(await data);
    };

    const _renderServices = (item, index) => {

        return (
            <TouchableOpacity style={item.isActive == 0 ? styles.renderOuterView_remove : styles.renderOuterView} onPress={() => { }}>
                <View style={{
                    backgroundColor: item.isActive == 0 ? 'rgba(0,0,0,0.1)' : '#fff',
                    borderRadius: 10,
                    flexDirection: 'row',
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 8
                }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Image
                            source={{ uri: imageUrl + item.image }}
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
                            <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 12, }}>{item.name}</Text>
                            <Text style={{ marginTop: 5, color: colors.darkShade, fontSize: 14, }}>{'SAR ' + item.price}</Text>

                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center', flex: 1 }}>
                                <Text style={{ marginTop: 10, color: colors.darkShade, fontSize: 14, marginRight: 5 }}>{item.service_type}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { confirmRemoveAlert(item, index) }}
                                style={{
                                    borderRadius: 5,
                                    alignSelf: 'flex-end',
                                    paddingHorizontal: 8,
                                    paddingVertical: 7,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 80,
                                    flexDirection: 'row',
                                    borderWidth: 0.8,
                                    borderColor: colors.themeColor
                                }}
                            >
                                <View style={{ marginLeft: 5 }}>
                                    <Text
                                        style={{
                                            color: colors.darkShade,
                                            fontSize: 14,
                                        }}
                                    >
                                        {I18n.t('lbl_remove')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    const _renderEmptyComponent = () => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center'
                }}>
                <Text style={{ marginTop: 20, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular }}>
                    {I18n.t('lbl_service_notFound')}
                </Text>
            </View>
        );
    };

    const _renderServiceLocation = () => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#dddddd', borderBottomWidth: 1, borderBottomColor: '#dddddd', padding: 20 }}>
                <View style={{ width: '60%' }}>
                    <Text style={{
                        color: 'rgb(25,27,28)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                    }}
                    >
                        {I18n.t('lbl_select_service_location')}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        {serviceType == 1 &&
                            <RadioButton
                                placeholder=""
                                title={I18n.t('lbl_home')}
                                checkedIcon={globalImagePath.selectRadio}
                                uncheckedIcon={globalImagePath.nonSelectRadio}
                                marginRight={10}
                                fontSize={14}
                                titleColor={'rgb(25,27,28)'}
                                checked={serviceLocation == 1 ? true : false}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    setServiceLocation(1);
                                    setServiceLocationError('');
                                    serviceLocation == 1 ? null : setGrandTotal(grandTotal => grandTotal + serviceCharge);
                                    serviceLocation == 1 ? null : setTotalPrice(grandTotal => grandTotal + serviceCharge);
                                }}
                            />}
                        {serviceType == 2 &&
                            <View style={{ marginLeft: 10 }}>
                                <RadioButton
                                    placeholder=""
                                    title={I18n.t('lbl_salon')}
                                    checked={serviceLocation == 2 ? true : false}
                                    checkedIcon={globalImagePath.selectRadio}
                                    uncheckedIcon={globalImagePath.nonSelectRadio}
                                    marginRight={10}
                                    fontSize={14}
                                    titleColor={'rgb(25,27,28)'}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        setServiceLocation(2);
                                        setServiceLocationError('');
                                        serviceLocation == 2 ? null : setGrandTotal(grandTotal => grandTotal - serviceCharge);
                                        serviceLocation == 2 ? null : setTotalPrice(grandTotal => grandTotal + serviceCharge);
                                    }}
                                />
                            </View>}
                        {serviceType == 3 &&
                            <>
                                <RadioButton
                                    placeholder=""
                                    title={I18n.t('lbl_home')}
                                    checkedIcon={globalImagePath.selectRadio}
                                    uncheckedIcon={globalImagePath.nonSelectRadio}
                                    marginRight={10}
                                    fontSize={14}
                                    titleColor={'rgb(25,27,28)'}
                                    checked={serviceLocation == 1 ? true : false}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        setServiceLocation(1);
                                        setServiceLocationError('');
                                        serviceLocation == 1 ? null : setGrandTotal(grandTotal => grandTotal + serviceCharge);
                                        serviceLocation == 1 ? null : setTotalPrice(grandTotal => grandTotal + serviceCharge);
                                    }}
                                />
                                <View style={{ marginLeft: 10 }}>
                                    <RadioButton
                                        placeholder=""
                                        title={I18n.t('lbl_salon')}
                                        checked={serviceLocation == 2 ? true : false}
                                        checkedIcon={globalImagePath.selectRadio}
                                        uncheckedIcon={globalImagePath.nonSelectRadio}
                                        marginRight={10}
                                        fontSize={14}
                                        titleColor={'rgb(25,27,28)'}
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            setServiceLocation(2);
                                            setServiceLocationError('');
                                            serviceLocation == 2 ? null : setGrandTotal(grandTotal => grandTotal - serviceCharge);
                                            serviceLocation == 2 ? null : setTotalPrice(grandTotal => grandTotal + serviceCharge);
                                        }}
                                    />
                                </View>
                            </>}
                    </View>
                    <ErrorMessage text={serviceLocationError} />
                </View>
                <View style={{ width: '42%' }}>
                    {serviceLocation == 1 ?
                        <TouchableOpacity
                            onPress={() => { setVisibleAddressModal(true) }}
                            style={{
                                borderRadius: 5,
                                paddingHorizontal: 8,
                                paddingVertical: 7,
                                borderWidth: 0.8,
                                borderColor: colors.themeColor,
                                height: 45,
                                justifyContent: 'center'
                            }}
                        >
                            <View style={{}}>
                                <TouchableOpacity onPress={() => setVisibleAddressModal(true)}>
                                    <Text style={{ color: colors.darkShade, fontSize: 14, textAlign: 'center' }}>{addressData.length >= 1 ? 'Manage Location' : I18n.t('lbl_add_location')}</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                        : null}
                </View>
            </View>
        );
    }

    const _renderPaymentMethod = () => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#dddddd', borderBottomWidth: 1, borderBottomColor: '#dddddd', padding: 20 }}>
                <View style={{ width: '65%' }}>
                    <Text style={{
                        color: 'rgb(25,27,28)',
                        fontSize: 14,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                    }}
                    >
                        {I18n.t('lbl_select_payment_method')}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <RadioButton
                            placeholder=""
                            title={I18n.t('lbl_online')}
                            checkedIcon={globalImagePath.selectRadio}
                            uncheckedIcon={globalImagePath.nonSelectRadio}
                            marginRight={10}
                            fontSize={14}
                            titleColor={'rgb(25,27,28)'}
                            checked={paymentMethod == 1 ? true : false}
                            onPress={() => { Keyboard.dismiss(); setPaymentMethod(1); setPaymentMethodError(''); }}
                        />
                        {cashOptionAvailable <= 0 ?
                            <View style={{ marginLeft: 10 }}>
                                <RadioButton
                                    placeholder=""
                                    title={I18n.t('lbl_cash')}
                                    checked={paymentMethod == 2 ? true : false}
                                    checkedIcon={globalImagePath.selectRadio}
                                    uncheckedIcon={globalImagePath.nonSelectRadio}
                                    marginRight={10}
                                    fontSize={14}
                                    titleColor={'rgb(25,27,28)'}
                                    onPress={() => { Keyboard.dismiss(); setPaymentMethod(2); setIsChecked(0); setPaymentMethodError(''); }}
                                />
                            </View> : null}
                    </View>
                    <ErrorMessage text={paymentMethodError} />
                </View>
                {/* <View style={{ width: '35%' }}>
                    <TouchableOpacity
                        onPress={() => { setVisibleCardModal(true) }}
                        style={{
                            borderRadius: 5,
                            paddingHorizontal: 8,
                            paddingVertical: 7,
                            borderWidth: 0.8,
                            borderColor: colors.themeColor,
                            height: 45,
                            justifyContent: 'center'
                        }}
                    >
                        <View style={{}}>
                            <Text style={{ color: colors.darkShade, fontSize: 14, textAlign: 'center' }}>{I18n.t('lbl_add_card')}</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}
            </View >
        );
    }

    const _rendetItems = (title, value, type, endTime) => {

        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
                <View style={{ width: '50%' }}>
                    <Text style={{
                        color: 'rgb(25,27,28)',
                        fontSize: type == 'grand' ? 15 : 13,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                        textAlign: 'left',
                        fontWeight: type == 'grand' ? 'bold' : '100'
                    }}>{title}</Text>
                </View>
                <View style={{ width: '50%' }}>
                    <Text style={{
                        color: type == 'discount' ? 'rgb(11,199,117)' : 'rgb(25,27,28)',
                        fontSize: type == 'grand' ? 15 : 13,
                        fontFamily: fonts.type.NunitoSans_SemiBold,
                        textAlign: 'right',
                        fontWeight: type == 'grand' || type == "booking" ? 'bold' : '100'
                    }}>{type != "booking" ? `SAR ${value}` : `${value}`}{endTime ? `${' To ' + `${endTime}`}` : ''}</Text>
                </View>
            </View>
        );
    }

    const _renderAddress = (item, index) => {
        return (
            <View
                style={{
                    flex: 1,
                    marginVertical: 7,
                    backgroundColor: 'rgb(245,241,238)',
                    padding: 15,
                    borderRadius: 8
                }}>
                <RadioButton
                    placeholder=""
                    title={item.tag_location == 1 ? I18n.t('lbl_home') : item.tag_location == 2 ? I18n.t('lbl_office') : I18n.t('lbl_other')}
                    checkedIcon={globalImagePath.selectRadio}
                    uncheckedIcon={globalImagePath.nonSelectRadio}
                    marginRight={10}
                    fontSize={14}
                    titleColor={'rgb(25,27,28)'}
                    checked={item.active ? true : false}
                    onPress={async () => {
                        let addArr = [...addressData];
                        await addArr.map((itm, key) => {
                            if (key == index) {
                                itm.active = true;
                                setSelectedAddressID(itm._id);
                                setSelectedPlaceName(itm.address);
                            } else {
                                itm.active = false;
                            }
                        });
                        setAddressData(await addArr);
                    }}
                />
                <Text style={{ color: 'rgb(25,27,28)', fontSize: 14, fontFamily: fonts.type.NunitoSans_Regular }}>
                    {item.address}
                </Text>
                <Text style={{ color: 'rgb(25,27,28)', fontSize: 14, fontFamily: fonts.type.NunitoSans_Regular }}>
                    {item.landmark}
                </Text>
            </View>
        );
    };

    const _renderTags = (item, index) => {

        return (
            <TouchableOpacity
                onPress={() => { selectTag(item.title, index, item.value); }}
                style={item.active ? styles.deleteBtn_2 : styles.deleteBtn}>
                <Text style={item.active ? styles.btnText_2 : styles.btnText}>{item.title}</Text>
            </TouchableOpacity>

        );
    };

    const selectTag = (title, index, value) => {
        let Arr = [...tagData];
        for (var i = 0; i < Arr.length; i++) {
            if (i == index) {
                Arr[i].active = true;
                setTag(value);
            } else {
                Arr[i].active = false;
            }
        }
        setTagData(Arr);
    };

    const addAddress = () => {
        const landmark_error = validate("landmark", landmark);
        const placeName_errr = placeName == '' ? I18n.t('lbl_select_location') : '';

        setLandmarkError(landmark_error);
        setPlaceNameError(placeName_errr);

        if (lat == '' || lng == '') {
            showDangerToast(I18n.t('lbl_select_address_dropdown'));
        }

        if (
            landmark_error || placeName_errr
        ) {
        } else {
            setLoading(true)
            let data = {
                address: placeName,
                latitude: lat,
                longitude: lng,
                landmark: landmark,
                tag_location: tag,
            }

            // ***** api calling */
            postService('address/manage', data)
                .then(async res => {
                    //  console.log("manage add res ==> ", res);
                    if (res.data.status === 1) {
                        setLoading(false);
                        showToast(res.data.message);
                        setPlaceName('');
                        setLat('');
                        setLng('');
                        setLandmark('');
                        setTag(1);
                        let data = res.data.response;
                        let addArr = [];
                        await data && data.map((item, key) => {
                            if (item.isdefault == 1) {
                                item.active = true;
                                setSelectedAddressID(item._id);
                                setSelectedPlaceName(item.address);
                            } else {
                                item.active = false;
                            }
                            addArr.push(item);
                        });
                        setAddressData(await addArr);
                        setIsAddNewAddress(false);
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
    };

    const _renderEmptyAddressComponent = () => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center'
                }}>
                <Text style={{ marginTop: 20, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular }}>
                    {I18n.t('lbl_address_not_found')}
                </Text>
            </View>
        );
    };

    const _makeDefault = (index) => {

        let newCardData = [...cardData];
        newCardData.map((ele, i) => {
            if (i == index) {
                ele.status = 0;
            } else {
                ele.status = 1;
            }
        })

        setCardData(newCardData);
    }

    const _renderCards = (item, index) => {

        var str = item.card_number.replace(/\d(?=\d{4})/g, "*");
        return (
            <View
                style={{
                    flex: 1,
                    marginVertical: 7,
                    backgroundColor: 'rgb(245,241,238)',
                    padding: 15,
                    borderRadius: 8,

                }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <RadioButton
                            placeholder=""
                            title={str}
                            checkedIcon={globalImagePath.selectRadio}
                            uncheckedIcon={globalImagePath.nonSelectRadio}
                            marginRight={10}
                            fontSize={14}
                            titleColor={'rgb(25,27,28)'}
                            checked={item.active ? true : false}
                            onPress={async () => {
                                let cardArr = [...cardData];
                                await cardArr.map((itm, key) => {
                                    if (key == index) {
                                        itm.active = true;
                                        setSelectedCardID(itm._id);
                                        setSelectedCardNumber(itm.card_number);
                                    } else {
                                        itm.active = false;
                                    }
                                });
                                setCardData(await cardArr);
                            }}
                        />
                    </View>
                    {!item.status ? <View style={{ justifyContent: 'flex-end', }}>
                        <TouchableOpacity style={styles.defaultOuter}>
                            <Text style={styles.default_text}>{I18n.t('lbl_default')}</Text>
                        </TouchableOpacity>
                    </View> : null}
                </View>
                <Text style={{ marginLeft: width * (20 / 375), color: 'rgb(25,27,28)', fontSize: 14, fontFamily: fonts.type.NunitoSans_Regular }}>
                    {item.nameoncard}
                </Text>
                {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <TouchableOpacity style={styles.editOuter}>
                        <Text style={styles.btnText2}>{I18n.t('lbl_edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn}>
                        <Text style={styles.btnText}>{I18n.t('lbl_delete')}</Text>
                    </TouchableOpacity>
                    {item.status ? <TouchableOpacity style={styles.makeDefaultBtn} onPress={() => { _makeDefault(index) }}>
                        <Text style={styles.btnText2}>{I18n.t('lbl_make_default')}</Text>
                    </TouchableOpacity> : null}
                </View> */}
            </View>
        );
    };

    const addCard = () => {

        const cardNumberError = validate("card_number", cardNumber);
        const cardNameError = validate("card_name", cardName);
        const monthError = validate("card_month", cardMonth);
        const yearError = validate("card_year", cardYear);
        const cvvError = validate("card_cvv", cardCVV);
        const check2Error = validate("check2", setTerm);
        setCardNumberError(cardNumberError);
        setCardNameError(cardNameError);
        setCardMonthError(monthError);
        setCardYearError(yearError);
        setCardCVVError(cvvError);
        setCheckTermError(check2Error)

        if (
            cardNumberError || cardNameError || monthError || yearError || cvvError || check2Error
        ) {
        } else {
            setLoading(true)

            if (isDissbled) {
                return
            }
            isDissbled = true;

            let data = {
                card_number: cardNumber.replace(/\s+/g, '').trim(),
                nameoncard: cardName,
                month: cardMonth,
                year: cardYear,
                cvv: cardCVV,
                card_id: '',
                booking_id: bookingId,
                online_pay_amount: isChecked ? grandTotal - walletAmount : grandTotal

            }

            // console.log("card data", data);

            /* ***** api calling */
            postService('home/makeOrderPayment', data)
                .then(async res => {
                    // console.log("add card res ==> ", res);
                    if (res.data.status === 1) {
                        setLoading(false);
                        showToast(res.data.message);
                        setVisibleCardModal(false);
                        let webUrl= res.data.response;
                        navigation.navigate('Bookings')

                        setTimeout(() => { isDissbled = false; }, 2000)
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
    };

    const selectedCardpayment = () => {
        const cardError = validate("cardType", selectedCardID);
        const check2Error = validate("check2", setTerm);
        if (cardError) {
            showDangerToast(I18n.t('lbl_select_card_payment'));
            return;
        }

        if (check2Error) {
            showDangerToast('Please select term and condition');
            return;
        }

        if (cardError || check2Error) {
            setVisibleCardModal(true);
        } else {
            setLoading(true);
            let data = {
                card_id: selectedCardID,
                booking_id: bookingId,
                payment_by_wallet: isChecked ? 1 : 0,
                wallet_amount: isChecked ? walletAmount : 0,
                online_pay_amount: isChecked ? grandTotal - walletAmount : grandTotal
            }

            console.log(" from card data =>", data);
            // ***** api calling */
            postService('home/makeOrderPayment', data)
                .then(async res => {
                    setLoading(false);
                    console.log("add card res ==> ", res.data);
                    if (res.data.status === 1) {
                        setLoading(false);
                        showToast(res.data.message);
                        setVisibleCardModal(false);
                        setTimeout(() => {
                            let webUrl= res.data.response;
                            navigation.navigate('Bookings')
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
    }

    const applyDiscount = () => {
        const promocodeError = validate("promocode", promocode);

        setPromocodeError(promocodeError);

        if (
            promocodeError
        ) {
        } else {
            setLoading(true)
            let data = {
                offer_code: promocode,
            }

            // ***** api calling */
            postService('cart/applyOffer', data)
                .then(async res => {
                    //   console.log("applyOffer res ==> ", res);
                    if (res.data.status === 1) {
                        setLoading(false);
                        showToast(res.data.message);
                        setPromocode('');
                        setIsPromoApplied(true);
                        setDiscount(res.data.response.discount_value);
                        setOfferID(res.data.response.offer_id);
                        setGrandTotal(grandTotal => grandTotal - res.data.response.discount_value);
                    } else {
                        setLoading(false);
                        setPromocode('');
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
    };

    const removeDiscount = () => {
        setIsPromoApplied(false);
        setGrandTotal(grandTotal => grandTotal + discount);
        setPromocode('');
        setDiscount(0);
        setOfferID('');
    }

    const _renderEmptyCardComponent = () => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center'
                }}>
                <Text style={{ marginTop: 20, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular }}>
                    {I18n.t('lbl_no_card')}
                </Text>
            </View>
        );
    };

    const _getPlaceValue = (placeVal, lat, lng) => {
        setSearchModal(false);
        setPlaceName(placeVal)
        setLat(lat);
        setLng(lng);

        setTimeout(function () {
            setVisibleAddressModal(true);
        }, 100);

    }

    const closeAddressModal = async () => {
        setVisibleAddressModal(false);
    }

    const closeCardModal = async () => {
        setVisibleCardModal(false);
    }




    const placeOrder = () => {
        const serviceLocationError = validate("location", serviceLocation);
        const paymentMethodError = validate("payment_method", paymentMethod);
        const check2Error = validate("check2", setTerm);
        setServiceLocationError(serviceLocationError);
        setPaymentMethodError(paymentMethodError);
        setCheckTermError(check2Error);

        if (serviceLocation == 1 && selectedAddressID == '') {
            showDangerToast(I18n.t('lbl_select_location_address'));
            return;
        }

        if (serviceActive == false) {
            showDangerToast('Please remove inActive services from the cart.');
            return;
        }

        // if (paymentMethod == 1) {
        //     showDangerToast(I18n.t('lbl_select_card_payment'));
        //     return;
        // }

        if (serviceLocationError || paymentMethodError || check2Error) {

        } else {
            setLoading(true);
            const postData = {
                start_date: route.params.booking_date,
                slot: route.params.booking_time,
                endSlot: route.params.bookingEndTime,
                salon_id: salonID,
                payment_type: paymentMethod,
                service_type: serviceLocation,
                uaddress_id: serviceLocation == 1 ? selectedAddressID : '',
                total: grandTotal,
                base_fee: baseFee,
                taxes: taxes,
                service_charges: serviceLocation == 1 ? serviceCharge : 0,
                card_id: paymentMethod == 1 ? selectedCardID : '',
                offer_id: offerID,
                discount_value: discount,
                actual_amount: totalPrice,
                payment_by_wallet: isChecked ? 1 : 0,
                wallet_amount: isChecked ? walletAmount : ''
            };


            //    console.log(" book appointment data ==> ", postData);

            // // // ***** api calling */
            postService('home/bookslot', postData)
                .then(async res => {
                    console.log("home/bookslot res ==> ", res.data.response);
                    if (res.data.status === 1) {
                        var bookingId = res.data.response.booking_number;
                        setLoading(false);
                        setBookingId(res.data.response._id);

                        if (res.data.response.payment_status == 0 && res.data.response.status == 5) {
                            console.log("enter in if condition ==> ");
                            showToast(res.data.message);
                            setTimeout(() => {
                                setVisibleCardModal(true);
                            }, 5);

                        } else if (res.data.response.payment_status == 1 && res.data.response.status == 0) {
                            console.log("enter in else if 1 condition ==> ");
                            navigation.reset({
                                index: 0,
                                routes: [{
                                    name: 'Congratulation',
                                    params: bookingId
                                }],
                            });
                        } else if (res.data.response.payment_status == 0 && res.data.response.status == 0) {
                            console.log("enter in else if 1 condition ==> ");
                            navigation.reset({
                                index: 0,
                                routes: [{
                                    name: 'Congratulation',
                                    params: bookingId
                                }],
                            });
                        } else {
                            console.log("enter in else ");
                        }


                    } else {
                        setLoading(false);
                        setTimeout(function () {
                            showDangerToast(res.data.message);
                        }, 100);
                    }
                }
                )
                .catch(error => {
                    setLoading(false);
                    setTimeout(function () {
                        alert(error);
                    }, 100);
                });
        }
    }

    const showMapView = () => {

        navigation.navigate("LocationPicker", {
            screenName: 'Booking',
            currentLat: currentLat,
            currentLong: currentLng
        });
    }

    const selectLocation = () => {
        setVisibleAddressModal(true);
        // console.log("route.params =>", route.params);
        setPlaceName(route.params && route.params.selectedAddress ? route.params.selectedAddress.address : '');
        setCurrentLat(route.params && route.params.selectedAddress ? route.params.selectedAddress.latitude : '');
        setCurrentLng(route.params && route.params.selectedAddress ? route.params.selectedAddress.longitude : '');
        setLat(route.params && route.params.selectedAddress ? route.params.selectedAddress.latitude : '');
        setLng(route.params && route.params.selectedAddress ? route.params.selectedAddress.longitude : '');
    }

    const check2 = () => {
        // this.setState({ checked2: !this.state.checked2, check2Error: validate("check2", !this.state.checked2) });
        setCheckTerm(!setTerm)
        setCheckTermError(validate("check2", !setTerm))

    };
    var payAmount = isChecked ? grandTotal - walletAmount : grandTotal;
    return (

        <Container style={{ flex: 1 }}>
            <Loader loading={loading} />
            <GoogleSearchInput
                visible={searchModal}
                _placeValue={(value, lat, lng) => _getPlaceValue(value, lat, lng)}
                _goBack={() => {
                    setSearchModal(false);
                    setTimeout(function () {
                        setVisibleAddressModal(true);
                    }, 100);
                }}
            />
            <NavBar
                textColor={'black'}
                isLeftIconUrl={false}
                leftIcon={globalImagePath.back_icon}
                navigator={navigation}
                backgroundColor={'#ffffff'}
                isCenterImage={false}
                centerText={I18n.t('lbl_booking_detail')}
                titleTop={''}
            />
            <Modal transparent={true} visible={visibleAddressModal} onRequestClose={''}
                backdropTransitionOutTiming={0.5} useNativeDriver={true} animationIn="slideInLeft"
                animationOut="slideOutRight" animationType={'slide'}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: '100%', height: '100%' }}
                    onPress={() => { }}>
                    <Content
                        //  scrollEnabled={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                backgroundColor: 'transparent',
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "#ffffff",
                                    padding: 20,
                                    borderTopLeftRadius: 40,
                                    borderTopRightRadius: 40,
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{
                                        color: 'rgb(25,27,28)',
                                        fontSize: 18,
                                        fontFamily: fonts.type.NunitoSans_SemiBold,
                                    }}>{addressData.length >= 1 ? !isAddNewAddress ? I18n.t('lbl_manage_booking') : I18n.t('lbl_select_address') : I18n.t('lbl_select_address')}</Text>
                                    <TouchableOpacity onPress={() => closeAddressModal()}>
                                        <Image source={globalImagePath.crossIcon} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: isAddNewAddress ? '50%' : '40%' }}>
                                    <TouchableOpacity
                                        onPress={() => { setIsAddNewAddress(!isAddNewAddress) }}
                                        style={{
                                            borderRadius: 5,
                                            paddingHorizontal: 8,
                                            paddingVertical: 7,
                                            borderWidth: 0.8,
                                            borderColor: colors.themeColor,
                                            height: 45,
                                            marginTop: -10,
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <View style={{}}>
                                            <TouchableOpacity onPress={() => setIsAddNewAddress(!isAddNewAddress)}>
                                                <Text style={{ color: colors.darkShade, fontSize: 14, textAlign: 'center' }}>{isAddNewAddress ? I18n.t('lbl_select_frm_address') : I18n.t('lbl_add_new_address')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {isAddNewAddress ?
                                    <>
                                        <View style={{ borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5 }}>
                                            <View style={{ flexDirection: 'row' }}>

                                                <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_enter_location')}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    showMapView()
                                                    setVisibleAddressModal(false);
                                                    // setTimeout(function () {
                                                    //     setSearchModal(true);
                                                    // }, 100);
                                                }}
                                                style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                                                <Text style={{
                                                    borderRadius: 5,
                                                    // paddingHorizontal: 15,
                                                    color: placeName ? "#000" : "rgb(183,190,197)",
                                                    fontSize: 14,
                                                    flex: 1
                                                }}>
                                                    {placeName ? placeName : I18n.t('lbl_enter_location')}
                                                </Text>
                                                <Image source={globalImagePath.locationIcon} resizeMode="cover" style={{ alignSelf: 'center', height: 24, width: 20 }} />
                                            </TouchableOpacity>
                                        </View>
                                        <ErrorMessage text={placeNameError} />
                                        <TextInput
                                            isPlaceHolder={true}
                                            placeholder={I18n.t('lbl_landmark')}
                                            isLevelShow={true}
                                            level={I18n.t('lbl_landmark')}
                                            error={landmarkError}
                                            onChangeText={landmark => { setLandmark(landmark); setLandmarkError(validate("landmark", landmark)) }}
                                            value={landmark}
                                        />
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ color: 'rgb(110,118,130)' }}>{I18n.t('lbl_tag_location')}</Text>
                                            <FlatList
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                data={tagData}
                                                renderItem={({ item, index }) =>
                                                    _renderTags(item, index)
                                                }
                                                keyExtractor={(item, index) => String(index)}
                                            />

                                        </View>
                                        <View style={{ marginTop: 20, marginBottom: 10 }}>
                                            <Button
                                                label={I18n.t('lbl_add')}
                                                textSize={16}
                                                onPress={() => { addAddress() }}
                                            />
                                        </View>

                                    </> :
                                    <>
                                        <View style={{ flex: 1, marginTop: 7, height: addressData.length > 1 ? 200 : 150 }}>
                                            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                                                <View onStartShouldSetResponder={(): boolean => true}>
                                                    <FlatList
                                                        data={addressData}
                                                        renderItem={({ item, index }) => _renderAddress(item, index)}
                                                        keyExtractor={(item, index) => String(index)}
                                                        ListEmptyComponent={() => _renderEmptyAddressComponent()}
                                                    />
                                                </View>
                                            </ScrollView>
                                        </View>
                                        {addressData.length > 0 &&
                                            <View style={{ flex: 1, marginTop: 7 }}>
                                                <Button
                                                    label={I18n.t('lbl_submit')}
                                                    textSize={16}
                                                    onPress={async () => {
                                                        let addArr = [...addressData];
                                                        await addArr.map((itm, key) => {
                                                            if (itm.active) {
                                                                setSelectedAddressID(itm._id);
                                                                setSelectedPlaceName(itm.address);
                                                                setSelectedLandmark(itm.landmark);
                                                                setSelectedLat(itm.location && itm.location.coordinates[1]);
                                                                setSelectedLng(itm.location && itm.location.coordinates[0]);
                                                                setSelectedTag(itm.tag_location);
                                                            }
                                                        });
                                                        setVisibleAddressModal(false);
                                                    }}
                                                />
                                            </View>}
                                    </>
                                }
                            </View>
                        </TouchableOpacity>
                    </Content>
                </TouchableOpacity>
            </Modal>
            <Modal transparent={true} visible={visibleCardModal} onRequestClose={''} backdropTransitionOutTiming={0.5} useNativeDriver={true} animationIn="slideInLeft"
                animationOut="slideOutRight" animationType={'slide'}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: '100%', height: '100%', }}
                    onPress={() => { }}>
                    <Content
                        //  scrollEnabled={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                backgroundColor: 'transparent',
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "#ffffff",
                                    padding: 20,
                                    borderTopLeftRadius: 40,
                                    borderTopRightRadius: 40,
                                }}
                            >

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{
                                        color: 'rgb(25,27,28)',
                                        fontSize: 18,
                                        fontFamily: fonts.type.NunitoSans_SemiBold,
                                    }}>{isAddNewCard ? I18n.t('lbl_enter_card_details') : cardData.length > 0 ? I18n.t("lbl_manage_card") : I18n.t('lbl_select_card')}</Text>
                                    <TouchableOpacity onPress={() => closeCardModal()}>
                                        <Image source={globalImagePath.crossIcon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ width: isAddNewCard ? '100%' : '100%', flexDirection: 'row' }}>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: colors.darkShade, fontSize: 14, }}>
                                            {I18n.t('lbl_payment_amount')}
                                        </Text>
                                        <Text style={{ color: colors.darkShade, fontSize: 24, }}>
                                            {'SAR ' + payAmount.toFixed(2)}
                                        </Text>
                                    </View>
                                    <View style={{ alignSelf: 'center' }}>
                                        <TouchableOpacity onPress={() => setIsAddNewCard(!isAddNewCard)}>
                                            <Text style={{ textDecorationLine: 'underline', color: colors.darkShade, fontSize: 14, textAlign: 'center' }}>{isAddNewCard ? cardData.length > 0 ? I18n.t('lbl_select_card') : null : I18n.t('lbl_add_new_card')}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                {isAddNewCard ?
                                    <>
                                        <TextInput
                                            isPlaceHolder={true}
                                            placeholder={I18n.t('lbl_enter_name_card')}
                                            isLevelShow={false}
                                            maxLength={55}
                                            level={'Name on card'}
                                            error={cardNameError}
                                            onChangeText={cardName => {
                                                setCardName(cardName);
                                                setCardNameError(validate("card_name", cardName))
                                            }}
                                            value={cardName}
                                        />

                                        <View style={{ height: 40, borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5, justifyContent: 'center', marginTop: -5 }}>
                                            <TextInputMask
                                                type={'credit-card'}
                                                placeholder={I18n.t('lbl_card_number')}
                                                onChangeText={cardNumber => {
                                                    setCardNumber(cardNumber);
                                                    setCardNumberError(validate("card_number", cardNumber))
                                                }}
                                                value={cardNumber}
                                            />
                                        </View>
                                        {cardNumber.length != 19 ? (
                                            <ErrorMessage text={cardNumberError} />
                                        ) : null}
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: '48%' }}>

                                                <TouchableOpacity
                                                    style={{
                                                        justifyContent: "center",
                                                        borderBottomColor: "rgba(196,170,153,0.5)",
                                                        borderBottomWidth: 1,
                                                        marginTop: 0,
                                                        //marginBottom: 10,
                                                        paddingHorizontal: 0,
                                                        height: 50
                                                    }}
                                                    onPress={() => { handleMonthPress() }}
                                                >

                                                    {cardMonth ? (
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text
                                                                style={{
                                                                    fontFamily: fonts.type.NunitoSans_Regular,
                                                                    color: "#000000",
                                                                    flex: 1
                                                                }}
                                                            >{`${cardMonth}`}</Text>
                                                            <View style={{ justifyContent: 'center' }}>
                                                                <Image source={globalImagePath.dropIcon} />
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text
                                                                style={{
                                                                    fontFamily: fonts.type.NunitoSans_Regular,
                                                                    color: 'rgb(183,190,197)',
                                                                    fontSize: 14,
                                                                    flex: 1
                                                                }}
                                                            >{`${I18n.t("lbl_expiry_month")}`}</Text>
                                                            <View style={{ justifyContent: 'center' }}>
                                                                <Image source={globalImagePath.dropIcon} />
                                                            </View>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                                {cardMonthError.length > 0 && (
                                                    <ErrorMessage text={cardMonthError} />
                                                )}
                                            </View>
                                            <View style={{ width: '48%' }}>

                                                <TouchableOpacity
                                                    style={{
                                                        justifyContent: "center",
                                                        borderBottomColor: "rgba(196,170,153,0.5)",
                                                        borderBottomWidth: 1,
                                                        marginTop: 0,
                                                        //marginBottom: 10,
                                                        paddingHorizontal: 0,
                                                        height: 50
                                                    }}
                                                    onPress={() => handleYearPress()}
                                                >

                                                    {cardYear ? (
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text
                                                                style={{
                                                                    fontFamily: fonts.type.NunitoSans_Regular,
                                                                    color: "#000000",
                                                                    flex: 1
                                                                }}
                                                            >{`${cardYear}`}</Text>
                                                            <View style={{ justifyContent: 'center' }}>
                                                                <Image source={globalImagePath.dropIcon} />
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text
                                                                style={{
                                                                    fontFamily: fonts.type.NunitoSans_Regular,
                                                                    color: 'rgb(183,190,197)',
                                                                    fontSize: 14,
                                                                    flex: 1
                                                                }}
                                                            >{`${I18n.t("lbl_expiry_year")}`}</Text>
                                                            <View style={{ justifyContent: 'center' }}>
                                                                <Image source={globalImagePath.dropIcon} />
                                                            </View>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                                {cardYearError.length > 0 && (
                                                    <ErrorMessage text={cardYearError} />
                                                )}
                                            </View>
                                        </View>
                                        <TextInput
                                            isPlaceHolder={true}
                                            placeholder={I18n.t('lbl_enter_cvv')}
                                            isLevelShow={false}
                                            level={'Card CVV'}
                                            secureTextEntry={true}
                                            keyboardType={'number-pad'}
                                            error={cardCVVError}
                                            maxLength={3}
                                            onChangeText={cardCVV => {
                                                setCardCVV(cardCVV);
                                                setCardCVVError(validate("card_cvv", cardCVV))
                                            }}
                                            value={cardCVV}
                                        />
                                        <View style={{ marginTop: 20, marginBottom: 10 }}>
                                            <Button
                                                label={I18n.t('lbl_add')}
                                                textSize={16}
                                                onPress={() => { addCard() }}
                                            />
                                        </View>

                                    </> :
                                    <>
                                        <View style={{ flex: 1, marginTop: 7, height: addressData.length > 1 ? 200 : 150 }}>
                                            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                                                <View onStartShouldSetResponder={(): boolean => true}>
                                                    <FlatList
                                                        data={cardData}
                                                        nestedScrollEnabled={true}
                                                        renderItem={({ item, index }) => _renderCards(item, index)}
                                                        keyExtractor={(item, index) => String(index)}
                                                        ListEmptyComponent={() => _renderEmptyCardComponent()}
                                                    />
                                                </View>
                                            </ScrollView>
                                        </View>
                                        {cardData.length > 0 &&
                                            <View style={{ flex: 1, marginTop: 7 }}>
                                                <Button
                                                    label={I18n.t('lbl_submit')}
                                                    textSize={16}
                                                    onPress={async () => {
                                                        let cardArr = [...cardData];
                                                        await cardArr.map((itm, key) => {
                                                            if (itm.active) {
                                                                setSelectedCardID(itm._id);
                                                            }
                                                        });
                                                        selectedCardpayment();

                                                    }}
                                                />
                                            </View>}
                                    </>
                                }
                            </View>
                        </TouchableOpacity>
                    </Content>
                </TouchableOpacity>
            </Modal>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={{ flex: 1, marginTop: 5, marginTop: width * (10 / 375), paddingHorizontal: 20 }}>
                        <FlatList
                            data={services}
                            renderItem={({ item, index }) => _renderServices(item, index)}
                            keyExtractor={(item, index) => String(index)}
                            ListEmptyComponent={() => _renderEmptyComponent()}
                        />
                    </View>
                    {_renderServiceLocation()}
                    {serviceLocation == 1 ? selectedPlaceName != '' &&
                        <View style={{ backgroundColor: 'rgb(196,170,153)', padding: 20 }}>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 12,
                                fontFamily: fonts.type.NunitoSans_SemiBold,
                            }}
                            >{I18n.t('lbl_service_here')}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={globalImagePath.checkmark} />
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: 12,
                                    fontFamily: fonts.type.NunitoSans_SemiBold,
                                    marginLeft: 5
                                }}
                                >{selectedPlaceName}</Text>
                            </View>
                        </View>
                        : null}
                    {_renderPaymentMethod()}
                    {cashOptionAvailable > 0 ? <View style={{ flex: 1, flexDirection: 'row', borderTopColor: '#dddddd', borderBottomWidth: 1, borderBottomColor: '#dddddd', padding: 20 }}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.type.NunitoSans_bold, }}>{"Cancellation Charge : "}</Text>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, fontFamily: fonts.type.NunitoSans_SemiBold, }}>{cancelCharge + '%'}</Text>
                        </View>
                    </View> : null}
                    {selectedCardNumber != '' &&
                        <View style={{ backgroundColor: 'rgb(196,170,153)', padding: 20 }}>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 12,
                                fontFamily: fonts.type.NunitoSans_SemiBold,
                            }}
                            >{I18n.t('lbl_your_card')}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={globalImagePath.checkmark} />
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: 12,
                                    fontFamily: fonts.type.NunitoSans_SemiBold,
                                    marginLeft: 5
                                }}
                                >{selectedCardNumber.replace(/\d(?=\d{4})/g, "*")}</Text>
                            </View>
                        </View>}
                    <View style={{ padding: 20 }}>
                        <TouchableOpacity onPress={() => setIsShowPromoInput(!isShowPromoInput)} activeOpacity={1} >
                            <Text style={{
                                color: 'rgb(25,27,28)',
                                fontSize: 14,
                                fontFamily: fonts.type.NunitoSans_Regular,
                                letterSpacing: 1,
                                textDecorationLine: 'underline'
                            }}
                            >{I18n.t('lbl_apply_promo_code')}</Text>
                        </TouchableOpacity>
                        {/* {isShowPromoInput &&
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{width: '70%'}}>
                                <TextInput
                                    showIcon={true}
                                    isPlaceHolder={true}
                                    placeholder={'Enter promo code'}
                                    isLevelShow={false}
                                    error={promocodeError}
                                    onChangeText={(promocode) => {
                                        setPromocode(promocode);
                                        setPromocodeError(validate("promocode", promocode));
                                    }}
                                    value={promocode}
                                />
                            </View> 
                            <View style={{width: '25%', height: 50}}>
                                <TouchableOpacity
                                    style={{ ...CommonStyles.buttonStyle(), paddingHorizontal: 10 }}
                                    onPress={() => { applyDiscount() }}
                                >
                                    <Text style={{ ...CommonStyles.buttonTextStyle(14) }}>{'Apply'}</Text>
                                </TouchableOpacity>
                            </View>   
                        </View> } */}
                        {isPromoApplied ?
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgb(245,247,248)', padding: 15, justifyContent: 'space-between', marginTop: 10 }}>
                                <View style={{ width: '80%', flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: 'rgb(11,199,117)', width: 10, height: 10, borderRadius: 3, marginTop: 3 }} />
                                    <View style={{ marginLeft: 8 }}>
                                        <Text style={{
                                            color: 'rgb(11,199,117)',
                                            fontSize: 12,
                                            fontFamily: fonts.type.NunitoSans_SemiBold,
                                        }}
                                        >
                                            {I18n.t('lbl_coupon_apply_successfully')}
                                        </Text>
                                        <Text style={{
                                            color: 'rgb(55,51,48)',
                                            fontSize: 12,
                                            fontFamily: fonts.type.NunitoSans_SemiBold,
                                        }}
                                        >
                                            {I18n.t('lbl_discount')} SAR {discount}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={{ width: '15%' }} onPress={() => removeDiscount()}>
                                    <Image source={globalImagePath.trash} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: '70%' }}>
                                    <TextInput
                                        showIcon={true}
                                        isPlaceHolder={true}
                                        placeholder={I18n.t('lbl_enter_promo_code')}
                                        isLevelShow={false}
                                        error={promocodeError}
                                        onChangeText={(promocode) => {
                                            setPromocode(promocode);
                                            setPromocodeError(validate("promocode", promocode));
                                        }}
                                        value={promocode}
                                    />
                                </View>
                                <View style={{ width: '25%', height: 50 }}>
                                    <TouchableOpacity
                                        style={{ ...CommonStyles.buttonStyle(), paddingHorizontal: 10 }}
                                        onPress={() => { applyDiscount() }}
                                    >
                                        <Text style={{ ...CommonStyles.buttonTextStyle(14) }}>{I18n.t('lbl_Apply')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>}

                        <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => { navigation.navigate('TermAndCondition'); }}>
                            <Text style={{ fontSize: 14, textDecorationLine: 'underline' }}>{I18n.t('lbl_term_and_condition')}</Text>
                        </TouchableOpacity>

                        {/* <Checkbox
                            fontSize={14}
                            checked={setTerm}
                            onPress={() => check2()}
                            placeholder={I18n.t('lbl_accept_term')}
                        /> */}
                        <CheckBox
                            style={{ flex: 1, marginVertical: 10 }}
                            onClick={() => { check2() }}
                            isChecked={setTerm}
                            rightText={I18n.t('lbl_accept_term')}
                        />
                        {termError ? <Lable
                            style={{ marginLeft: 12, paddingTop: 5 }}
                            size={11}
                            color={'red'}
                            title={termError}
                        /> : null}
                        {paymentMethod == 1 ? walletAmount ?
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox
                                    style={{ flex: 1, marginVertical: 10 }}
                                    onClick={() => { setIsChecked(!isChecked); setPaymentMethod(1); }}
                                    isChecked={isChecked}
                                    rightText={I18n.t('lbl_use_wallet')}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>{I18n.t('lbl_wallet_sar')}</Text>
                                    <Text>{walletAmount.toFixed(2)}</Text>
                                </View>
                            </View>
                            : null : null}
                        <View style={{ marginTop: 10, marginBottom: 40 }}>
                            {_rendetItems(I18n.t('lbl_booking_date'), route.params.booking_date, "booking")}
                            {_rendetItems(I18n.t('lbl_booking_time'), route.params.booking_time, "booking", route.params.bookingEndTime)}
                            {_rendetItems(I18n.t('lbl_item_total'), subTotal)}
                            {_rendetItems(I18n.t('lbl_base_free'), baseFee)}
                            {_rendetItems(I18n.t('lbl_taxes'), taxes)}
                            {serviceLocation == 1 ? _rendetItems(I18n.t('lbl_service_change'), serviceCharge) : null}
                            {discount > 0 ? _rendetItems(I18n.t('lbl_discount_any'), `-${discount}`, I18n.t('lbl_discount')) : null}
                            {_rendetItems(I18n.t('lbl_grand_total'), grandTotal, I18n.t('lbl_grand'), '')}
                        </View>
                    </View>
                </View>
            </ScrollView>
            {!bookingId ?
                <View style={{ position: 'absolute', width: '100%', bottom: 0 }}>
                    <View style={{ marginTop: 10, }}>
                        <TouchableOpacity
                            style={{ ...CommonStyles.buttonStyle(), borderRadius: 0, paddingHorizontal: 10 }}
                            onPress={() => placeOrder()}
                        >
                            <Text style={{ ...CommonStyles.buttonTextStyle(16) }}>{I18n.t('lbl_place_order')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <View style={{ position: 'absolute', width: '100%', bottom: 0 }}>
                    <View style={{ marginTop: 10, }}>
                        <TouchableOpacity
                            style={{ ...CommonStyles.buttonStyle(), borderRadius: 0, paddingHorizontal: 10 }}
                            onPress={() => { setVisibleCardModal(true); }}
                        >
                            <Text style={{ ...CommonStyles.buttonTextStyle(16) }}>{I18n.t('lbl_place_order')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </Container>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
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
    renderOuterView_remove: {
        flexDirection: 'row',
        marginBottom: width * (10 / 375),
        //  paddingBottom: 2,
        // paddingRight: 2,
        // paddingTop: 2,
        // paddingLeft: 2,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.1)',


    },
    image: {
        height: width * (60 / 375),
        width: width * (60 / 375),
        borderRadius: 10,
    },
    deleteBtn: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.themeColor,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: colors.whiteColor,
        paddingHorizontal: 10,
        paddingVertical: 8
    },
    deleteBtn_2: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.whiteColor,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: colors.themeColor,
        paddingHorizontal: 10,
        paddingVertical: 8
    },
    btnText: {
        fontFamily: fonts.type.NunitoSans_SemiBold,
        fontSize: width * (12 / 375),
        color: colors.themeColor
    },
    btnText_2: {
        fontFamily: fonts.type.NunitoSans_SemiBold,
        fontSize: width * (12 / 375),
        color: colors.whiteColor
    },
    btnText2: {
        fontFamily: fonts.type.NunitoSans_SemiBold,
        fontSize: width * (12 / 375),
        color: colors.whiteColor
    },
    editOuter: {
        borderRadius: width * (5 / 375),
        backgroundColor: colors.themeColor,
        paddingHorizontal: width * (30 / 375),
        paddingVertical: width * (8 / 375)
    },
    // deleteBtn: {
    //     borderWidth: 1,
    //     borderColor: colors.themeColor,
    //     marginHorizontal: width * (15 / 375),
    //     borderRadius: width * (5 / 375),
    //     backgroundColor: colors.whiteColor,
    //     paddingHorizontal: width * (20 / 375),
    //     paddingVertical: width * (8 / 375)
    // },
    makeDefaultBtn: {
        borderRadius: width * (5 / 375),
        backgroundColor: colors.themeColor,
        paddingHorizontal: width * (20 / 375),
        paddingVertical: width * (8 / 375)
    },
    defaultOuter: {
        paddingHorizontal: width * (10 / 375),
        paddingVertical: width * (3 / 375),
        borderRadius: 3,
        backgroundColor: colors.lightThemeColor
    },
    default_text: {
        color: '#fff',
        fontFamily: fonts.type.NunitoSans_Regular,
        fontSize: width * (10 / 375)
    },
});