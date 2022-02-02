import React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import Loader from '../../../../components/Loader';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { Container, Content } from 'native-base';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import I18n from '../../../../I18n';
import NavBar from '../../../../components/NavBar';
import { postService } from '../../../../services/postServices';
import { showToast, showDangerToast, } from '../../../../components/ToastMessage';
import { styles } from '../../../../components/CustomLangauge/CustomLanguage';
import font from '../../../../Theme/font';
import moment from "moment";
export default function OfferDetails({ navigation, route }) {
    const [loading, setLoading] = React.useState(false);
    const [getOfferDetails, setOfferDetails] = React.useState('');
    const [getImageUrl, setImageUrl] = React.useState('');
    React.useEffect(() => {
        if (route.params.offerDetails) {
            setOfferDetails(route.params.offerDetails);
        }
        if (route.params.imageUrl) {
            setImageUrl(route.params.imageUrl);
        }
    }, []);

    return (
        <Container style={{ backgroundColor: 'rgba(255,255,255, 1)' }}>
            <Loader loading={loading} />
            <NavBar
                textColor={'black'}
                isLeftIconUrl={false}
                leftIcon={globalImagePath.back_icon}
                navigator={navigation}
                backgroundColor={'#ffffff'}
                title={'Offers Details'}
                isCenterImage={false}
                centerText={'Offers Details'}
                navigation="HomePage"
                titleTop={''}
            />
            <ImageBackground source={{ uri: getImageUrl + getOfferDetails.image }} style={style.bgImage} resizeMode={'cover'}>
                <View style={style.offerView}>
                    <Text style={style.offerTitle}>{getOfferDetails.offer_name}</Text>
                </View>
            </ImageBackground>
            <Content>
                <View style={style.treatmentOptionTitle_1}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 0.5 }}>
                            <Text style={style.heading}>{'Discount'}</Text>
                        </View>
                        <Text style={style.dots}>{':'}</Text>
                        <View style={{ flex: 0.5, marginLeft: 10 }}>
                            {getOfferDetails.offer_type != 1 ?
                                <Text style={style.discountValue}>{getOfferDetails.discount_value + '%' + ' Discount'}</Text>
                                :
                                <Text style={style.discountValue}>{getOfferDetails.discount_value + 'SAR' + ' Flat'}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 0.5 }}>
                            <Text style={style.heading}>{'Till Date'}</Text>
                        </View>
                        <Text style={style.dots}>{':'}</Text>
                        <View style={{ flex: 0.5, marginLeft: 10 }}>
                            <Text style={style.discountValue_2}>{moment(getOfferDetails.end_date).format("YYYY-MM-DD")}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 0.5 }}>
                            <Text style={style.heading}>{'Coupon Code'}</Text>
                        </View>
                        <Text style={style.dots}>{':'}</Text>
                        <View style={{ flex: 0.5, marginLeft: 10 }}>
                            <Text style={style.discountValue_2}>{getOfferDetails.offer_code}</Text>
                        </View>
                    </View>

                </View>
                <View style={style.descriptionView}>
                    <Text style={style.description}>
                        {getOfferDetails.description}
                    </Text>
                </View>
            </Content>
        </Container >
    );
}


export const style = StyleSheet.create({
    treatmentOptionTitle_1: {
        justifyContent: 'center',
        // alignItems: 'center',
        marginHorizontal: width * (10 / 375),
        marginVertical: width * (15 / 375),
        padding: 10,
        borderWidth: 1,
        //  marginTop: 10,
        backgroundColor: colors.whiteColor,
        borderRadius: 10,
        borderColor: colors.themeColor
    },
    titleText: {
        fontSize: width * (14 / 375),
        fontFamily: fonts.type.NunitoSans_bold,
    },
    discountValue: {
        fontSize: width * (14 / 375),
        color: 'rgb(252,174,0)'
    },
    discountValue_2: {
        fontSize: width * (14 / 375),
        fontFamily: fonts.type.NunitoSans_SemiBold
    },
    offerTitle: {
        color: colors.whiteColor,
        fontSize: width * (22 / 375),
        fontFamily: font.type.NunitoSans_bold
    },
    offerView: {
        bottom: width * (20 / 375),
        left: width * (20 / 375),
    },
    bgImage: {
        width: '100%',
        height: height * (180 / 667),
        justifyContent: 'flex-end'
    },
    heading: {
        color: colors.themeColor,
        fontSize: 16,
        fontFamily: fonts.type.NunitoSans_bold
    },
    dots: {
        color: colors.themeColor,
        fontSize: 16,
    },
    description: {
        fontSize: width * (12 / 375),
        color: colors.themeColor,
        fontFamily: fonts.type.NunitoSans_SemiBold,
        lineHeight: 20
    },
    descriptionView: {
        marginHorizontal: width * (15 / 375),
    }
})