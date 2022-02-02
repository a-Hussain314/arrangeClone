import React, { Component } from 'react';
import {
    View,
    Text,

} from 'react-native';
import { Tab, Tabs, TabHeading } from 'native-base';
import { colors, fonts } from '../../../../../Theme';
import { globalImagePath } from '../../../../../constants/globalImagePath';
import { styles } from './styles';
import Tab1 from './SalonOverView/SalonOverView'; //../SalonDetails/SalonOverView/SalonOverView
import Tab2 from './SalonServices/SalonServices';
import Tab3 from './SalonGallery/SalonGallery';
import { getService } from '../../../../../services/getServices';
import I18n from '../../../../../I18n';
import ParallaxScrollView from 'react-native-parallax-scrollview';
import Loader from '../../../../../components/Loader';
import { showDangerToast } from '../../../../../components/ToastMessage';
import { useIsFocused } from "@react-navigation/native";
import { CommonStyles } from '../../../../../assets/css';

export default function SearchDetails({ navigation, props }) {
    const [currentTab, setCurrentTab] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [bannerImage, setBannerImage] = React.useState('');
    const [salonName, setSalonName] = React.useState('');
    const [salonDetails, setSalonDetails] = React.useState('');
    const isFocused = useIsFocused();
    React.useEffect(() => {

        getSalonDetails();
    }, [props, isFocused]);


    function getSalonDetails() {
        setLoading(true);
        //***** api calling */
        getService('profile/detail')
            .then(res => {
                setLoading(false);
                console.log("profile/detail ==> ", res);
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

    return (
        <View style={{ flex: 1, }}>
            <Loader loading={loading} />
            <ParallaxScrollView
                windowHeight={667 * 0.4}
               // webUrl={bannerImage ? true : false}
                backgroundSource={bannerImage}
                userImage={bannerImage}
                navBarTitle={salonName}
                userName={salonName}
                userTitle=' '
                navBarTitleColor={'#000'}
                navBarColor={CommonStyles.THEME_COLOR}
                navigator={navigation}
                leftIcon={{name: 'arrow-left', color: '#000', size: 30}}
                leftIconOnPress={() => navigation.goBack()}
            >

                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Tabs position={"bottom"} tabBarUnderlineStyle={{ backgroundColor: colors.themeColor }} onChangeTab={({ i }) => setCurrentTab(i)}>

                        <Tab heading={<TabHeading

                            style={{ backgroundColor: '#fff', paddingBottom: 5 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={currentTab == 0 ? styles.activeTab : styles.inActiveTab}>{I18n.t('lbl_overView')}</Text>
                            </View>
                        </TabHeading>}
                            tabStyle={{ backgroundColor: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#fff', borderTopWidth: 0.5 }}>
                            <Tab1 navigation={navigation} />
                        </Tab>
                        <Tab heading={<TabHeading style={{ backgroundColor: '#fff', paddingBottom: 5 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={currentTab == 1 ? styles.activeTab : styles.inActiveTab}>{I18n.t('lbl_srvice')}</Text>
                            </View>
                        </TabHeading>}
                            tabStyle={{ backgroundColor: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#fff' }}>
                            <Tab2 navigation={navigation} />

                        </Tab>

                        <Tab heading={<TabHeading style={{ backgroundColor: '#fff', paddingBottom: 5 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={currentTab == 2 ? styles.activeTab : styles.inActiveTab}>{I18n.t('lbl_gallery')}</Text>
                            </View>
                        </TabHeading>}
                            tabStyle={{ backgroundColor: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#fff', borderTopWidth: 0.5 }}>
                            <Tab3 navigation={navigation} />
                        </Tab>

                    </Tabs>
                </View>

            </ParallaxScrollView>

            <View style={{ position: 'absolute', bottom: 200, marginHorizontal: 20, height: 80, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.2)' }}>

            </View>
        </View>
    );
}
