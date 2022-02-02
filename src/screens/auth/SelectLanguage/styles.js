
import { StyleSheet } from 'react-native';
import { metrics, colors, fonts } from '../../../Theme';
import font from '../../../Theme/font';

const height = metrics.screenHeight;
const width = metrics.screenWidth;
export const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontFamily: font.type.NunitoSans_Regular,
        color: colors.darkShade
    },
    subTitle: {
        fontSize: 36,
        fontFamily: font.type.NunitoSans_SemiBold,
        color: colors.darkShade
    },
    nextText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: font.type.NunitoSans_SemiBold,
    }
})
