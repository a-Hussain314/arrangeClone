
import React, { Component, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput
} from 'react-native';

import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { style } from './style';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import Button from '../../../../components/Button';
export default function CongratulationScreen({ route, navigation }) {
    const [bookingId, setBookingId] = React.useState('');
    React.useEffect(() => {
        //  console.log("route.params ==>", route.params);

    })

    const _trackOrder = () => {
        navigation.navigate('TrackOrder', {

        });
    }

    return (
        <View style={{ flex: 1, padding: 10, }}>

            <View style={{ borderRadius: 10, flex: 1, width: '100%', backgroundColor: colors.lightThemeColor, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ marginBottom: 100 }} onPress={() => { }}>
                    {/* <Text style={{ textDecorationLine: 'underline' }}>{I18n.t('lbl_see_route')}</Text> */}
                </TouchableOpacity>
                <Image source={globalImagePath.conrats} style={{ width: 134, height: 121 }} resizeMode={'cover'} />
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 28, color: 'rgb(55,51,48)', fontFamily: fonts.type.NunitoSans_bold }}>{I18n.t('lbl_thank_you')}</Text>
                    <View style={{ marginVertical: 5, flexDirection: 'row' }}>
                        <View style={{}}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.type.NunitoSans_Regular }}>{'Your booking id reference'}</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#000', fontWeight: 'bold' }}>{'  :  '}</Text>
                        <View style={{}}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.type.NunitoSans_Regular }}>{'#' + route.params}</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 14, fontFamily: fonts.type.NunitoSans_Regular }}>{I18n.t('lbl_order_successfully')}</Text>
                </View>
                <View style={{ height: 50, width: 180, marginTop: 20 }}>
                    <Button
                        label={I18n.t('lbl_back_home')}
                        textSize={16}
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        }}
                    />
                </View>
            </View>

        </View>
    )
}