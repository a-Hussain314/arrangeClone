import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  I18nManager,
  FlatList,
} from 'react-native';
import {Container, Content} from 'native-base';
import {height, width} from '../../../constants/screenSize';
import {colors, fonts} from '../../../Theme';
import {globalImagePath} from '../../../constants/globalImagePath';
import NavBar from '../../../components/NavBarEmployee';
import font from '../../../Theme/font';
import I18n from '../../../I18n';
import Loader from '../../../components/Loader';
import {Tab, Tabs, TabHeading} from 'native-base';
import {CommonStyles} from '../../../assets/css';
import Current from './CurrentBookingScreen';
import Completed from './CompletedBookingScreen';
import {getService} from '../../../services/getServices';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AuthContext} from '../../../contexts/AuthContext';

export default function HomeScreen({navigation}) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [image, setImage] = React.useState('');
  const [name, setName] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [tabsName, setTabName] = React.useState('first');
  React.useEffect(() => {}, [isFocused]);

  const backAction = () => {
    Alert.alert('', I18n.t('lbl_closeApp_confirmation'), [
      {
        text: I18n.t('lbl_cancel'),
        onPress: () => null,
        style: 'cancel',
      },
      {text: I18n.t('lbl_ok'), onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled()) {
          disableSelectionMode();
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []),
  );

  const switchTabs = (name) => {
    setTabName(name);
  };

  return (
    <Container style={{backgroundColor: 'rgba(255,255,255 0.1)'}}>
      <Loader loading={loading} />
      <AuthContext.Consumer>
        {(context) => (
          <NavBar
            textColor={'black'}
            isLeftIconUrl={true}
            leftIcon={image}
            navigator={navigation}
            backgroundColor={colors.whiteColor}
            notifyCount={
              global.notifyCount == 0 ? 0 : context.notificationCount
            }
            rightImage={globalImagePath.notification}
            navigation="HomePage"
            centerText={name}
          />
        )}
      </AuthContext.Consumer>
      <View style={styles.tabListOuter}>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            style={{}}
            onPress={() => {
              switchTabs('first');
              setCurrentTab(1);
              setCurrentIndex(0);
            }}>
            <View
              style={
                tabsName == 'first' ? styles.tabStyle_1 : styles.tabStyle_2
              }>
              <Text
                style={
                  tabsName == 'first' ? styles.tabText_1 : styles.tabText_2
                }>
                {I18n.t('lbl_current_request')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            style={{}}
            onPress={() => {
              switchTabs('second');
              setCurrentTab(2);
              setCurrentIndex(1);
            }}>
            <View
              style={
                tabsName == 'second' ? styles.tabStyle_1 : styles.tabStyle_2
              }>
              <Text
                style={
                  tabsName == 'second' ? styles.tabText_1 : styles.tabText_2
                }>
                {I18n.t('lbl_complete_request')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>
        {currentIndex == 0 ? (
          <Current navigation={navigation} currentTabNum={currentTab} />
        ) : null}
        {currentIndex == 1 ? (
          <Completed navigation={navigation} currentTabNum={currentTab} />
        ) : null}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    marginTop: width * (5 / 375),
    fontFamily: CommonStyles.APP_FONT_MEDIUM,
    fontSize: width * (12 / 375),
    color: colors.themeColor,
  },
  inActiveTab: {
    marginTop: width * (5 / 375),
    fontFamily: CommonStyles.APP_FONT_MEDIUM,
    fontSize: width * (12 / 375),
    color: colors.lightThemeColor,
  },
  tabStyle_1: {
    borderBottomWidth: width * (3 / 375),
    borderBottomColor: colors.darkShade,
    paddingHorizontal: width * (35 / 375),
    marginLeft: width * (10 / 375),
    height: width * (40 / 375),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabStyle_2: {
    paddingHorizontal: width * (35 / 375),
    marginLeft: width * (10 / 375),
    height: width * (40 / 375),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText_1: {
    color: colors.darkShade,
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (14 / 375),
  },
  tabText_2: {
    color: colors.lightThemeColor,
    fontFamily: fonts.type.NunitoSans_Regular,
    fontSize: width * (14 / 375),
  },
  tabListOuter: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightThemeColor,
    backgroundColor: '#fff',
  },
});
