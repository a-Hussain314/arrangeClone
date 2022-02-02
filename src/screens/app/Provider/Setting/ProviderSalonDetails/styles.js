import { StyleSheet } from 'react-native';
import { height, width } from '../../../../../constants/screenSize';
import { colors, fonts, } from '../../../../../Theme';
import { CommonStyles } from '../../../../../assets/css';

export const styles = StyleSheet.create({
    activeTab: {
        marginTop: width * (5 / 375),
        fontFamily: CommonStyles.APP_FONT_MEDIUM,
        fontSize: width * (12 / 375),
        color: colors.themeColor,

    },
    inActiveTab: {
        marginTop: 5,
        fontFamily: CommonStyles.APP_FONT_MEDIUM,
        fontSize: width * (12 / 375),
        color: colors.lightThemeColor
    },
    tabStyle_1: {
        borderBottomWidth: width * (3 / 375),
        borderBottomColor: colors.darkShade,
        paddingHorizontal: width * (30 / 375),
        marginLeft: width * (10 / 375),
        height: width * (40 / 375),
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabStyle_2: {
        paddingHorizontal: width * (30 / 375),
        marginLeft: width * (10 / 375),
        height: width * (40 / 375),
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText_1: {
        fontSize: width * (14 / 375),
        color: colors.darkShade,
        fontFamily: fonts.type.NunitoSans_SemiBold,
    },
    tabText_2: {
        fontSize: width * (14 / 375),
        color: colors.lightThemeColor,
        fontFamily: fonts.type.NunitoSans_Regular,
    },
    tabListOuter: {
        borderBottomWidth: 0.5,
        borderBottomColor: colors.lightThemeColor,
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});
