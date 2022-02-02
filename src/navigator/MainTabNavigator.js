import React, { Component } from 'react';
import { NavigationActions, StackActions, CommonActions } from '@react-navigation/native';
import { View, Text, Platform, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { globalImagePath } from '../constants/globalImagePath';
import { colors } from '../Theme';
import { width, height } from '../constants/screenSize';

import Home from '../screens/app/User/Home/HomeScreen';
import SalonServiceList from '../screens/app/User/Home/SalonServiceList';
import UserProfile from '../screens/app/User/Profile/UserProfileScreen';
import EditProfile from '../screens/app/User/Profile/EditProfileScreen';
import ChangePassword from '../screens/app/User/Profile/ChangePasswordScreen';
import ManageAddress from '../screens/app/User/Profile/ManageAddress';
import SaveCard from '../screens/app/User/Profile/SaveCard';
import AddNewCard from '../screens/app/User/Profile/AddNewCard';
import Wallet from '../screens/app/User/Profile/Wallet';
import Support from '../screens/app/CommonScreens/Support';
import RefundAndCancellationPolicy from '../screens/app/CommonScreens/RefundAndCancellationPolicy';
import PrivacyPolicy from '../screens/app/CommonScreens/PrivacyPolicy';
import AboutUs from '../screens/app/CommonScreens/AboutUs';
import Bookings from '../screens/app/User/Profile/Bookings';
import BookingDetails from '../screens/app/User/Profile/BookingDetails';
import ReviewRating from "../screens/app/User/Profile/ReviewRatingScreen";
import ViewLocation from '../screens/app/User/Profile/ViewLocation';
import TrackOrder from '../screens/app/User/Profile/TrackOrder';
import Notification from '../screens/app/Notification/Notification';
import AddNewAddress from '../screens/app/User/Profile/AddNewAddress';
import OfferList from '../screens/app/User/Profile/OfferList';
import OfferDetails from '../screens/app/User/Profile/OfferDetails';
import SelectLanguage from '../screens/app/CommonScreens/SelectLanguage/SelectLanguage';
import Subscription from '../screens/app/CommonScreens/Subscription';
import SearchSalon from '../screens/app/User/SearchSalon/SearchSalon';
import RecommendAndTopSalonList from '../screens/app/User/Home/RecommendAndTopSalonList';
import SalonDetails from '../screens/app/User/SalonDetails/SalonDetails';
import MapScreen from '../screens/app/User/SalonDetails/SalonOverView/MapScreen';
import I18n from '../I18n';
import BeautyCare from '../screens/app/User/BeautyCare/BeautyCare';
import FavoriteList from '../screens/app/User/Profile/FavoriteSalonList';
import SelectDateAndTime from '../screens/app/User/SearchSalon/SelectDateAndTime';
import Booking from '../screens/app/User/SearchSalon/Booking';
import LocationPicker from '../screens/app/CommonScreens/LocationPicker';
import Congratulation from '../screens/app/User/SearchSalon/Congratulation';
import PaymentWebView from '../screens/app/CommonScreens/PaymentWebView';
import ProviderProfileScreen from '../screens/app/Provider/ProviderProfile/ProviderProfileScreen';
import TermAndCondition from "../screens/auth/TermAndCondition";
const MainTab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const SearchStack = createStackNavigator();
const HomeStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      initialRouteName="UserProfile"
      //headerMode="none"
      screenOptions={{
        headerShown: false,
      }}>
      <ProfileStack.Screen name="UserProfile" component={UserProfile} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePassword} />
      <ProfileStack.Screen name="ManageAddress" component={ManageAddress} />
      <ProfileStack.Screen name="SaveCard" component={SaveCard} />
      <ProfileStack.Screen name="AddNewCard" component={AddNewCard} />
      <ProfileStack.Screen name="Wallet" component={Wallet} />
      <ProfileStack.Screen name="Support" component={Support} />
      <ProfileStack.Screen name="Bookings" component={Bookings} />
      <ProfileStack.Screen name="BookingDetails" component={BookingDetails} />
      <ProfileStack.Screen name="ReviewRating" component={ReviewRating} />
      <ProfileStack.Screen name="ViewLocation" component={ViewLocation} />
      <ProfileStack.Screen name="TrackOrder" component={TrackOrder} />
      <ProfileStack.Screen name="Notification" component={Notification} />
      <ProfileStack.Screen name="AddNewAddress" component={AddNewAddress} />
      <ProfileStack.Screen name="SelectLanguage" component={SelectLanguage} />
      <ProfileStack.Screen name="FavoriteList" component={FavoriteList} />
      <ProfileStack.Screen name="OfferList" component={OfferList} />
      <ProfileStack.Screen name="OfferDetails" component={OfferDetails} />
      <ProfileStack.Screen name="LocationPicker" component={LocationPicker} />
      <ProfileStack.Screen name="RefundAndCancellationPolicy" component={RefundAndCancellationPolicy} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <ProfileStack.Screen name="AboutUs" component={AboutUs} />
      <ProfileStack.Screen name="Subscription" component={Subscription} />
      <ProfileStack.Screen name="PaymentWebView" component={PaymentWebView} />
      <ProfileStack.Screen name="SalonDetails" component={SalonDetails} />
    </ProfileStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator
      initialRouteName="SearchSalon"
      //headerMode="none"
      screenOptions={{
        headerShown: false,
      }}>
      <SearchStack.Screen name="SearchSalon" component={SearchSalon} />
      <SearchStack.Screen name="SalonDetails" component={SalonDetails} />
      <SearchStack.Screen name="SelectDateAndTime" component={SelectDateAndTime} />
      <SearchStack.Screen name="Booking" component={Booking} />
      <SearchStack.Screen name="Congratulation" component={Congratulation} />
      <SearchStack.Screen name="MapScreen" component={MapScreen} />
      <SearchStack.Screen name="PaymentWebView" component={PaymentWebView} />
      <SearchStack.Screen name="TrackOrder" component={TrackOrder} />
      <SearchStack.Screen name="TermAndCondition" component={TermAndCondition} />
      <SearchStack.Screen name="Bookings" component={Bookings} />
    </SearchStack.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      //headerMode="none"
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Notification" component={Notification} />
      <HomeStack.Screen name="SalonDetails" component={SalonDetails} />
      <SearchStack.Screen name="MapScreen" component={MapScreen} />
      <HomeStack.Screen name="RecommendAndTopSalonList" component={RecommendAndTopSalonList} />
      <HomeStack.Screen name="SelectDateAndTime" component={SelectDateAndTime} />
      <HomeStack.Screen name="Booking" component={Booking} />
      <HomeStack.Screen name="SearchSalon" component={SearchSalon} />
      <HomeStack.Screen name="Congratulation" component={Congratulation} />
      <HomeStack.Screen name="LocationPicker" component={LocationPicker} />
      <HomeStack.Screen name="SalonServiceList" component={SalonServiceList} />
      <HomeStack.Screen name="PaymentWebView" component={PaymentWebView} />
      <HomeStack.Screen name="TrackOrder" component={TrackOrder} />
      <HomeStack.Screen name="Bookings" component={Bookings} />
      <HomeStack.Screen name="TermAndCondition" component={TermAndCondition} />
    </HomeStack.Navigator >
  );
}
export function MainTabNavigator() {
  return (
    <MainTab.Navigator
      initialRouteName={'Home'}
      tabBarOptions={{
        activeTintColor: colors.primary,
        style: style.tabBarContainer,
      }}>
      <MainTab.Screen
        name="Home"
        component={HomeStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Home", { screen: "Home" });
          }
        })}
        options={{
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <Text
                style={[
                  style.tabLabel,
                  {
                    color: focused ? colors.darkShade : colors.themeColor,
                  },
                ]}>
                {I18n.t('lbl_home')}
              </Text>
            );
          },
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <Image
                source={
                  focused
                    ? globalImagePath.homeDarkShade
                    : globalImagePath.homeDarkShade
                }
                style={focused ? style.icon_1 : style.icon_2}
              />
            );
          },
        }}
      />

      <MainTab.Screen
        name="Search"
        component={SearchStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("SearchSalon", { screen: "SearchSalon" });
          }
        })}
        options={{
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <Text
                style={[
                  style.tabLabel,
                  {
                    color: focused ? colors.darkShade : colors.themeColor,
                  },
                ]}>
                {I18n.t('lbl_search')}
              </Text>
            );
          },
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <Image
                source={
                  focused
                    ? globalImagePath.searchLight
                    : globalImagePath.searchLight
                }
                style={focused ? style.icon_1 : style.icon_2}
              />
            );
          },
        }}
      />
      <MainTab.Screen
        name="Beaty Clinic"
        component={BeautyCare}
        options={{
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <Text
                style={[
                  style.tabLabel,
                  {
                    color: focused ? colors.darkShade : colors.themeColor,
                  },
                ]}>
                {I18n.t('lbl_beaty_clinic')}
              </Text>
            );
          },
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <Image
                source={
                  focused
                    ? globalImagePath.careLight
                    : globalImagePath.careLight
                }
                style={focused ? style.icon_1 : style.icon_2}
              />
            );
          },
        }}
      />

      <MainTab.Screen
        name="Profile"
        component={ProfileStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            console.log("e ===", e);
            e.preventDefault();
            navigation.navigate("Profile", { screen: "UserProfile" });
          }
        })}
        options={{
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <Text
                style={[
                  style.tabLabel,
                  {
                    color: focused ? colors.darkShade : colors.themeColor,
                  },
                ]}>
                {I18n.t('lbl_profile')}
              </Text>
            );
          },
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <Image
                source={
                  focused
                    ? globalImagePath.profileLight
                    : globalImagePath.profileLight
                }
                style={focused ? style.icon_1 : style.icon_2}
              />
            );
          },
        }}
      />
    </MainTab.Navigator>
  );
}

const style = StyleSheet.create({
  tabBarContainer: {
    height: Platform.OS == 'android' ? 60 : 50,
    paddingBottom: Platform.OS == 'android' ? 10 : 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  tabLabel: {
    fontSize: width * 0.025,
    // fontFamily: CommonStyles.APP_FONT_MEDIUM
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
