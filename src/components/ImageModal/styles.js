import { StyleSheet } from 'react-native'
import color from '../../Theme/Colors'
import { colors, fonts, metrics } from '../../Theme';
import font from '../../Theme/font';
const height = metrics.screenHeight;
const width = metrics.screenWidth;
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(0, 0, 0)',
        paddingHorizontal: 20,

    },
    close_view: {
        width: width * (60 / 375),
        marginTop: width * (50 / 375),

    },
    image: {
        marginLeft: width * (20 / 375),
        height: width * (16 / 375),
        width: width * (16 / 375),
        tintColor: colors.code_fff
    },
    btn_view: {
        marginTop: width * (30 / 375),
        flexDirection: 'row'
    },
    text_view: {
        //flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * (50 / 375),


    },
    nav_view: {
        paddingLeft: width * (10 / 375),
        paddingTop: width * (10 / 375),
        backgroundColor: colors.code_fff,
        borderWidth: 1
    },
    crossIcon: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',

    },
    crossImg: {
        tintColor: 'rgb(64,120,203)',
        height: 16,
        width: 16,
        marginVertical: 5
    },
    text: {
        color: 'rgb(61, 118 ,206)',
        fontSize: width * (18 / 375),
        fontFamily: font.type.Akkurat_Bold,
        textAlign: 'center'
    },
    text_yes_no: {
        color: colors.code_fff,
        fontSize: width * (18 / 375),
        fontFamily: font.type.Akkurat_Bold,

    },
    btn_no: {
        marginRight: width * (20 / 375),
        height: width * (40 / 375),
        width: width * (80 / 375),
        backgroundColor: 'rgb(64,120,203)',
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_yes: {
        marginLeft: width * (20 / 375),
        height: width * (40 / 375),
        width: width * (80 / 375),
        backgroundColor: 'rgb(64,120,203)',
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    outerView: {
        marginTop: width * (100 / 375)
    },
    img: {
        height: width * (300 / 375),
        width: width * (350 / 375),
        borderRadius: width * (10 / 375)
    }


})