import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { height, width } from '../../../../../constants/screenSize';
import { fonts, colors } from '../../../../../Theme';
//import { styles } from './styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import font from '../../../../../Theme/font';
import I18n from '../../../../../I18n';
import { globalImagePath } from '../../../../../constants/globalImagePath';
import Loader from '../../../../../components/Loader';
import { getService } from '../../../../../services/getServices';
import {
  showToast,
  showDangerToast,
} from '../../../../../components/ToastMessage';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

export default function SearchOverView({ navigation, salonId }) {
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
  const [loading, setLoading] = React.useState(false);
  const [openTime, setOpenTime] = React.useState('');
  const [closeTime, setCloseTime] = React.useState('');
  const [overviewDetails, setSalonOverviewDetails] = React.useState('');
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  React.useEffect(() => {
    if (salonId) {
      isFocused ? getSalonDetails(salonId) : null;
    }
  }, [isFocused]);

  function getSalonDetails(salon_id) {
    setLoading(true);
    //***** api calling */
    getService(`salonlist/salonById/${salon_id}`)
      .then(async (res) => {
        setLoading(false);

        if (res.data.status === 1) {
          setLoading(false);
          let data = res.data.response;
          console.log(' salon overview ==> ', data);
          var latlngData = {
            latitude: data.lat != "" ? data.lat : 37.78825,
            longitude: data.lng != "" ? data.lng : -122.4324,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }
          setRegion(latlngData);

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
              time: item.open
                ? item.open + '-' + item.close
                : 'Close',
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
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <View style={{ flex: 0.4, flexDirection: 'row' }}>
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
          <Text>{':'}</Text>
        </View>
        <View style={{ right: -20, flex: 0.6, alignItems: 'flex-start' }}>
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
              {item.time}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const onRegionChange = (region) => {
    this.setState({ region });
  };

  const _goToMap = () => {
    navigation.navigate('MapScreen', {
      overviewDetails: overviewDetails
    });
  }


  return (
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
          <Text style={{ fontFamily: font.type.NunitoSans_bold, fontSize: 16 }}>
            {I18n.t('lbl_address')}
          </Text>
          <Text
            style={{
              color: colors.themeColor,
              // fontFamily: font.type.OpenSans_Regular,
              fontSize: 12,
            }}>
            {overviewDetails.address}
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          {overviewDetails.latitude && (
            <Text style={{ fontFamily: font.type.NunitoSans_bold, fontSize: 16 }}>
              {I18n.t('lbl_view_map')}
            </Text>
          )}
        </View>

        <View style={{ marginTop: 7, borderRadius: 10 }}>

          <MapView
            //  pointerEvents="none"
            clustering={true}
            scrollEnabled={true}
            provider={PROVIDER_GOOGLE}
            style={{ height: 180, borderRadius: 10 }}
            initialRegion={{
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}>
            <MapView.Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              // title={'arrange'}
              onPress={() => _goToMap()}
              image={globalImagePath.location_marker}
              description={''}></MapView.Marker>
          </MapView>

        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: font.type.NunitoSans_bold, fontSize: 16 }}>
            {'Salon Descriptions'}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text
              style={{
                color: colors.themeColor,
                fontFamily: font.type.NunitoSans_bold,
                fontSize: 14,
              }}>
              {'Cancellation Charge : '}
            </Text>
            <View style={{ justifyContent: 'center' }}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontFamily: font.type.NunitoSans_SemiBold,
                  fontSize: 12,
                  marginTop: 2,

                }}>
                {overviewDetails && overviewDetails.cancellation + '%'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text
              style={{
                color: colors.themeColor,
                fontFamily: font.type.NunitoSans_bold,
                fontSize: 14,
              }}>
              {'Description : '}
            </Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontFamily: font.type.NunitoSans_SemiBold,
                  fontSize: 12,
                  marginTop: 2,
                  flexWrap: 'wrap',

                }}>
                {overviewDetails && overviewDetails.description}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text
              style={{
                color: colors.themeColor,
                fontFamily: font.type.NunitoSans_bold,
                fontSize: 14,
              }}>
              {'Contact number : '}
            </Text>
            <View style={{ justifyContent: 'center' }}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontFamily: font.type.NunitoSans_SemiBold,
                  fontSize: 12,
                  marginTop: 2
                }}>
                {overviewDetails.country_code + '-'}{overviewDetails.phoneno}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text
              style={{
                color: colors.themeColor,
                fontFamily: font.type.NunitoSans_bold,
                fontSize: 14,
              }}>
              {'Email : '}
            </Text>
            <View style={{ justifyContent: 'center' }}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontFamily: font.type.NunitoSans_SemiBold,
                  fontSize: 12,

                }}>
                {overviewDetails.email}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: font.type.NunitoSans_bold, fontSize: 16 }}>
            {I18n.t('lbl_working_hours')}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{
                marginRight: 5,
                fontFamily: font.type.NunitoSans_bold,
                fontSize: 14,
              }}>
              {I18n.t('lbl_today_hours')} :{' '}
            </Text>
            {openTime ? (
              <>
                <Text
                  style={{
                    color: 'lightgreen',
                    fontFamily: font.type.NunitoSans_bold,
                    fontSize: 13,
                  }}>
                  {I18n.t('lbl_open')} :
                </Text>
                <Text
                  style={{
                    marginHorizontal: 10,
                    fontFamily: font.type.NunitoSans_bold,
                    fontSize: 13,
                  }}>
                  {openTime}
                </Text>
                <Text
                  style={{
                    color: 'lightgreen',
                    fontFamily: font.type.NunitoSans_bold,
                    fontSize: 13,
                  }}>
                  {I18n.t('lbl_close')}
                </Text>
                <Text
                  style={{
                    marginHorizontal: 10,
                    fontFamily: font.type.NunitoSans_bold,
                    fontSize: 13,
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
  );
}
