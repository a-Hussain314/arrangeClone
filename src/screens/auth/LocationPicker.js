import React from 'react';
import LocationView from 'react-native-location-view';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Content, Container } from 'native-base';
import { globalImagePath } from '../../constants/globalImagePath';

export default class LocationPicker extends React.Component {
  state = {};

  goBack(address) {
    // console.log("navigation props ==> ", this.props);
    // const { navigation } = this.props;
    // navigation.goBack();
    // navigation.state.params.selectLocation({ selectedLocation: address });
    this.props.navigation.navigate('ProviderSignUp', {
      selectedLocation: address,
    });
  }

  selectedLocation = (address) => {
    this.goBack(address);
  };

  render() {
    //console.log('route params ==> ', this.props.route.params);
    return (
      <Container style={{ backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1 }}>
          {/* <TouchableOpacity
            style={{ paddingHorizontal: 20, marginTop: Platform.OS == 'ios' ? 7 : 15, backgroundColor: '#fff', height: 50, justifyContent: 'center' }}
            onPress={() => this.props.navigation.goBack()}>
            <Image source={globalImagePath.back_icon} resizeMode="cover" style={{ tintColor: "rgb(196,170,153)" }} />
          </TouchableOpacity> */}
          <LocationView
            apiKey={'AIzaSyDvTOdT_3vxnwT8bRfRugWeNI-khXiiWB0'}
            initialLocation={{
              latitude:
                this.props.route.params && this.props.route.params.currentLat
                  ? this.props.route.params.currentLat
                  : 37.78825,
              longitude:
                this.props.route.params && this.props.route.params.currentLong
                  ? this.props.route.params.currentLong
                  : -122.4324,
            }}
            markerColor={'rgb(196,170,153)'}
            onLocationSelect={(address) => this.selectedLocation(address)}
            actionText={'Select'}
            actionButtonStyle={{ backgroundColor: 'rgb(196,170,153)' }}
          />
        </View>
      </Container>
    );
  }
}
