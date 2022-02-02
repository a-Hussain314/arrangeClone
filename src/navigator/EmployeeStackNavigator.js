import React from 'react';
import {I18nManager} from 'react-native';
//***** import libraries */
import {createStackNavigator} from '@react-navigation/stack';

//***** import screens */
import HomeScreen from '../screens/app/Employee/HomeScreen';
import RequestDetails from '../screens/app/Employee/RequestDetails';
import SettingScreen from '../screens/app/Employee/SettingScreen';
import ChangePassword from '../screens/app/Employee/ChangePasswordScreen';
import Notification from '../screens/app/Employee/Notification';
import SelectLanguage from '../screens/app/CommonScreens/SelectLanguage/SelectLanguage';
import TrackOrder from '../screens/app/Employee/TrackOrder';
import EditProfileScreen from '../screens/app/Employee/EditProfileScreen';

//***** Navigation screens before login in the app */
const EmployeeStack = createStackNavigator();

export function EmployeeStackNavigator() {
  return (
    <EmployeeStack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
      }}>
      <EmployeeStack.Screen name="Home" component={HomeScreen} />
      <EmployeeStack.Screen name="EditProfile" component={EditProfileScreen} />
      <EmployeeStack.Screen name="RequestDetails" component={RequestDetails} />
      <EmployeeStack.Screen name="Setting" component={SettingScreen} />
      <EmployeeStack.Screen name="ChangePassword" component={ChangePassword} />
      <EmployeeStack.Screen name="Notification" component={Notification} />
      <EmployeeStack.Screen name="SelectLanguage" component={SelectLanguage} />
      <EmployeeStack.Screen name="TrackOrder" component={TrackOrder} />
    </EmployeeStack.Navigator>
  );
}
