import React, { useRef } from 'react';
import { View, Text, Image, Platform, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { height, width } from '../../../../../constants/screenSize';
import { globalImagePath } from '../../../../../constants/globalImagePath';
import { style } from './style';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Loader from '../../../../../components/Loader';
import { useIsFocused } from '@react-navigation/native';
import { USER_HOME_SALON_URL } from '../../../../../utils/constants';
import { WebView } from 'react-native-webview';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.15;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var pageNo = 1;
export default function SearchSalon({ navigation, route }) {
    const [overviewDetails, setSalonOverviewDetails] = React.useState('');
    React.useEffect(() => {

        let salonDetails = route.params && route.params.overviewDetails;
        console.log('call 1', salonDetails);
        if (salonDetails) {
            setSalonOverviewDetails(salonDetails);
        }
    }, [navigation]);



    return (
        <Container style={{ flex: 1, backgroundColor: 'rgba(255,255,255 0.1)' }}>
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                style={{
                    zIndex: 99,
                    position: 'absolute',
                    borderRadius: 5,
                    marginHorizontal: 20,
                    paddingHorizontal: 10,
                    marginTop: 20,
                    flexDirection: 'row',
                    alignItems: 'center',

                }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={globalImagePath.back_icon}
                        style={{ height: 20, width: 20 }}
                        resizeMode={'cover'}
                    />
                </View>


            </TouchableOpacity>

            {overviewDetails.lat && (
                <MapView
                    pointerEvents="none"
                    scrollEnabled={true}
                    provider={PROVIDER_GOOGLE}
                    style={{ height: height, borderRadius: 10 }}
                    initialRegion={{
                        latitude: overviewDetails.lat ? overviewDetails.lat : 24.466667,
                        longitude: overviewDetails.lng
                            ? overviewDetails.lng
                            : 54.366669,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    <MapView.Marker
                        coordinate={{
                            latitude: overviewDetails.lat
                                ? overviewDetails.lat
                                : 24.466667,
                            longitude: overviewDetails.lng
                                ? overviewDetails.lng
                                : 54.366669,
                        }}
                        // title={'arrange'}
                        onPress={() => { }}
                        image={globalImagePath.location_marker}
                        description={'marker.description'}></MapView.Marker>
                </MapView>
            )}


        </Container>
    );
}
