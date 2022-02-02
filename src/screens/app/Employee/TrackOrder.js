import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Container, Content} from 'native-base';
import {colors, fonts} from '../../../Theme';
import {globalImagePath} from '../../../constants/globalImagePath';
import NavBar from '../../../components/NavBar';
import I18n from '../../../I18n';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {CommonStyles} from '../../../assets/css';
import {check, PERMISSIONS, openSettings} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {postService} from '../../../services/postServices';
import {showToast, showDangerToast} from '../../../components/ToastMessage';
import io from 'socket.io-client';
import Loader from '../../../components/Loader';

const socket = io('https://35.208.113.133:17345');

socket.connect();

//socket.disconnect();

// An event to be fired on connection to socket
socket.on('connect', () => {
  console.log('Wahey -> connected employee!');
});

socket.on('disconnect', () => {
  console.log('Disconnected Socket employee!');
  socket.on('connect', () => {
    console.log('Wahey -> again connected employee!');
  });
});

// create a component
export default function TrackOrder({navigation, route}) {
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE = 26.9124;
  const LONGITUDE = 75.7873;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const GOOGLE_MAPS_APIKEY = 'AIzaSyCfOvPfUzLEpuEiGtEjdqgEunY-HKZvDD8';

  const mapViewRef = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [duration, setDuration] = useState(0);
  const [coordinates, setCoordinates] = useState([]);
  const [roomID, setRoomID] = useState('');
  const [showCompletedButton, setShowCompletedButton] = useState(false);

  React.useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      checkLocationPermission();
      route?.params?.roomID ? trackVisit() : bookingTrackingStart();
    });
    return () => {
      focusListener;
      Geolocation.clearWatch(watchID);
    };
  }, [navigation]);

  const trackVisit = () => {
    console.log('in track visit');
    socket.emit('join', route?.params?.roomID);
    setLoading(true);
    setRoomID(route?.params?.roomID);
  };

  const bookingTrackingStart = () => {
    const data = {
      booking_id: route?.params?.bookingID,
      visit_started: 1,
    };
    console.log('data =>', data);
    setLoading(true);
    //***** api calling */
    postService('employee/update-visit', data)
      .then((res) => {
        console.log(' update visit response ==> ', res);
        if (res.data.status === 1) {
          console.log(' update visit response ==> ', res.data.response.room_id);
          socket.emit('join', res.data.response.room_id);
          setRoomID(res.data.response.room_id);
        } else {
          //setLoading(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(function () {
          showDangerToast('Something went wrong. Please ttry again later.');
          console.log(error);
        }, 100);
      });
  };

  const checkLocationPermission = () => {
    if (Platform.OS == 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
        if (
          result == 'blocked' ||
          result == 'denied' ||
          result == 'unavailable'
        ) {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(
              '',
              I18n.t('lbl_permission_msg'),
              [
                {
                  text: I18n.t('lbl_notNow'),
                  onPress: () => console.log('Cancel Pressed!'),
                },
                {
                  text: I18n.t('lbl_open_setting'),
                  onPress: () => openSettings(),
                },
              ],
              {cancelable: false},
            );
          }, 200);
        } else {
          console.log('enter in else part to get current location');
          getCurrentLocation();
        }
      });
    } else if (Platform.OS == 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
        if (result == 'blocked' || result == 'denied') {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(
              '',
              I18n.t('lbl_permission_msg'),
              [
                {
                  text: I18n.t('lbl_notNow'),
                  onPress: () => console.log('Cancel Pressed!'),
                },
                {
                  text: I18n.t('lbl_open_setting'),
                  onPress: () => openSettings(),
                },
              ],
              {cancelable: false},
            );
          }, 200);
        } else {
          getCurrentLocation();
        }
      });
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        setLoading(false);
        setCoordinates([
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          {
            latitude: route?.params?.user_lat,
            longitude: route?.params?.user_long,
          },
        ]);
      },
      (error) => {
        setLoading(false);
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  useEffect(() => {
    getBackgroundLocation();
    socket.on('locationUpdate', async (data) => {
      console.log('receieve location from socket ====>>>> ', data);
      setCoordinates([
        {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        {
          latitude: route?.params?.user_lat,
          longitude: route?.params?.user_long,
        },
      ]);
    });
  });

  const getBackgroundLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        setCoordinates([
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          {
            latitude: route?.params?.user_lat,
            longitude: route?.params?.user_long,
          },
        ]);

        socket.emit('location', {
          room_id: roomID,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  const onMapPress = (e) => {
    setCoordinates([...coordinates, e.nativeEvent.coordinate]);
  };

  const bookingTrackingComplete = () => {
    const data = {
      booking_id: route?.params?.bookingID,
      visit_completed: 1,
    };

    setLoading(true);
    //***** api calling */
    postService('employee/update-visit', data)
      .then((res) => {
        console.log(' update visit response ==> ', res);
        if (res.data.status === 1) {
          showToast(res.data.message);
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
          return;
        } else {
          //setLoading(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(function () {
          showDangerToast('Something went wrong. Please ttry again later.');
          console.log(error);
        }, 100);
      });
  };

  return (
    <Container style={{flex: 1}}>
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        isCenterImage={false}
        centerText={I18n.t('lbl_track_location')}
        titleTop={''}
      />
      <View style={{flex: 1}}>
        <Loader loading={loading} />
        <MapView
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          ref={mapViewRef}
          //onPress={this.onMapPress}
        >
          {coordinates.map((coordinate, index) => {
            return (
              <MapView.Marker
                key={`coordinate_${index}`}
                coordinate={coordinate}
                image={globalImagePath.location_marker}
                description={'sdfsdfs'}
              />
            );
          })}
          {coordinates.length >= 2 && (
            <MapViewDirections
              origin={coordinates[0]}
              destination={coordinates[coordinates.length - 1]}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={8}
              strokeColor={colors.darkShade}
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(
                  `Started routing between "${JSON.stringify(
                    params.origin,
                  )}" and "${params.destination}"`,
                );
              }}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                setDuration(Math.ceil(result.duration));
                if (result.distance < 0.5) {
                  setShowCompletedButton(true);
                }
                mapViewRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: width / 20,
                    bottom: height / 20,
                    left: width / 20,
                    top: height / 20,
                  },
                });
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            />
          )}
        </MapView>
      </View>
      <View
        style={{
          position: 'absolute',
          backgroundColor: colors.darkShade,
          padding: 10,
          right: 10,
          top: 150,
          borderRadius: 10,
        }}>
        <Text
          style={{
            ...CommonStyles.whiteSemiBoldTextStyle(10),
            color: '#fff',
          }}>{`Arriving Time`}</Text>
        <Text
          style={{
            ...CommonStyles.whiteSemiBoldTextStyle(12),
            color: '#fff',
          }}>{`${duration} min's`}</Text>
      </View>
      {showCompletedButton && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            backgroundColor: colors.darkShade,
            padding: 10,
            right: 10,
            left: 10,
            bottom: 20,
            borderRadius: 10,
            width: '95%',
          }}
          onPress={() => bookingTrackingComplete()}>
          <Text
            style={{
              ...CommonStyles.whiteSemiBoldTextStyle(16),
              color: '#fff',
            }}>{`Complete Visit`}</Text>
        </TouchableOpacity>
      )}
    </Container>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});
