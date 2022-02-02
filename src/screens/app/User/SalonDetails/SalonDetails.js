import React, { Component, useEffect, useFocusEffect } from 'react';
import {
    View,
    Text,
    ImageBackground, Image, TouchableOpacity, ActivityIndicator, FlatList, ScrollView
} from 'react-native';
import { Tab, Tabs, TabHeading } from 'native-base';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { styles } from './styles';
import SalonOverView from '../SalonDetails/SalonOverView/SalonOverView';
import SalonServices from '../SalonDetails/SalonServices/SalonServices';
import SalonGallery from '../SalonDetails/SalonGallery/SalonGallery';
import SalonReview from '../SalonDetails/SalonReview/SalonReview';
import I18n from '../../../../I18n';
import { getService } from '../../../../services/getServices';
import { postService } from '../../../../services/postServices';
import Loader from '../../../../components/Loader';
import { useIsFocused } from "@react-navigation/native";
import { normalize } from '../../../../components/Dimensions';
import {
    showToast,
    showDangerToast,
    showDangerToastLong,
} from '../../../../components/ToastMessage';
import { USER_HOME_SALON_URL } from '../../../../utils/constants'
export default function SearchDetails({ navigation, route, props }) {
    const isFocused = useIsFocused();
    const [isImageNotLoad, setIsImageNotLoad] = React.useState(false);
    const [currentTab, setCurrentTab] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [salonDetails, setSalonDetails] = React.useState(false);
    const [salonId, setSalonId] = React.useState('');
    const [addFav, setAddFav] = React.useState(0);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [tabsName, setTabName] = React.useState([
        { tabName: I18n.t('lbl_overView'), select: true },
        { tabName: I18n.t('lbl_srvice'), select: false },
        { tabName: I18n.t('lbl_gallery'), select: false },
        { tabName: I18n.t('lbl_review'), select: false }
    ]);
    useEffect(() => {
        console.log(" React.useEffect");
        let salon_id = route.params && route.params.salonId;
        console.log("salon_id =>", salon_id);
        setSalonId(salon_id);
        isFocused ? getSalonDetails(salon_id) : null;
    }, [isFocused]);

    function getSalonDetails(salon_id) {
        setLoading(true);
        //***** api calling */
        getService(`salonlist/salonById/${salon_id}`)
            .then(res => {
                setLoading(false);
                console.log("salonlist/salonById ==> ", res.data);
                if (res.data.status === 1) {
                    setLoading(false);
                    let data = res.data.response;
                    setSalonDetails(data)
                    setAddFav(data.is_fav);
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

    function addAndRemoveFavSaloon(value) {
        setLoading(true);
        const data = {
            salon_id: salonDetails._id,
            isFav: value
        }
        //***** api calling */
        postService('salonlist/adddel-fav', data)
            .then(res => {
                setLoading(false);
                console.log("salonlist/adddel-fav ==> ", res.data);
                if (res.data.status === 1) {
                    setLoading(false);
                    setAddFav(value);
                    showToast(res.data.message);

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

    const switchTabs = (index) => {
        var cloneTab = [...tabsName];
        setCurrentIndex(index);
        cloneTab.map((ele, i) => {
            if (index == i) {
                cloneTab[index].select = true;
            } else {
                cloneTab[i].select = false;
            }

        })

        setTabName(cloneTab);
    }

    const rendertabs = (item, index) => {
        return (

            <View style={item.select ? styles.tabStyle_1 : styles.tabStyle_2}>
                <TouchableOpacity style={{}} onPress={() => { switchTabs(index) }}>
                    <Text style={item.select ? styles.tabText_1 : styles.tabText_2}>{item.tabName}</Text>
                </TouchableOpacity>
            </View>

        )
    }

    return (
        <View style={{ flex: 1, }}>
            {/* <Loader loading={loading} /> */}

            <ImageBackground
                source={{ uri: USER_HOME_SALON_URL + salonDetails.banner_salon }}
                style={{ width: '100%', height: normalize(150) }}
                onLoadStart={() => setIsImageNotLoad(true)}
                onLoad={() => setIsImageNotLoad(false)}
                resizeMode={'cover'}
            >

                <View style={{ flexDirection: 'row', marginHorizontal: 15, }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()} >
                        <Image source={globalImagePath.backWhite} style={{ marginTop: 15, }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { addFav == 1 ? addAndRemoveFavSaloon(0) : addAndRemoveFavSaloon(1) }}
                        style={{
                            marginTop: 15,
                        }}
                    >
                        <Image
                            source={addFav == 1 ? globalImagePath.fillHeart : globalImagePath.heartIcon}
                            resizeMode={'contain'}
                            style={{}}
                        />
                    </TouchableOpacity>
                </View>

            </ImageBackground>

            {salonId ?
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.tabListOuter}>

                        <FlatList
                            horizontal={true}
                            showsVerticalScrollIndicator={false}
                            data={tabsName}
                            renderItem={({ item, index }) =>
                                rendertabs(item, index)
                            }
                            keyExtractor={(item, index) => String(index)}
                        />
                    </View>
                    <View style={{ flex: 1, }}>
                        {currentIndex == 0 ? <SalonOverView navigation={navigation} salonId={salonId} /> : null}
                        {currentIndex == 1 ? <SalonServices navigation={navigation} salonId={salonId} /> : null}
                        {currentIndex == 2 ? <SalonGallery navigation={navigation} salonId={salonId} /> : null}
                        {currentIndex == 3 ? <SalonReview navigation={navigation} salonId={salonId} /> : null}
                    </View>

                </View> : null}
        </View>
    );
}
