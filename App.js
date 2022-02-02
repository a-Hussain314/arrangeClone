import React, {useState} from 'react';
import {
  SafeAreaView,
  Modal,
  View,
  Image,
  Text,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Alert,
  NativeModules,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {I18nManager} from 'react-native';
import {AuthContext} from './src/contexts/AuthContext';
import {UserContext} from './src/contexts/UserContext';
import {AuthStackNavigator} from './src/navigator/AuthStackNavigator';
import {MainTabNavigator} from './src/navigator/MainTabNavigator';
import {ProviderTabNavigator} from './src/navigator/ProviderTabNavigator';
import {EmployeeStackNavigator} from './src/navigator/EmployeeStackNavigator';
import {LoadingScreen} from './src/screens/auth/LoadingScreen';
import {useAuth} from './src/hooks/useAuth';
import {Container, Content} from 'native-base';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import {globalImagePath} from './src/constants/globalImagePath';
import Button from './src/components/Button';
import I18n from './src/I18n';
import {firebase} from '@react-native-firebase/messaging';
//import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {getService} from './src/services/getServices';
import {colors} from './src/Theme';
import {openSettings} from 'react-native-permissions';
import getSetNotification from './src/screens/app/CommonScreens/getSetNotification';
const RootStack = createStackNavigator();
global.isConnected = true;
global.appLang = false;
global.lat = '';
global.lng = '';
global.root = '';
global.notifyCount = '';
export default function App() {
  const {auth, state} = useAuth();
  const [netConnected, setNetConnected] = React.useState(true);
  const [getNotificationCount, setNotificationCount] = React.useState('');
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  React.useEffect(() => {
    AsyncStorage.getItem('appLanguage').then((lang) => {
      if (lang) {
        global.appLang = true;
      }
    });

    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);

    I18n.locale = I18nManager.isRTL == true ? 'ar' : 'en';
    NetInfo.addEventListener(handleConnectivityChange);
    //For push notification
    checkPermission();
    onNotificationOpenedApp = firebase
      .messaging()
      .onNotificationOpenedApp(onNotificationOpenedApp);
    onMessage = firebase.messaging().onMessage(onMessage);
    firebase.messaging().getInitialNotification().then(getInitialNotification);
    firebase.messaging().setBackgroundMessageHandler(async (data) => {
      console.log('setBackgroundMessageHandler', data);
    });

    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      // NetInfo.removeEventListener(handleConnectivityChange);
      Geolocation.clearWatch(watchID);
      onNotificationOpenedApp();
      onMessage();
    };
  }, []);

  function getNotifyCount() {
    //***** api calling */
    getService(`profile/notifications-count`)
      .then((res) => {
        console.log('suser/profile/notifications-count ==> ');
        if (res.data.status === 1) {
          setNotificationCount(
            res.data && res.data.response && res.data.response.count,
          );
        } else {
          setTimeout(function () {
            // showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        console.log('error =>', error);
      });
  }

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
        global.lat = position.coords.latitude;
        global.lng = position.coords.longitude;
        let curruntLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        await AsyncStorage.setItem(
          'curruntLocation',
          JSON.stringify(curruntLocation),
        );
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        //  console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //   console.log("currentLatitude, currentLongitude", position.coords.latitude, position.coords.longitude);
        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
        global.lat = position.coords.latitude;
        global.lng = position.coords.longitude;
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  handleConnectivityChange = (state) => {
    if (state.isConnected) {
      global.isConnected = true;
      //showDangerToast("No Internet Connection");
      setNetConnected(state.isConnected);
    } else {
      global.isConnected = false;
      //showToast("Internet Connected");
      setNetConnected(state.isConnected);
    }
  };

  const isConnected = async () => {
    await fetch('https://www.google.com/')
      .then((response) => {
        if (response.ok) {
          global.isConnected = true;
          setNetConnected(true);
        }
        // Do stuff with the response
      })
      .catch((error) => {
        return false;
      });
  };

  let onMessage = (data) => {
    global.notifyCount = 1;
    getNotifyCount();
    showAlert(data.notification.title, data.notification.body);
  };

  let onNotificationOpenedApp = (data) => {
    console.log('onNotificationOpenedApp', data);
  };

  const getInitialNotification = (data) => {
    console.log('getInitialNotification', data);
  };

  const showAlert = (title, msg) => {
    Alert.alert(
      title,
      msg,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  };

  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();

    if (enabled === 1) {
      getToken();
    } else {
      requestPermission();
      getToken();
    }
  };

  const getToken = async () => {
    await AsyncStorage.getItem('fcmToken', async (err1, fcmToken) => {
      // console.log("fcmToken AsyncStorage=>" + fcmToken);
      if (!fcmToken) {
        // user has a device token
        fcmToken = await firebase.messaging().getToken();

        await AsyncStorage.setItem('fcmToken', fcmToken);
        // console.log("fcmToken user has a device token 1" + fcmToken);
        global.fcmToken = fcmToken;
      } else {
        // console.log("user has a device token 2" + fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        global.fcmToken = fcmToken;
      }
      // console.log("FCM TOKE" + fcmToken);
    });
  };

  const requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };

  _renderModelView = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={!netConnected}
        onRequestClose={() => {
          BackHandler.exitApp();
        }}>
        <View
          style={{
            marginTop: 22,
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center',
          }}>
          <View style={{justifyContent: 'center', marginBottom: 30}}>
            <Image
              source={globalImagePath.appIcon}
              style={{alignSelf: 'center'}}
            />
          </View>
          <Text
            style={{
              alignSelf: 'flex-start',
              marginLeft: 24,
              fontSize: 20,
              fontWeight: '600',
            }}>
            {I18n.t('lbl_offline')}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-start',
              marginLeft: 24,
              marginTop: 16,
              marginBottom: 24,
              fontSize: 16,
              fontWeight: '400',
            }}>
            {I18n.t('lbl_unavailable_network')}
          </Text>
          <View style={{height: 50, width: 200}}>
            <Button
              label={I18n.t('lbl_retry')}
              textSize={14}
              onPress={() => isConnected()}
            />
          </View>
        </View>
      </Modal>
    );
  };

  function renderScreens() {
    if (state.loading) {
      return <RootStack.Screen name={'Loading'} component={LoadingScreen} />;
    }
    //console.log("state.user.role", state.user);

    if (state.user && state.user.role == 2) {
      return (
        <RootStack.Screen name={'MainTab'}>
          {() => (
            <UserContext.Provider value={state.user}>
              <MainTabNavigator />
            </UserContext.Provider>
          )}
        </RootStack.Screen>
      );
    } else if (state.user && state.user.role == 3) {
      return (
        <RootStack.Screen name={'ProviderTab'}>
          {() => (
            <UserContext.Provider value={state.user}>
              <ProviderTabNavigator />
            </UserContext.Provider>
          )}
        </RootStack.Screen>
      );
    } else if (state.user && state.user.role == 4) {
      return (
        <RootStack.Screen name={'EmployeeStack'}>
          {() => (
            <UserContext.Provider value={state.user}>
              <EmployeeStackNavigator />
            </UserContext.Provider>
          )}
        </RootStack.Screen>
      );
    } else {
      return (
        <RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />
      );
    }
  }
  //value={{ auth: auth, notificationCount: getNotificationCount }}
  return (
    <Container>
      <SafeAreaView style={{flex: 1}}>
        <AuthContext.Provider
          value={{auth: auth, notificationCount: getNotificationCount}}>
          <NavigationContainer>
            {_renderModelView()}
            <RootStack.Navigator
              screenOptions={{
                headerShown: false,
                animationEnabled: false,
              }}>
              {renderScreens()}
            </RootStack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      </SafeAreaView>
      <FlashMessage position="top" />
    </Container>
  );
}
console.disableYellowBox = true;
