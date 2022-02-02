import React from 'react';
import { I18nManager } from 'react-native';
//***** import libraries */
import { createStackNavigator } from '@react-navigation/stack';

//***** import screens */
import Login from '../screens/auth/Login/LoginScreen';
import CustomerLogin from '../screens/auth/Login/CustomerLoginScreen';
import Signup from '../screens/auth/SignUp/SignUpScreen';
import Forgot from '../screens/auth/Forgot/ForgotScreen';
import Reset from '../screens/auth/Reset/ResetScreen';
import VerifyOtp from '../screens/auth/Verify/OtpScreen';
import SelectLanguage from '../screens/auth/SelectLanguage/SelectLanguage';
import AppGuide from '../screens/auth/AppGuide/AppGuide';
import SignInGuide from '../screens/auth/SignInGuide/SignInGuide';
import ProviderSignUp from '../screens/auth/SignUp/ProviderSignUpScreen';
import LocationPicker from '../screens/auth/LocationPicker';
import TermAndCondition from '../screens/auth/TermAndCondition';
import FileUpload from '../screens/auth/FileUpload';

//***** Navigation screens before login in the app */
const AuthStack = createStackNavigator();

export function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      //initialRouteName={"SelectLanguage"}
      initialRouteName={global.appLang ? 'SignInGuide' : 'SelectLanguage'}
      //headerMode="none"
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="SelectLanguage" component={SelectLanguage} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="CustomerLogin" component={CustomerLogin} />
      <AuthStack.Screen name="AppGuide" component={AppGuide} />
      <AuthStack.Screen name="SignInGuide" component={SignInGuide} />
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="ProviderSignUp" component={ProviderSignUp} />
      <AuthStack.Screen name="Forgot" component={Forgot} />
      <AuthStack.Screen name="Reset" component={Reset} />
      <AuthStack.Screen name="VerifyOtp" component={VerifyOtp} />
      <AuthStack.Screen name="LocationPicker" component={LocationPicker} />
      <AuthStack.Screen name="TermAndCondition" component={TermAndCondition} />
      <AuthStack.Screen name="FileUpload" component={FileUpload} />
    </AuthStack.Navigator>
  );
}
