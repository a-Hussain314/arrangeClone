import React, {Component} from 'react';
import {
  NavigationActions,
  StackActions,
  CommonActions,
} from '@react-navigation/native';
import {View, Text, Platform, StyleSheet, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {globalImagePath} from '../constants/globalImagePath';
import {colors} from '../Theme';
import {width, height} from '../constants/screenSize';

import Home from '../screens/app/Provider/Home/HomeScreen';
import Setting from '../screens/app/Provider/Setting/Setting';
import ProviderProfileScreen from '../screens/app/Provider/ProviderProfile/ProviderProfileScreen';
import LocationPicker from '../screens/app/CommonScreens/LocationPicker';
import ChangePassword from '../screens/app/User/Profile/ChangePasswordScreen';
import ManageAddress from '../screens/app/User/Profile/ManageAddress';
import SaveCard from '../screens/app/User/Profile/SaveCard';
import AddNewCard from '../screens/app/User/Profile/AddNewCard';
import Wallet from '../screens/app/User/Profile/Wallet';
import Support from '../screens/app/CommonScreens/Support';
import MySubscription from '../screens/app/CommonScreens/MySubscription';
import RefundAndCancellationPolicy from '../screens/app/CommonScreens/RefundAndCancellationPolicy';
import PrivacyPolicy from '../screens/app/CommonScreens/PrivacyPolicy';
import AboutUs from '../screens/app/CommonScreens/AboutUs';
import PaymentWebView from '../screens/app/CommonScreens/PaymentWebView';
import Subscription from '../screens/app/CommonScreens/Subscription';
import PaymentScreen from '../screens/app/CommonScreens/PaymentScreen';
import Bookings from '../screens/app/User/Profile/Bookings';
import Notification from '../screens/app/Notification/Notification';
import AddNewAddress from '../screens/app/User/Profile/AddNewAddress';
import I18n from '../I18n';
import UpcomingAppointment from '../screens/app/Provider/UpcomingAppointment/UpcomingAppointment';
import EarningManagement from '../screens/app/Provider/EarningManagement/EarningManagement';
import ProviderSalonDetails from '../screens/app/Provider/Setting/ProviderSalonDetails/ProviderSalonDetails';
import SelectLanguage from '../screens/app/CommonScreens/SelectLanguage/SelectLanguage';
import BeautyCare from '../screens/app/User/BeautyCare/BeautyCare';
import AddService from '../screens/app/Provider/AddService/AddService';
import RequestedDetails from '../screens/app/Provider/Home/RequestedDetails';
import TrackOrder from '../screens/app/Provider/Home/TrackOrder';
import ManageAppointment from '../screens/app/Provider/Setting/ManageAppointment/ManageAppointment';
import EmployeeList from '../screens/app/Provider/Setting/ManageEmployees/EmployeesList';
import AddEmployee from '../screens/app/Provider/Setting/ManageEmployees/AddEmployee';
import EditEmployee from '../screens/app/Provider/Setting/ManageEmployees/EditEmployee';

const ProviderTab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const HomeStack = createStackNavigator();

function SettingStackScreen() {
  return (
    <ProfileStack.Navigator
      initialRouteName="Setting"
      //headerMode="none"
      screenOptions={{
        headerShown: false,
      }}>
      <ProfileStack.Screen name="Setting" component={Setting} />
      <ProfileStack.Screen
        name="ProviderProfileScreen"
        component={ProviderProfileScreen}
      />
      <ProfileStack.Screen name="LocationPicker" component={LocationPicker} />
      <ProfileStack.Screen
        name="EarningManagement"
        component={EarningManagement}
      />
      <ProfileStack.Screen name="ManageAddress" component={ManageAddress} />
      <ProfileStack.Screen name="SaveCard" component={SaveCard} />
      <ProfileStack.Screen name="AddNewCard" component={AddNewCard} />
      <ProfileStack.Screen name="SelectLanguage" component={SelectLanguage} />
      <ProfileStack.Screen name="Wallet" component={Wallet} />
      <ProfileStack.Screen name="Support" component={Support} />
      <ProfileStack.Screen name="Bookings" component={Bookings} />
      <ProfileStack.Screen name="Notification" component={Notification} />
      <ProfileStack.Screen name="AddNewAddress" component={AddNewAddress} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePassword} />
      <ProfileStack.Screen
        name="RefundAndCancellationPolicy"
        component={RefundAndCancellationPolicy}
      />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <ProfileStack.Screen name="AboutUs" component={AboutUs} />
      <ProfileStack.Screen
        name="ProviderSalonDetails"
        component={ProviderSalonDetails}
      />
      <ProfileStack.Screen name="AddService" component={AddService} />
      <ProfileStack.Screen
        name="ManageAppointment"
        component={ManageAppointment}
      />
      <ProfileStack.Screen name="EmployeeList" component={EmployeeList} />
      <ProfileStack.Screen name="AddEmployee" component={AddEmployee} />
      <ProfileStack.Screen name="EditEmployee" component={EditEmployee} />
      <ProfileStack.Screen name="Subscription" component={Subscription} />
      <ProfileStack.Screen name="PaymentScreen" component={PaymentScreen} />
      <ProfileStack.Screen
        name="RequestedDetails"
        component={RequestedDetails}
      />
      <ProfileStack.Screen name="TrackOrder" component={TrackOrder} />
      <ProfileStack.Screen name="PaymentWebView" component={PaymentWebView} />
      <ProfileStack.Screen name="MySubscription" component={MySubscription} />
    </ProfileStack.Navigator>
  );
}

function NewAppointmentStackScreen() {
  return (
    <ProfileStack.Navigator
      initialRouteName="UpcomingAppointment"
      screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="Home" component={Home} />
      <ProfileStack.Screen
        name="UpcomingAppointment"
        component={UpcomingAppointment}
      />
      <ProfileStack.Screen
        name="RequestedDetails"
        component={RequestedDetails}
      />
      <ProfileStack.Screen name="TrackOrder" component={TrackOrder} />
      <ProfileStack.Screen name="PaymentWebView" component={PaymentWebView} />
      <ProfileStack.Screen name="MySubscription" component={MySubscription} />
    </ProfileStack.Navigator>
  );
}

function HomeStackScreen() {
  var initialScreen = global.providerLoginCount == 1 ? 'Subscription' : 'Home';

  return (
    <HomeStack.Navigator
      initialRouteName={initialScreen}
      //headerMode="none"
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Notification" component={Notification} />
      <HomeStack.Screen name="RequestedDetails" component={RequestedDetails} />
      <HomeStack.Screen name="TrackOrder" component={TrackOrder} />
      <HomeStack.Screen name="Subscription" component={Subscription} />
      <HomeStack.Screen
        name="UpcomingAppointment"
        component={UpcomingAppointment}
      />
      <HomeStack.Screen name="PaymentWebView" component={PaymentWebView} />
      <HomeStack.Screen name="MySubscription" component={MySubscription} />
    </HomeStack.Navigator>
  );
}
export function ProviderTabNavigator() {
  return (
    <ProviderTab.Navigator
      initialRouteName={'Home'}
      tabBarOptions={{
        activeTintColor: colors.primary,
        style: style.tabBarContainer,
      }}>
      <ProviderTab.Screen
        name="Home"
        component={HomeStackScreen}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', {screen: 'Home'});
          },
        })}
        options={{
          tabBarLabel: ({focused, tintColor}) => {
            return (
              <Text
                style={[
                  style.tabLabel,
                  {
                    color: focused ? colors.darkShade : colors.themeColor,
                    paddingTop: 10,
                  },
                ]}>
                {I18n.t('lbl_new_appointment')}
              </Text>
            );
          },
          tabBarIcon: ({focused, tintColor}) => {
            return (
              <Image
                source={
                  focused
                    ? globalImagePath.newAppointment
                    : globalImagePath.newAppointment
                }
                style={focused ? style.icon_1 : style.icon_2}
              />
            );
          },
        }}
      />

      <ProviderTab.Screen
        name="Search"
        component={NewAppointmentStackScreen}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('UpcomingAppointment', {
              screen: 'UpcomingAppointment',
            });
          },
        })}
        options={{
          tabBarLabel: ({focused, tintColor}) => {
            return (
              <Text
                style={[
                  style.tabLabel,
                  {
                    color: focused ? colors.darkShade : colors.themeColor,
                    textAlign: 'center',
                  },
                ]}>
                {I18n.t('lbl_upcoming_appointment')}
              </Text>
            );
          },
          tabBarIcon: ({focused, tintColor}) => {
            return (
              <Image
                source={
                  focused ? globalImagePath.calendar : globalImagePath.calendar
                }
                style={focused ? style.icon_1 : style.icon_2}
              />
            );
          },
        }}
      />
      <ProviderTab.Screen
        name="Beaty Clinic"
        component={EarningManagement}
        options={{
          tabBarLabel: ({focused, tintColor}) => {
            return (
              <Text
                style={[
                  style.tabLabel,
                  {
                    color: focused ? colors.darkShade : colors.themeColor,
                    textAlign: 'center',
                  },
                ]}>
                {I18n.t('lbl_earning_management')}
              </Text>
            );
          },
          tabBarIcon: ({focused, tintColor}) => {
            return (
              <Image
                source={
                  focused
                    ? globalImagePath.earningMgmt
                    : globalImagePath.earningMgmt
                }
                style={focused ? style.icon_1 : style.icon_2}
              />
            );
          },
        }}
      />

      <ProviderTab.Screen
        name="Profile"
        component={SettingStackScreen}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Profile', {screen: 'Setting'});
          },
        })}
        options={{
          tabBarLabel: ({focused, tintColor}) => {
            return (
              <Text
                style={[
                  style.tabLabel,
                  {
                    color: focused ? colors.darkShade : colors.themeColor,
                    paddingTop: 10,
                  },
                ]}>
                {I18n.t('lbl_profile')}
              </Text>
            );
          },
          tabBarIcon: ({focused, tintColor}) => {
            return (
              <Image
                source={
                  focused ? globalImagePath.setting : globalImagePath.setting
                }
                style={focused ? style.icon_1 : style.icon_2}
              />
            );
          },
        }}
      />
    </ProviderTab.Navigator>
  );
}

const style = StyleSheet.create({
  tabBarContainer: {
    height: Platform.OS == 'android' ? 70 : 60,
    paddingBottom: Platform.OS == 'android' ? 10 : 5,
    paddingLeft: 5,
    paddingRight: 5,
    // paddingTop: 10
  },
  tabLabel: {
    fontSize: width * 0.025,
    // fontFamily: CommonStyles.APP_FONT_MEDIUM,
  },
  icon_1: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.darkShade,
  },
  icon_2: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.themeColor,
  },
});
