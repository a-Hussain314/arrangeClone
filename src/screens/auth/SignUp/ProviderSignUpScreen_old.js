import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, FlatList, Keyboard, ScrollView } from 'react-native';
import { globalImagePath } from '../../../constants/globalImagePath';
import { Container, Content } from 'native-base';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import { CommonStyles } from '../../../assets/css';
import validate from '../../../components/Validations/validate_wrapper';
import * as Animatable from 'react-native-animatable';
import { showToast, showDangerToast } from '../../../components/ToastMessage';
import { fonts, metrics, colors } from '../../../Theme';
import { postService } from '../../../services/postServices';
import { RadioButton } from '../../../components/index';

import Loader from '../../../components/Loader';
import I18n from '../../../I18n';
import GoogleSearchInput from '../../../components/googleSearchPlaceModal';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import ErrorMessage from '../../../components/ErrorMessage';
import { normalize } from '../../../components/Dimensions';
import {
    check,
    PERMISSIONS,
    openSettings,
    request,
} from 'react-native-permissions';
import font from '../../../Theme/font';
const height = metrics.screenHeight;
const width = metrics.screenWidth;
export default class ProviderSignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            emailError: '',
            phone: '',
            phoneError: '',
            password: '',
            passwordError: '',
            confirmPassword: '',
            confirmPasswordError: '',
            name: "",
            nameError: "",
            salonName: "",
            salonNameError: "",
            description: "",
            descriptionError: "",
            langVal: '+966',
            serviceType: 1,
            setImage: '',
            docFile: "",
            docFileError: "",
            docUri: "",
            loading: false,
            docArray: [],
            lat: '',
            lng: '',
            searchModal: false,
            placeName: '',
            placeNameError: ''
        };
    }

    signupButtonPressed = () => {


        //***** For validate input field */
        const descriptionError = validate("description", this.state.description);
        // const nameError = validate("name", this.state.name);
        const salonNameError = validate("salonName", this.state.salonName);
        const phoneError = validate('phone', this.state.phone);
        const emailError = validate('email', this.state.email);
        const passwordError = validate('password', this.state.password);
        const docFileError = this.state.docArray.length == 0 ? I18n.t('err_document') : '';
        const placeName_errr = this.state.placeName == '' ? I18n.t('err_select_location') : '';
        const confirmPasswordError = validate(
            'confirm_password',
            this.state.confirmPassword,
            this.state.password,
        );

        this.setState({
            descriptionError: descriptionError,
            phoneError: phoneError,
            // nameError: nameError,
            salonNameError: salonNameError,
            emailError: emailError,
            passwordError: passwordError,
            docFileError: docFileError,
            confirmPasswordError: confirmPasswordError,
            placeNameError: placeName_errr
        });

        if (confirmPasswordError || salonNameError || phoneError || emailError || passwordError || descriptionError || placeName_errr || docFileError) {
            // this.signupBtn.shake();

        } else {
            this.setState({
                loading: true,
            });

            let body = new FormData();

            if (this.state.setImage) {
                body.append('profile', {
                    uri: this.state.setImage,
                    name: 'avatar.png',
                    filename: 'avatar.png',
                    type: 'image/png',
                });
            }
            // body.append('first_name', this.state.name);
            body.append('role', 3);
            body.append('email', this.state.email.toLowerCase());
            body.append('city', 'dholpur');
            body.append('description', this.state.description);
            // body.append('pdf', this.state.docUri);
            if (this.state.docArray.length != 0) {
                this.state.docArray.forEach((item, i) => {
                    console.log("item doc", item.uri);
                    body.append("pdf", {
                        uri: item.uri,
                        type: item.type,
                        name: "pdf" + i + ".pdf",
                    });
                });
            }
            body.append('salon_name', this.state.salonName);
            body.append('servicetype', this.state.serviceType);
            body.append('phoneno', this.state.phone);
            body.append('password', this.state.password);
            body.append('country_code', this.state.langVal);
            body.append('latitude', this.state.lat);
            body.append('longitude', this.state.lng);
            body.append('address', this.state.placeName);
            console.log("body ==>", body);
            //***** api calling */

            postService("register", body)
                .then(res => {
                    console.log("register ==>", res);

                    if (res.data.status === 1) {
                        this.setState({
                            loading: false,
                        });
                        setTimeout(() => {
                            showToast(res.data.message);
                            this.props.navigation.navigate('VerifyOtp', {
                                screenName: 'register',
                                email: this.state.email,
                                password: this.state.password,
                            });
                        }, 100);
                    } else {
                        this.setState({
                            loading: false,
                        });
                        var message = '';
                        if (res?.data?.errors != '') {
                            res?.data?.errors?.map((val) => {
                                message += Object.values(val) + ' '
                            })
                        }
                        setTimeout(function () {
                            showDangerToast(message != '' ? message : res.data.message);
                        }, 100);

                    }
                })
                .catch(error => {
                    this.setState({
                        loading: false,
                    });
                    setTimeout(function () {
                        alert(error);
                    }, 100);
                });
        }
    };
    onSelectLanguage = (lang, index) => {

        this.setState({
            langVal: lang.dc
        })

    }

    check = (f) => {
        this.setState({ serviceType: f })
    };

    getDocument = async () => {
        // Pick a single file
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText],
            });
            console.log("res =>", res);
            this.setState({ docArray: res, docFileError: '' })
            // res.map((ele) => {
            //     console.log("ele.uri =>", ele.uri);
            // })
            // this.setState({ docFile: res.name, docUri: res.uri })

            // console.log(
            //     res.uri,
            //     res.type, // mime type
            //     res.name,
            //     res.size
            // );
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    confirmAlert = () => {
        Alert.alert(
            '"ArrangeApp" Would Like to Access Your Camera and Photos',
            'Need for upload photo',
            [
                {
                    text: 'Not Allow',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                { text: 'Open Settings', onPress: () => openSettings() },
            ],
        );
    };

    checkPhotoPermissions = () => {
        if (Platform.OS == 'ios') {
            Promise.all([
                check(PERMISSIONS.IOS.CAMERA),
                check(PERMISSIONS.IOS.PHOTO_LIBRARY),
            ]).then(([cameraStatus, photosStatus]) => {
                console.log({ cameraStatus, photosStatus });
                if (cameraStatus == 'blocked' || photosStatus == 'blocked') {
                    this.confirmAlert();
                } else {
                    this.pickImageHandler();
                }
            });
        } else if (Platform.OS == 'android') {
            Promise.all([
                check(PERMISSIONS.ANDROID.CAMERA),
                check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
            ]).then(([cameraStatus, photosStatus]) => {
                console.log({ cameraStatus, photosStatus });
                if (cameraStatus == 'blocked' || photosStatus == 'blocked') {
                    this.confirmAlert();
                } else {
                    this.pickImageHandler();
                }
            });
        }
    };

    //***** Function for uploading images */
    pickImageHandler = () => {
        ImagePicker.showImagePicker(
            { title: 'Pick an Image', maxWidth: 800, maxHeight: 600 },
            res => {
                if (res.didCancel) {
                } else if (res.error) {
                } else {
                    console.log("response.uri =>", res.uri);
                    this.setState({ setImage: res.uri });
                    //setImage(res.uri);
                    //   setIsImageUpdate(true);
                    //   setImageError(validate('image', res.uri));
                }
            },
        );
    };

    _getPlaceValue = (placeVal, lat, lng) => {
        this.setState({ searchModal: false, placeName: placeVal, lat: lat, lng: lng, placeNameError: '' })


        // setLat(lat);
        // setLng(lng);
    }

    deleteDoc = (item, i) => {

        const index = this.state.docArray.findIndex(i => i.name === item.name);;
        if (index > -1) {
            this.state.docArray.splice(index, 1);
        }
        this.setState({ docArray: this.state.docArray });
    }

    renderDocList = (item, index) => {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 5, paddingVertical: 5 }}>
                <View style={{ flex: 1 }}>
                    <Text>{item.name}</Text>
                </View>
                <TouchableOpacity onPress={() => { this.deleteDoc(item, index) }} style={{ padding: 5, right: 5, }}>
                    <Image source={globalImagePath.crossImage} />
                </TouchableOpacity>
            </View>
        )
    }


    render() {

        return (
            <Container style={{ flex: 1, backgroundColor: colors.darkShade }}>
                <GoogleSearchInput
                    visible={this.state.searchModal}
                    _placeValue={(value, lat, lng) => this._getPlaceValue(value, lat, lng)}
                    _goBack={() => { this.setState({ searchModal: false }) }}
                />
                <Loader loading={this.state.loading} />
                <View style={{ backgroundColor: colors.darkShade }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity
                                style={{
                                    paddingLeft: 20,
                                    paddingRight: 10,
                                    marginTop: Platform.OS == 'ios' ? 7 : 15,

                                }}
                                onPress={() => this.props.navigation.goBack()}>
                                <Image source={globalImagePath.back_icon} resizeMode="cover" style={{ tintColor: "#fff" }} />
                            </TouchableOpacity>
                            {/* <View style={{ justifyContent: 'flex-end', }}>
                                <Text style={{ color: colors.whiteColor, fontFamily: font.type.NunitoSans_bold }}>{'Sign up'}</Text>
                            </View> */}
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 30, alignItems: 'center' }}>

                        <Animatable.View animation="slideInDown">
                            <View style={{ paddingHorizontal: 60, alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                                <TouchableOpacity onPress={() => this.checkPhotoPermissions()}>
                                    <Image

                                        source={this.state.setImage ? { uri: this.state.setImage } : globalImagePath.user_dummy}
                                        style={{
                                            width: normalize(100),
                                            height: normalize(100),
                                            borderRadius: normalize(50 / 2),
                                            // marginTop: normalize(-50),
                                        }}
                                        resizeMode={'cover'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{}} onPress={() => this.checkPhotoPermissions()}>
                                    <Image
                                        source={globalImagePath.imageEdit}
                                        style={{
                                            marginTop: normalize(-15),
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Animatable.View>
                    </View>
                </View>
                <ScrollView 
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}                  
                >
                    <View style={{ backgroundColor: colors.darkShade, flex: 1, }}>

                        <View style={styles.outer_container}>

                            <View style={styles.container}>
                                <TextInput
                                    showIcon={true}
                                    isPlaceHolder={true}
                                    placeholder={I18n.t('lbl_dummy_salon_name')}
                                    isLevelShow={true}
                                    level={I18n.t('lbl_salon_name')}
                                    error={this.state.salonNameError}
                                    onEndEditing={() => {
                                        this.setState({
                                            salonName: this.state.salonName,
                                        });
                                    }}
                                    onChangeText={salonName => this.setState({ salonName: salonName, salonNameError: validate("salonName", salonName, "", true) })}
                                    value={this.state.salonName}
                                />

                                <TextInput
                                    isPlaceHolder={true}
                                    placeholder={I18n.t('lbl_email')}
                                    isLevelShow={true}
                                    level={I18n.t('lbl_email')}
                                    error={this.state.emailError}
                                    keyboardType={'email-address'}
                                    onEndEditing={() => {
                                        this.setState({
                                            email: this.state.email.toLowerCase(),
                                        });
                                    }}
                                    onChangeText={email =>
                                        this.setState({
                                            email: email,
                                            emailError: validate('email', email),
                                        })
                                    }
                                    value={this.state.email ? this.state.email : ''}
                                />

                                <TextInput
                                    picker={true}
                                    onSelect={(val) => this.onSelectLanguage(val)}
                                    langVal={this.state.langVal}
                                    isPlaceHolder={true}
                                    placeholder={I18n.t('lbl_enter_phone')}
                                    isLevelShow={true}
                                    level={I18n.t('lbl_phone_number')}
                                    error={this.state.phoneError}
                                    keyboardType={'number-pad'}
                                    onChangeText={phone => this.setState({ phone: phone, phoneError: validate("phone", phone, "", true) })}
                                    value={this.state.phone}
                                />


                                <TextInput
                                    isPlaceHolder={true}
                                    placeholder={I18n.t('lbl_enter_password')}
                                    isLevelShow={true}
                                    secureTextEntry={true}
                                    level={I18n.t('lbl_password')}
                                    error={this.state.passwordError}
                                    onChangeText={password => this.setState({ password: password, passwordError: validate("password", password, "", true) })}
                                    value={this.state.password}
                                />

                                <TextInput
                                    isPlaceHolder={true}
                                    placeholder={I18n.t('lbl_confirm_password')}
                                    isLevelShow={true}
                                    secureTextEntry={true}
                                    level={I18n.t('lbl_confirm_password')}
                                    error={this.state.confirmPasswordError}
                                    onChangeText={confirmPassword =>
                                        this.setState({
                                            confirmPassword: confirmPassword,
                                            confirmPasswordError: validate(
                                                'confirm_password',
                                                confirmPassword,
                                                this.state.password,
                                            ),
                                        })
                                    }
                                    value={this.state.confirmPassword}
                                />


                                <View style={{}}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_service_type')}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "flex-start", marginVertical: 5 }}>
                                        <RadioButton
                                            placeholder=""
                                            title={I18n.t('lbl_home')}
                                            checkedIcon={globalImagePath.selectRadio}
                                            uncheckedIcon={globalImagePath.nonSelectRadio}
                                            marginRight={10}
                                            fontSize={14}
                                            checked={this.state.serviceType == 1 ? true : false}
                                            onPress={() => { this.check(1), Keyboard.dismiss() }}
                                        />
                                        <View style={{ marginLeft: 10 }}>
                                            <RadioButton
                                                placeholder=""
                                                title={I18n.t('lbl_salon')}
                                                checked={this.state.serviceType == 2 ? true : false}
                                                checkedIcon={globalImagePath.selectRadio}
                                                uncheckedIcon={globalImagePath.nonSelectRadio}
                                                marginRight={10}
                                                fontSize={14}
                                                onPress={() => { Keyboard.dismiss(); this.check(2) }}
                                            />
                                        </View>
                                        <View style={{ marginLeft: 10 }}>
                                            <RadioButton
                                                placeholder=""
                                                title={I18n.t('lbl_both')}
                                                checked={this.state.serviceType == 3 ? true : false}
                                                checkedIcon={globalImagePath.selectRadio}
                                                uncheckedIcon={globalImagePath.nonSelectRadio}
                                                marginRight={10}
                                                fontSize={14}
                                                onPress={() => { Keyboard.dismiss(); this.check(3) }}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: 20, borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5 }}>
                                    <View style={{ flexDirection: 'row' }}>

                                        <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_enter_location')}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { this.setState({ searchModal: true }) }} style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                                        <Text style={{
                                            borderRadius: 5,
                                            paddingRight: 15,
                                            color: this.state.placeName ? "#000" : "rgb(183,190,197)",
                                            fontSize: 14,
                                            flex: 1
                                        }}>
                                            {this.state.placeName ? this.state.placeName : "Location"}
                                        </Text>
                                        <Image source={globalImagePath.locationIcon} resizeMode="cover" style={{ alignSelf: 'center', height: 24, width: 20 }} />
                                    </TouchableOpacity>

                                </View>
                                { this.state.placeNameError.length > 0  && <ErrorMessage text={this.state.placeNameError} />}
                                <View style={{}}>
                                    <TextInput
                                        textAlignVertical={'top'}
                                        height={100}
                                        isPlaceHolder={true}
                                        placeholder={I18n.t('lbl_description')}
                                        isLevelShow={true}
                                        level={I18n.t('lbl_description')}
                                        error={this.state.descriptionError}
                                        onEndEditing={() => {
                                            this.setState({
                                                description: this.state.description.toLowerCase(),
                                            });
                                        }}
                                        onChangeText={description => this.setState({ description: description, descriptionError: validate("description", description, "", true) })}
                                        value={this.state.description}
                                    />
                                </View>
                                <View>
                                    <View style={{ borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5 }}>
                                        <View style={{ flexDirection: 'row' }}>

                                            <Text style={{ ...CommonStyles.InputLabelStyle() }}>{I18n.t('lbl_upload_doc')}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.getDocument()} style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                                            <Text style={{
                                                borderRadius: 5,
                                                //  paddingHorizontal: 15,
                                                color: this.state.docFile ? "#000" : "rgb(183,190,197)",
                                                fontSize: 14,
                                                flex: 1
                                            }}>
                                                {this.state.docFile ? this.state.docFile : I18n.t('lbl_upload_doc')}
                                            </Text>
                                            <Image source={globalImagePath.upload} resizeMode="cover" style={{ alignSelf: 'center' }} />
                                        </TouchableOpacity>

                                    </View>
                                    {this.state.docFileError != '' ? <ErrorMessage text={'please upload document'} /> : null}
                                </View>
                                <View style={{ flex: 1, marginTop: 10 }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={this.state.docArray}
                                        renderItem={({ item, index }) =>
                                            this.renderDocList(item, index)
                                        }
                                        keyExtractor={(item, index) => String(index)}
                                    />

                                </View>
                                <View
                                    ref={ref => (this.signupBtn = ref)}
                                    animation="slideInUp"
                                    style={{ marginVertical: 30 }}>
                                    <Button
                                        label={I18n.t('lbl_signUp')}
                                        textSize={14}
                                        onPress={() => { this.signupButtonPressed() }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            paddingBottom: 15,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            backgroundColor: '#fff'
                        }}>
                        <Text
                            style={{
                                ...CommonStyles.InfoTextStyle(14),
                                alignSelf: 'center',
                            }}>
                            {I18n.t('lbl_already_account')}{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Login')}>
                            <Text
                                style={{
                                    ...CommonStyles.ThemeTextStyle(14),
                                    //fontFamily: 'Roboto-Bold',
                                }}>
                                {I18n.t('lbl_sign')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>


            </Container >
        );
    }
}

const styles = {
    container: {
        // marginTop: width * (50 / 375),
        borderTopLeftRadius: width * (40 / 375),
        borderTopRightRadius: width * (40 / 375),
        //justifyContent: 'center',
        paddingHorizontal: width * (20 / 375),
        backgroundColor: '#fff',
        paddingTop: width * (50 / 375),

    },
    outer_container: {
        //  position: 'absolute',
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        //  marginTop: width * (-260 / 375),

    },
    subTitle: {
        fontSize: width * (14 / 375),
        color: colors.lightThemeColor,
        marginTop: width * (20 / 375),
        fontFamily: fonts.type.NunitoSans_Regular
    },
    title: {
        marginTop: width * (5 / 375),
        fontSize: width * (24 / 375),
        color: colors.whiteColor,
        fontFamily: fonts.type.NunitoSans_bold
    }

};
