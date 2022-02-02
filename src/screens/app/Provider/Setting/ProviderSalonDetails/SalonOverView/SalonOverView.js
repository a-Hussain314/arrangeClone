import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { height, width } from '../../../../../../constants/screenSize';
import { fonts, colors } from '../../../../../../Theme';
//import { styles } from './styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import font from '../../../../../../Theme/font';
import I18n from '../../../../../../I18n';
import { globalImagePath } from '../../../../../../constants/globalImagePath';
import { showDangerToast } from '../../../../../../components/ToastMessage';
import Loader from '../../../../../../components/Loader';
import { getService } from '../../../../../../services/getServices';
import TransparentButton from '../../../../../../components/TransparentButton';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

export default function SearchOverView({ navigation, salonDetails, currentIndex }) {
  const isFocused = useIsFocused();
  const [salonWeek, setSalonWeek] = React.useState([
    { title: 'Monday', time: '10am-7:30pm' },
    { title: 'Tuesday', time: '10am-7:30pm' },
    { title: 'Wednesday', time: '10am-7:30pm' },
    { title: 'Thursday', time: '10am-7:30pm' },
    { title: 'Friday', time: '10am-7:30pm' },
    { title: 'Saturday', time: 'Closed' },
    { title: 'Sunday', time: 'Closed' },
  ]);
  const [overviewDetails, setSalonOverviewDetails] = React.useState('');
  const [openTime, setOpenTime] = React.useState('');
  const [closeTime, setCloseTime] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useFocusEffect(
    React.useCallback(() => {
      getSalonDetails();
    }, [])

  );

  React.useEffect(() => {
    // if (salonDetails) {
    //     setSalonOverviewDetails(salonDetails)
    // }
    // console.log("currentTabNum =>", currentTabNum);
    // getSalonDetails();
  }, [currentIndex]);

  function getSalonDetails() {
    setLoading(true);
    //***** api calling */
    getService('profile/detail')
      .then(async (res) => {
        setLoading(false);

        if (res.data.status === 1) {
          setLoading(false);
          let data = res.data.response;
          console.log('data =>', data);
          setSalonOverviewDetails(data);

          let availArray = [];
          let day = '';
          data.availability.map((item, index) => {
            day =
              index == 0
                ? 'Monday'
                : index == 1
                  ? 'Tuesday'
                  : index == 2
                    ? 'Wednesday'
                    : index == 3
                      ? 'Thursday'
                      : index == 4
                        ? 'Friday'
                        : index == 5
                          ? 'Saturday'
                          : 'Sunday';
            availArray.push({
              title: day,
              time: item.open ? item.open + '-' + item.close : 'Closed',
            });
          });

          let dayArr = await availArray.filter((item) => {
            if (item.title == moment().format('dddd')) {
              return item;
            }
          });

          let dayTime =
            dayArr[0] && dayArr[0].time && dayArr[0].time != 'Close'
              ? dayArr[0].time.split('-')
              : [];

          setOpenTime(dayTime[0]);
          setCloseTime(dayTime[1]);
          setSalonWeek(await availArray);
        } else {
          setLoading(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  }

  // Render salon time
  const recommandSalon = (item, index) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: index == 0 ? 5 : 20 }}>
        <View style={{ flex: 0.35, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.themeColor,
                fontFamily: font.type.NunitoSans_bold,
                fontSize: 14,
              }}>
              {item.title}
            </Text>
          </View>
        </View>
        <View style={{ flex: 0.1, flexDirection: 'row' }}>
          <Text>{':'}</Text>
        </View>
        <View style={{ flex: 0.55, alignItems: 'flex-start' }}>
          {item.time != 'Closed' ? (
            <Text
              style={{
                color: colors.themeColor,
                fontFamily: font.type.NunitoSans_Regular,
                fontSize: 14,
              }}>
              {item.time}
            </Text>
          ) : (
            <Text
              style={{
                color: 'red',
                fontFamily: font.type.NunitoSans_Regular,
                fontSize: 14,
              }}>
              {I18n.t('lbl_closed')}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const onRegionChange = (region) => {
    this.setState({ region });
  };

  return overviewDetails ? (
    <ScrollView
      style={{
        flex: 1,
        marginHorizontal: width * (20 / 375),
        backgroundColor: '#fff',
      }}>
      <Loader loading={loading} />
      <View
        style={{
          flex: 1,
        }}>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontFamily: font.type.NunitoSans_bold, fontSize: 16 }}>
              {I18n.t('lbl_address')}
            </Text>
            <TransparentButton
              label={I18n.t('lbl_edit')}
              textSize={16}
              onPress={() => navigation.navigate('ProviderProfileScreen')}
            />
          </View>
          <Text
            style={{
              fontFamily: font.type.NunitoSans_SemiBold,
              fontSize: 14,
              marginTop: 15,
              textAlign: 'left',
            }}>
            {I18n.t('lbl_home')}
          </Text>
          <Text
            style={{
              color: colors.themeColor,
              // fontFamily: font.type.OpenSans_Regular,
              fontSize: 12,
              textAlign: 'left',
            }}>
            {overviewDetails.address}
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontFamily: font.type.NunitoSans_bold,
              fontSize: 16,
              textAlign: 'left',
            }}>
            {I18n.t('lbl_view_map')}
          </Text>
        </View>

        <View style={{ marginTop: 7, borderRadius: 10 }}>
          <MapView
            pointerEvents="none"
            provider={PROVIDER_GOOGLE}
            scrollEnabled={false}
            style={{ height: 180, borderRadius: 10 }}
            initialRegion={{
              latitude: overviewDetails.lat ? overviewDetails.lat : 24.466667,
              longitude: overviewDetails.lng ? overviewDetails.lng : 54.366669,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <MapView.Marker
              coordinate={{
                latitude: overviewDetails.lat ? overviewDetails.lat : 24.466667,
                longitude: overviewDetails.lng
                  ? overviewDetails.lng
                  : 54.366669,
              }}
              // title={'arrange'}
              image={globalImagePath.location_marker}
              description={'marker.description'}></MapView.Marker>
          </MapView>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontFamily: font.type.NunitoSans_bold,
              fontSize: 16,
              textAlign: 'left',
            }}>
            {I18n.t('lbl_working_hours')}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }}>
            <Text
              style={{
                marginRight: 5,
                fontFamily: font.type.NunitoSans_bold,
                fontSize: 14,
              }}>
              {I18n.t('lbl_today_hours')} :
            </Text>
            {openTime ? (
              <>
                <Text
                  style={{
                    color: 'lightgreen',
                    fontFamily: font.type.NunitoSans_bold,
                    fontSize: 14,
                  }}>
                  {I18n.t('lbl_open')}:
                </Text>
                <Text
                  style={{
                    marginHorizontal: 3,
                    fontFamily: font.type.NunitoSans_bold,
                    fontSize: 14,
                  }}>
                  {openTime}
                </Text>
                <Text
                  style={{
                    color: 'lightgreen',
                    fontFamily: font.type.NunitoSans_bold,
                    fontSize: 14,
                  }}>
                  {I18n.t('lbl_close')}:
                </Text>
                <Text
                  style={{
                    marginHorizontal: 3,
                    fontFamily: font.type.NunitoSans_bold,
                    fontSize: 14,
                  }}>
                  {closeTime}
                </Text>
              </>
            ) : (
              <Text
                style={{
                  marginHorizontal: 10,
                  fontFamily: font.type.NunitoSans_bold,
                  fontSize: 14,
                }}>
                {I18n.t('lbl_closed')}
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            marginBottom: 20,
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderColor: colors.themeColor,
            borderWidth: 0.5,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <FlatList
            data={salonWeek}
            renderItem={({ item, index }) => recommandSalon(item, index)}
            keyExtractor={(item, index) => String(index)}
          />
        </View>
      </View>
    </ScrollView>
  ) : null;
}
