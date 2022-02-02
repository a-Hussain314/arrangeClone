import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, I18nManager, ImageBackground } from 'react-native';
import { globalImagePath } from '../../../constants/globalImagePath';
import { Container, Content } from 'native-base';
import AppIntroSlider from 'react-native-app-intro-slider';
import { CommonStyles } from '../../../assets/css';
import { metrics, colors, fonts } from '../../../Theme';
import I18n from '../../../I18n';
import font from '../../../Theme/font';
const height = metrics.screenHeight;
const width = metrics.screenWidth;

export default function AppGuide({ navigation }) {

    const _renderItem = ({ item }) => (
        <ImageBackground style={styles.background} source={globalImagePath.appGuideBack} resizeMode={'cover'}>
            <Image source={item.image} style={{ marginTop: 40 }}></Image>
            <View style={{ flex: 1, marginHorizontal: 20, marginTop: 240 }}>
                <Text style={styles.text}>{item.text}</Text>
                <Text style={styles.text2}>{item.text2}</Text>
            </View>
        </ImageBackground>

    );
    const _renderNextButton = () => {
        return (
            <View>
                <TouchableOpacity style={styles.buttonCircle} onPress={() => navigation.navigate('Signup')}>
                    <Text style={{ fontSize: 18, color: colors.themeColor, fontFamily: font.type.NunitoSans_bold }}>{I18n.t('lbl_signUp_as_user')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCircle} onPress={() => navigation.navigate('ProviderSignUp')}>
                    <Text style={{ fontSize: 18, color: colors.themeColor, fontFamily: font.type.NunitoSans_bold }}>{I18n.t('lbl_signUp_as_provider')}</Text>
                </TouchableOpacity>
                <View
                    style={{
                        marginBottom: 15,
                        flexDirection: 'row',
                        justifyContent: 'center',

                    }}>
                    <Text
                        style={{
                            ...CommonStyles.InfoWhiteTextStyle(14),
                            alignSelf: 'center',

                        }}>
                        {I18n.t('lbl_already_account')}{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Login', {
                                isVerifySocialEmail: 0,
                                loginType: '',
                                email: '',
                                social_id: '',
                            })
                        }>
                        <Text
                            style={{
                                ...CommonStyles.ThemeWhiteTextStyle(14),
                                //fontFamily: 'Roboto-Bold',

                            }}>
                            {I18n.t('lbl_sign')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const _renderDoneButton = () => {
        return (
            <View>
                <TouchableOpacity style={styles.buttonCircle} onPress={() => navigation.navigate('Signup')}>
                    <Text style={{ fontSize: 18, color: colors.themeColor, fontFamily: font.type.NunitoSans_bold }}>{I18n.t('lbl_signUp_as_user')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCircle} onPress={() => navigation.navigate('ProviderSignUp')}>
                    <Text style={{ fontSize: 18, color: colors.themeColor, fontFamily: font.type.NunitoSans_bold }}>{I18n.t('lbl_signUp_as_provider')}</Text>
                </TouchableOpacity>
                <View
                    style={{
                        marginBottom: 15,
                        flexDirection: 'row',
                        justifyContent: 'center',

                    }}>
                    <Text
                        style={{
                            ...CommonStyles.InfoWhiteTextStyle(14),
                            alignSelf: 'center',

                        }}>
                        {I18n.t('lbl_already_account')}{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Login', {
                                isVerifySocialEmail: 0,
                                loginType: '',
                                email: '',
                                social_id: '',
                            })
                        }>
                        <Text
                            style={{
                                ...CommonStyles.ThemeWhiteTextStyle(14),
                                //fontFamily: 'Roboto-Bold',

                            }}>
                            {I18n.t('lbl_sign')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    const slides = [
        {

            image: globalImagePath.appGuideTitle,
            text: 'BOOK AN APPOINTMENT FOR SALON, SPA AND BARBER',
            text2: 'Lorem lpsum is simply dummy text of the printing and typesetting industry',
        },
        {
            image: globalImagePath.appGuideTitle,
            text: 'BOOK AN APPOINTMENT FOR SALON, SPA AND BARBER',
            text2: 'Lorem lpsum is simply dummy text of the printing and typesetting industry',
        },
        {
            image: globalImagePath.appGuideTitle,
            text: 'BOOK AN APPOINTMENT FOR SALON, SPA AND BARBER',
            text2: 'Lorem lpsum is simply dummy text of the printing and typesetting industry',
        }
    ];
    return (
        <ImageBackground style={styles.background} source={globalImagePath.appGuideBack} resizeMode={'cover'}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', width: '100%' }}>
                <Image source={globalImagePath.appGuideTitle} style={{ marginTop: 40, alignSelf: 'center' }}></Image>
                <View style={{ flex: 1, marginHorizontal: 20, marginTop: 220 }}>
                    <Text style={styles.text}>{I18n.t('lbl_guide_title')}</Text>
                    <Text style={styles.text2}>{I18n.t('lbl_guide_subTitle')}</Text>
                </View>

                <View>
                    <TouchableOpacity style={styles.buttonCircle} onPress={() => navigation.navigate('Signup')}>
                        <Text style={{ fontSize: 18, color: colors.themeColor, fontFamily: font.type.NunitoSans_bold }}>{I18n.t('lbl_signUp_as_user')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonCircle} onPress={() => navigation.navigate('ProviderSignUp')}>
                        <Text style={{ fontSize: 18, color: colors.themeColor, fontFamily: font.type.NunitoSans_bold }}>{I18n.t('lbl_signUp_as_provider')}</Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            marginBottom: 15,
                            flexDirection: 'row',
                            justifyContent: 'center',

                        }}>
                        <Text
                            style={{
                                ...CommonStyles.InfoWhiteTextStyle(14),
                                alignSelf: 'center',

                            }}>
                            {I18n.t('lbl_already_account')}{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('SignInGuide', {
                                    isVerifySocialEmail: 0,
                                    loginType: '',
                                    email: '',
                                    social_id: '',
                                })
                            }>
                            <Text
                                style={{
                                    ...CommonStyles.ThemeWhiteTextStyle(14),
                                    //fontFamily: 'Roboto-Bold',

                                }}>
                                {I18n.t('lbl_sign')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </ImageBackground>


    );

}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotColor: {
        backgroundColor: 'rgb(35,21,9)'
    },
    activeDot: {
        backgroundColor: '#FFFFFF'
    },
    navView: {
        flex: 1,
        paddingVertical: height * 8 / 667,
        paddingHorizontal: width * 8 / 375,
        flexWrap: 'wrap',
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(44,59,105, 0.7)'
    },

    text: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: width * 24 / 375,
        color: '#FFFFFF',
        fontFamily: fonts.type.NunitoSans_bold,
        textAlign: 'center',
    },
    text2: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: width * 12 / 375,
        color: '#FFFFFF',
        fontFamily: fonts.type.NunitoSans_Regular,
        textAlign: 'center',
    },

    buttonText: {
        color: '#2C3B69',
        fontSize: height * 10 / 667,
        // fontFamily: font.type.black,

    },
    button1: {
        color: 'red',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 40 / 667,
        width: width * 120 / 375,
        marginVertical: height * 10 / 667
    },

    background: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        width: '100%'
    },
    buttonCircle: {
        width: width * (300 / 375),
        height: width * (45 / 375),
        backgroundColor: 'rgb(245,241,238)',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: width * (10 / 375)
    },

};
