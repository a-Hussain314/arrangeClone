import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { height, width } from '../../../../../constants/screenSize';
import { fonts, colors } from '../../../../../Theme';
// import { styles } from './styles';
import { globalImagePath } from '../../../../../constants/globalImagePath'
import font from '../../../../../Theme/font';
import Loader from '../../../../../components/Loader';
import { postService } from '../../../../../services/postServices';
import { useIsFocused } from "@react-navigation/native";
import { showToast, showDangerToast } from '../../../../../components/ToastMessage';
import { ImagePopup } from '../../../../../components';
import I18n from '../../../../../I18n';
import { CUSTOMERIMAGEURL } from '../../../../../utils/constants';
export default function SalonGallery({ navigation, salonId }) {
    const isFocused = useIsFocused();
    const [loading, setLoading] = React.useState(false);
    const [imageUri, setImageUri] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [recommendSalon, setRecommendSalon] = React.useState();
    React.useEffect(() => {
        isFocused ? getSalonGallery(salonId) : null
    }, [isFocused]);

    function getSalonGallery(salonId) {
        setLoading(true);
        //***** api calling */

        const data = {
            salon_id: salonId
        }

        postService('salonlist/salongallery-byid', data)
            .then(res => {
                setLoading(false);

                if (res.data.status === 1) {
                    setLoading(false);
                    console.log("res.data =>", res.data);
                    let data = res.data.response;
                    console.log("data =>", data);
                    setImageUrl(res.data.response && res.data.response.url)
                    setRecommendSalon(data.images)

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

    const animationShow = async (key, val) => {
        let data = [...recommendSalon];
        data[key].animate = val;
        setRecommendSalon(await data);
    };

    const showImage = (item) => {

        setImageUri(item.image_name);
        setVisible(true);
    }


    // Render recommand salon
    const recommandSalon = (item, index) => {
        return (

            <TouchableOpacity onPress={() => { showImage(item) }} style={{
                justifyContent: 'center', marginRight: 6, marginTop: 10, borderWidth: 0.5, height: width * (107 / 375),
                width: width * (107 / 375),
                borderRadius: 10, borderColor: '#dddddd'
            }}>
                <Image
                    source={{ uri: CUSTOMERIMAGEURL + item.image_name }}
                    style={styles.image}
                    resizeMode={'cover'}
                    onLoadStart={() => animationShow(index, true)}
                    onLoad={() => animationShow(index, false)}
                />
                {item.animate ? (
                    <ActivityIndicator
                        style={{ position: 'absolute', marginTop: width * (53 / 375), marginLeft: width * (40 / 375) }}
                        size='small'
                        color={'rgb(196,170,153)'}
                        animating={item.animate}
                    />
                ) : null}
            </TouchableOpacity>

        );
    };

    const emptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ marginTop: 100, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular, }}>{I18n.t("lbl_no_image")}</Text>
            </View>);
    }

    const _goBack = () => {
        setVisible(false);
    }


    return (
        <ScrollView style={{
            flex: 1,
            paddingHorizontal: width * (20 / 375),
            backgroundColor: '#fff'
        }}>
            <ImagePopup
                visible={visible}
                imgUri={imageUri}
                galleryUrl={imageUrl}
                _goBack={() => { _goBack() }}
            />
            <Loader loading={loading} />
            <View style={{ flex: 1, marginTop: 20, }}>
                <FlatList
                    numColumns={3}
                    ListEmptyComponent={emptyComponent()}
                    showsVerticalScrollIndicator={false}
                    data={recommendSalon}
                    renderItem={({ item, index }) =>
                        recommandSalon(item, index)
                    }
                    keyExtractor={(item, index) => String(index)}
                    ListEmptyComponent={emptyComponent()}
                />

            </View>

        </ScrollView>
    );

}

const styles = StyleSheet.create({
    renderOuterView: {
        flexDirection: 'row',
        marginTop: width * (10 / 375),

        paddingBottom: 2,
        paddingRight: 2,
        paddingTop: 2,
        paddingLeft: 2,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        //  marginRight: 10,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,

    },
    image: {
        // borderWidth: 5,
        height: width * (107 / 375),
        width: width * (107 / 375),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dddddd'
    },
    addimage: {
        // borderWidth: 5,
        height: width * (11 / 375),
        width: width * (11 / 375),
        borderRadius: 10,
    },
})
