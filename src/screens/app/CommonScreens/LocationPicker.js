import React from "react";
import LocationView from "react-native-location-view";
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Content, Container } from "native-base";
import { globalImagePath } from '../../../constants/globalImagePath';
//import AppHeaderSec from "../components/AppHeaderSec";
//import I18n from "../../../i18n";

export default class LocationPicker extends React.Component {
  state = {};

  goBack(address) {

    let name = this.props.route.params && this.props.route.params.screenName
      ? this.props.route.params.screenName
      : 'ProviderProfileScreen';
    this.props.navigation.navigate(name, {
      selectedAddress: address
    });
  }

  selectedLocation = address => {
    this.goBack(address);
  };

  render() {

    return (
      <Container style={{ backgroundColor: "#ffffff" }}>
        <View style={{ flex: 1 }}>
          <LocationView
            apiKey={"AIzaSyDvTOdT_3vxnwT8bRfRugWeNI-khXiiWB0"}
            initialLocation={{
              latitude: this.props.route.params && this.props.route.params.currentLat
                ? this.props.route.params.currentLat
                : 37.78825,
              longitude: this.props.route.params && this.props.route.params.currentLong
                ? this.props.route.params.currentLong
                : -122.4324
            }}
            markerColor={"rgb(196,170,153)"}
            onLocationSelect={address => this.selectedLocation(address)}
            actionText={'Select'}
            actionButtonStyle={{ backgroundColor: 'rgb(196,170,153)' }}
          />
        </View>
      </Container>
    );
  }
}
