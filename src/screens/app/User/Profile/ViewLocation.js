import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import { Container, Content } from 'native-base';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import I18n from '../../../../I18n';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
export default function ViewLocation({ navigation, route }) {

    return(
        <Container style={{ backgroundColor: 'rgba(255,255,255 0.1)' }}>
            <NavBar
                textColor={'black'}
                isLeftIconUrl={false}
                leftIcon={globalImagePath.back_icon}
                navigator={navigation}
                backgroundColor={'#ffffff'}
                isCenterImage={false}
                centerText={'View Location'}
                navigation="HomePage"
                titleTop={''}
            />
            <View style={{flex: 1}}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1, zIndex: -1 }}
                    initialRegion={{
                        latitude: route.params.lat ? route.params.lat : 26.9124,
                        longitude: route.params.lng ? route.params.lng : 75.7873,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <MapView.Marker
                        coordinate={{ latitude: route.params.lat ? route.params.lat : 26.9124, longitude: route.params.lng ? route.params.lng : 75.7873 }}
                        image={globalImagePath.location_marker}
                        description={route.params.address}
                    >
                    </MapView.Marker>
                </MapView>

            </View>
        </Container>
    );
}