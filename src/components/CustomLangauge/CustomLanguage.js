//***** import libraries */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { globalImagePath } from '../../constants/globalImagePath';
import { fonts } from '../../Theme'

export default function ({
    onPress,
    langTitle,
    langImg,
    engLang,
    arLang

}) {

    return (
        <TouchableOpacity onPress={() => onPress()} style={styles.outerView}>

            <Image source={langImg} style={styles.img} resizeMode={'cover'} />
            <View style={styles.imgTitle}>
                <Text style={styles.titleText}>{langTitle}</Text>
            </View>

            {engLang == false ? <View style={styles.checkView}>
                <Image source={globalImagePath.roundRightIcon} style={styles.checkIcon} />
            </View> : null}
            {arLang == true ? <View style={styles.checkView}>
                <Image source={globalImagePath.roundRightIcon} style={styles.checkIcon} />
            </View> : null}
        </TouchableOpacity >

    );
}

export const styles = StyleSheet.create({
    outerView: {
        justifyContent: 'center',
        height: 153,
        width: 140,
        borderRadius: 4,
        borderColor: 'rgb(196, 170, 153)',
        marginTop: 50,
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1
    },
    img: {
        height: 70,
        width: 70
    },
    imgTitle: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: fonts.type.proximanova_semibold
    },
    checkView: {
        position: 'absolute',
        bottom: 0,
        bottom: -15
    },
    checkIcon: {
        height: 27,
        width: 27
    }
})
