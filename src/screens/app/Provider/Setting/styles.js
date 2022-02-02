import { StyleSheet } from 'react-native';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts, } from '../../../../Theme';
import { CommonStyles } from '../../../../assets/css';

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
});
