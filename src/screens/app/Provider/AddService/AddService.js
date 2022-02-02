//***** import libraries */
import React from 'react';
import { Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TextInput from '../../../../components/TextInput';
import Button from '../../../../components/Button';
import { Container, Content } from 'native-base';
import { postService } from '../../../../services/postServices';
import I18n from '../../../../I18n';
import { showToast, showDangerToast } from '../../../../components//ToastMessage';
import validate from '../../../../components/Validations/validate_wrapper';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import { CommonStyles } from '../../../../assets/css';
import ErrorMessage from '../../../../components/ErrorMessage';
import ImagePicker from 'react-native-image-picker';
import { countries } from '../../../../constants/countryCode';
import {
    check,
    PERMISSIONS,
    openSettings,
    request,
} from 'react-native-permissions';
import RNPicker from '../../../../components/RNPicker';
import { getService } from '../../../../services/getServices';
export default function AddService({ navigation, route }) {
    const [userID, setUserID] = React.useState('');
    const [imageName, setImageName] = React.useState('');
    const [image, setImage] = React.useState('');
    const [imageError, setImageError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [serviceName, setServiceName] = React.useState('');
    const [serviceNameError, setServiceNameError] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [priceError, setPriceError] = React.useState('');
    const [isImageUpdate, setIsImageUpdate] = React.useState(false);
    const [selectCountry, setSelectCountry] = React.useState(I18n.t('lbl_service_type'));
    const [serviceType, setServiceType] = React.useState([]);
    const [countryError, setCountryError] = React.useState('');
    const [serviceId, setServiceId] = React.useState('');
    const [id, setId] = React.useState('');
    const [edit, setEdit] = React.useState(false);
    React.useEffect(() => {


        let ser_id = route.params && route.params.serviceDetails._id;
        if (ser_id) {
            setId(ser_id)
        }
        AsyncStorage.getItem('user', (err1, item1) => {
            var userDetail = JSON.parse(item1);
            setUserID(userDetail._id);
        });
        getServiceList();

    }, [navigation]);

    //***** For getting salon service */
    const getServiceList = () => {
        setLoading(true);
        //***** api calling */ 
        getService('salon/serviceList')
            .then(res => {
                if (res.data.status === 1) {
                    setLoading(false);
                    let data = res.data.response;
                    // console.log("data =>", data);
                    setServiceType(data)
                    let serviceId = route.params && route.params.serviceDetails && route.params.serviceDetails._id;

                    if (serviceId) {
                        setEdit(true);
                        getServiceDetails(serviceId, data);
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


    //***** For getting salon service */
    const getServiceDetails = (id, listData) => {
        const data = {
            _id: id
        }
        //console.log("data =>", data, listData);
        setLoading(true);
        //***** api calling */ 
        postService('salon/detail', data)
            .then(res => {
                if (res.data.status === 1) {
                    setLoading(false);

                    let data = res.data.response;
                    for (let i = 0; listData.length; i++) {
                        if (listData[i]._id == data.service_id) {
                            setSelectCountry(listData[i].name);
                            break;
                        }

                    }
                    // let serviceName = getIndex(listData, data.service_id);
                    // console.log("serviceName =>", serviceName);
                    setServiceName(data.salon_service);
                    setServiceId(data.service_id);
                    setImageName(data.image);
                    setImage(data.image);
                    setPrice(data.price);

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

    const addService = () => {
        //***** For validate input fields */ //price

        const price_error = validate("servicePrice", price);
        const serviceNameError = validate("serviceName", serviceName);
        const image_error = image == '' ? 'Please upload service image' : '';
        const service_type = serviceId == '' ? I18n.t('lbl_select_service') : ''
        setPriceError(price_error);
        setServiceNameError(serviceNameError);
        setImageError(image_error)
        setCountryError(service_type)
        if (
            price_error || serviceNameError || image_error

        ) {
        } else {
            setLoading(true);
            let body = new FormData();
            if (isImageUpdate) {
                body.append('image', {
                    uri: image,
                    name: 'avatar.png',
                    filename: 'avatar.png',
                    type: 'image/png',
                });
            }

            body.append('salon_service', serviceName);
            body.append('price', price);
            body.append('service_id', serviceId);
            if (id) {
                body.append("_id", id);
            }
            console.log("body =>", body);

            let apiName = edit ? 'salon/edit-service' : 'salon/add-service';
            // console.log("apiName =>", apiName);
            // ***** api calling */
            postService(apiName, body)
                .then(res => {

                    if (res.data.status === 1) {

                        showToast(res.data.message);
                        setTimeout(() => {
                            navigation.goBack();
                        }, 1000)
                        setTimeout(() => {
                            setLoading(false);
                        }, 1000)
                    } else {
                        setLoading(false);
                        var message = '';
                        res.data.errors.map((val) => {
                            message += Object.values(val) + ' '
                        })
                        setTimeout(function () {
                            showDangerToast(message != null ? message : res.data.message);
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

    const checkPhotoPermissions = () => {
        if (Platform.OS == 'ios') {
            Promise.all([
                check(PERMISSIONS.IOS.CAMERA),
                check(PERMISSIONS.IOS.PHOTO_LIBRARY),
            ]).then(([cameraStatus, photosStatus]) => {
                console.log({ cameraStatus, photosStatus });
                if (cameraStatus == 'blocked' || photosStatus == 'blocked') {
                    confirmAlert();
                } else {
                    pickSingleImageHandler();
                }
            });
        } else if (Platform.OS == 'android') {
            Promise.all([
                check(PERMISSIONS.ANDROID.CAMERA),
                check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
            ]).then(([cameraStatus, photosStatus]) => {
                console.log({ cameraStatus, photosStatus });
                if (cameraStatus == 'blocked' || photosStatus == 'blocked') {
                    confirmAlert();
                } else {
                    pickSingleImageHandler();
                }
            });
        }
    };

    // ***** Function for uploading images * /
    const pickSingleImageHandler = () => {
        ImagePicker.showImagePicker(
            { title: 'Pick an Image', maxWidth: 800, maxHeight: 600 },
            res => {
                if (res.didCancel) {
                } else if (res.error) {
                } else {

                    setImage(res.uri);
                    setImageName(res.fileName)
                    setIsImageUpdate(true);
                    setImageError(validate('image', res.uri));
                }
            },
        );
    };

    const onSelectLanguage = (item, index) => {
        setServiceId(item._id)
        setSelectCountry(item.name);
        setCountryError(validate('serviceType', item.name));
    }

    //***** For rendering UI */
    return (
        <Container>
            <Loader loading={loading} />
            <NavBar
                textColor={'black'}
                isLeftIconUrl={false}
                leftIcon={globalImagePath.back_icon}
                navigator={navigation}
                backgroundColor={'#ffffff'}
                title={I18n.t('lbl_add_service')}
                isCenterImage={false}
                centerText={I18n.t('lbl_add_service')}
                navigation="HomePage"
                titleTop={''}
            />

            <Content
                style={{}}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
                enableResetScrollToCoords={false}
            //enableOnAndroid={true}
            >
                <View style={styles.container}>
                    <TextInput
                        showIcon={true}
                        isPlaceHolder={true}
                        placeholder={I18n.t('lbl_service_name')}
                        isLevelShow={true}
                        level={I18n.t('lbl_service_name')}
                        error={serviceNameError}
                        onChangeText={serviceName => { setServiceName(serviceName); setServiceNameError(validate("serviceName", serviceName, "", true)); }}
                        value={serviceName}
                    />

                    <View style={{ marginTop: 10, marginBottom: 20 }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_service_type')}</Text>
                        </View>

                        <View style={{ borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5, }}>
                            {selectCountry ?
                                <RNPicker
                                    ifCountry={true}
                                    dataSource={serviceType}
                                    dummyDataSource={serviceType}
                                    defaultValue={serviceType != "" ? true : false}
                                    pickerTitle={'hello'}
                                    showSearchBar={true}
                                    searchBarPlaceHolder={'jjjjjj'}
                                    disablePicker={selectCountry.length > 0 ? false : true}
                                    changeAnimation={"none"}
                                    searchBarPlaceHolder={I18n.t('lbl_search_service')}
                                    showPickerTitle={false}
                                    selectedLabel={selectCountry}
                                    placeHolderLabel={selectCountry}
                                    placeholderColor={'#4782c5'}
                                    selectedValue={(index, item) =>
                                        onSelectLanguage(item, index)
                                    }
                                    selectedId={serviceId}
                                    value={selectCountry}
                                />
                                : null}
                        </View>
                        {countryError != '' ? <ErrorMessage text={I18n.t('lbl_select_service')} /> : null}
                        {/* <ErrorMessage text={countryError} /> */}
                    </View>
                    <View>
                        <View style={{ borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5 }}>
                            <View style={{ flexDirection: 'row' }}>

                                <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_upload_image')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { checkPhotoPermissions() }} style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                                <Text style={{
                                    borderRadius: 5,
                                    //  paddingHorizontal: 15,
                                    color: imageName ? "#000" : "rgb(183,190,197)",
                                    fontSize: 14,
                                    flex: 1
                                }}>
                                    {imageName ? imageName : I18n.t('lbl_image')}
                                </Text>
                                <Image source={globalImagePath.upload} resizeMode="cover" style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>

                        </View>
                        {imageError != '' ? <ErrorMessage text={I18n.t('err_upload_image')} /> : null}
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <TextInput
                            showIcon={true}
                            isPlaceHolder={true}
                            placeholder={'SAR 20.00'}
                            isLevelShow={true}
                            level={I18n.t('lbl_price')}
                            keyboardType={'numeric'}
                            error={priceError}
                            onChangeText={price => { setPrice(price); setPriceError(validate("servicePrice", price, "", true)); }}
                            value={`${price}`}
                        />

                    </View>
                    <View style={{ marginTop: 20, marginBottom: 10 }}>
                        <Button
                            label={I18n.t(edit ? 'lbl_edit' : 'lbl_add_service')}
                            textSize={16}
                            onPress={() => { addService() }}
                        />
                    </View>
                </View>


            </Content>

        </Container>
    );
}

//***** Define style */
const styles = {
    container: {
        paddingHorizontal: 20,
    },
};
