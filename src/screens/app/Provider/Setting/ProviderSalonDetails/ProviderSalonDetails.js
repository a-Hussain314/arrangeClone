import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { Container, Tab, Tabs, TabHeading } from 'native-base';
import { colors, fonts } from '../../../../../Theme';
import { globalImagePath } from '../../../../../constants/globalImagePath';
import { styles } from './styles';
import SalonOverView from './SalonOverView/SalonOverView'; //../SalonDetails/SalonOverView/SalonOverView
import SalonServices from './SalonServices/SalonServices';
import SalonGallery from './SalonGallery/SalonGallery';
import { getService } from '../../../../../services/getServices';
import I18n from '../../../../../I18n';
import Loader from '../../../../../components/Loader';
import { showDangerToast } from '../../../../../components/ToastMessage';
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { CommonStyles } from '../../../../../assets/css';
import { normalize } from '../../../../../components/Dimensions';


export default function SearchDetails({ navigation, props }) {
    const [currentTab, setCurrentTab] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [isImageNotLoad, setIsImageNotLoad] = React.useState(false);
    const [bannerImage, setBannerImage] = React.useState('');
    const [salonName, setSalonName] = React.useState('');
    const [salonDetails, setSalonDetails] = React.useState('');
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [tabsName, setTabName] = React.useState([
        { tabName: I18n.t('lbl_overView'), select: true },
        { tabName: I18n.t('lbl_srvice'), select: false },
        { tabName: I18n.t('lbl_gallery'), select: false }
    ]);
    const isFocused = useIsFocused();
    // React.useEffect(() => {
    //     getSalonDetails();
    // }, [props, isFocused, currentIndex]);


    useFocusEffect(

        React.useCallback(() => {

            if (currentIndex == 0) {
                setCurrentIndex(() => 0)
            }
            getSalonDetails();
        }, [currentIndex])
    );


    function getSalonDetails() {
        setLoading(true);
        //***** api calling */
        getService('profile/detail')
            .then(res => {
                setLoading(false);
                //   console.log("profile/detail ==> ", res);
                if (res.data.status === 1) {
                    setLoading(false);
                    let data = res.data.response;
                    setSalonDetails(data)
                    let bannerImage = data.salon_banner_url + data.banner_salon
                    setBannerImage(bannerImage);
                    setSalonName(data.salon_name);

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
        <Container style={{ flex: 1, }}>
            <Loader loading={loading} />
            <ImageBackground
                source={{ uri: bannerImage }}
                style={{ width: '100%', height: normalize(150) }}
                //imageStyle={{justifyContent: 'flex-end'}}
                onLoadStart={() => setIsImageNotLoad(true)}
                onLoad={() => setIsImageNotLoad(false)}
            >
                {isImageNotLoad ? (
                    <ActivityIndicator
                        style={{ marginTop: normalize(75) }}
                        size='small'
                        color={'rgb(196,170,153)'}
                        animating={isImageNotLoad}
                    />
                ) :
                    <>
                        <TouchableOpacity onPress={() => navigation.goBack()} >
                            <Image source={globalImagePath.backWhite} style={{ marginTop: 15, marginLeft: 15 }} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, justifyContent: 'flex-end', marginLeft: 15, marginBottom: 15 }}>
                            <Text style={{ ...CommonStyles.WhiteTitleTextStyle(14), textAlign: 'left' }}>{salonName}</Text>
                        </View>
                    </>
                }
            </ImageBackground>
            <View style={{ flex: 1, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#dddddd', }}>
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
                    {currentIndex == 0 ? <SalonOverView navigation={navigation} currentIndex={currentIndex} /> : null}
                    {currentIndex == 1 ? <SalonServices navigation={navigation} currentIndex={currentIndex} /> : null}
                    {currentIndex == 2 ? <SalonGallery navigation={navigation} currentIndex={currentIndex} /> : null}
                </View>

            </View>
        </Container>
    );
}
