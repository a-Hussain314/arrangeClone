import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  I18nManager,
  FlatList
} from 'react-native';
import { Container, Content } from 'native-base';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
import { style } from './style';
import NavBar from '../../../../components/NavBar';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import Loader from '../../../../components/Loader';
import { Tab, Tabs, TabHeading } from 'native-base';
import { CommonStyles } from '../../../../assets/css';
import NewRequests from './NewRequests';
import RejectedRequests from './RejectedRequests';
import Completed from './Completed';
import { getService } from '../../../../services/getServices';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../../../../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [image, setImage] = React.useState('');
  const [name, setName] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [tabsName, setTabName] = React.useState([
    { tabName: I18n.t('lbl_new_request'), select: true },
    { tabName: I18n.t('lbl_rejected_request'), select: false },
    { tabName: 'Complete', select: false }
  ]);
  React.useEffect(() => {
    getUserProfileDetails();
  }, [isFocused]);

  //***** For getting user's profile information */
  const getUserProfileDetails = user_id => {

    //***** api calling */ 
    getService('profile/detail')
      .then(res => {
        if (res.data.status === 1) {
          let data = res.data.response;
          setName(data.salon_name);
          setImage(data.salon_banner_url + data.banner_salon);

        } else {

          var message = '';
          res?.data?.errors?.map((val) => {
            message += Object.values(val) + ' '
          })
          setTimeout(function () {
            showDangerToast(message != null ? message : res.data.message);
          }, 100);
        }
      })
      .catch(error => {

        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };


  const backAction = () => {

    Alert.alert(
      '',
      I18n.t('lbl_closeApp_confirmation'), [
      {
        text: I18n.t('lbl_cancel'),
        onPress: () => null,
        style: "cancel"
      },
      { text: I18n.t('lbl_ok'), onPress: () => BackHandler.exitApp() }
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
      BackHandler.addEventListener("hardwareBackPress", backAction);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);

    }, [])
  );

  const switchTabs = (index) => {
    var cloneTab = [...tabsName];
    setCurrentIndex(index);
    cloneTab.map((ele, i) => {
      if (index == i) {
        cloneTab[index].select = true;
      } else {
        cloneTab[i].select = false;
      }

    })

    setTabName(cloneTab);
  }

  const rendertabs = (item, index) => {
    return (

      <View style={item.select ? styles.tabStyle_1 : styles.tabStyle_2}>
        <TouchableOpacity style={{}} onPress={() => { switchTabs(index) }}>
          <Text style={item.select ? styles.tabText_1 : styles.tabText_2}>{item.tabName}</Text>
        </TouchableOpacity>
      </View>

    )
  }

  return (
    <Container style={{ backgroundColor: 'rgba(255,255,255 0.1)' }}>
      <Loader loading={loading} />
      <AuthContext.Consumer>
        {
          (context) =>

            <NavBar
              textColor={'black'}
              isLeftIconUrl={true}
              leftIcon={image}
              navigator={navigation}
              backgroundColor={colors.whiteColor}
              // centerImg={''}
              notifyCount={global.notifyCount == 0 ? 0 : context.notificationCount}
              rightImage={globalImagePath.notification}
              navigation="HomePage"
              centerText={name}
            />
        }
      </AuthContext.Consumer>
      <View style={styles.tabListOuter}>

        <FlatList
          horizontal={true}
          showsVerticalScrollIndicator={false}
          data={tabsName}
          renderItem={({ item, index }) =>
            rendertabs(item, index)
          }
          keyExtractor={(item, index) => String(index)}
        />
      </View>
      <View style={{ flex: 1, }}>
        {/* {currentIndex == 0 ? <NewRequests navigation={navigation} /> : <RejectedRequests navigation={navigation} />} */}
        {currentIndex == 0 ? <NewRequests navigation={navigation} /> : null}
        {currentIndex == 1 ? <RejectedRequests navigation={navigation} /> : null}
        {currentIndex == 2 ? <Completed navigation={navigation} /> : null}
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
    color: colors.lightThemeColor
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
    fontSize: width * (14 / 375)
  },
  tabText_2: {
    color: colors.lightThemeColor,
    fontFamily: fonts.type.NunitoSans_Regular,
    fontSize: width * (14 / 375)
  },
  tabListOuter: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightThemeColor,
    alignItems: 'center',
    backgroundColor: '#fff',

  }
})