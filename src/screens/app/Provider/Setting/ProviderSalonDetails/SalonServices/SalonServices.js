import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {height, width} from '../../../../../../constants/screenSize';
import {fonts, colors} from '../../../../../../Theme';
// import { styles } from './styles';
import {globalImagePath} from '../../../../../../constants/globalImagePath';
import font from '../../../../../../Theme/font';
import Button from '../../../../../../components/Button';
import I18n from '../../../../../../I18n';
import {getService} from '../../../../../../services/getServices';
import {postService} from '../../../../../../services/postServices';
import Loader from '../../../../../../components/Loader';
import {
  showToast,
  showDangerToast,
} from '../../../../../../components/ToastMessage';
import {useIsFocused} from '@react-navigation/native';

export default function SalonServices({navigation, props}) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  React.useEffect(() => {
    getSalonService();
  }, [isFocused]);

  //***** For getting salon service */
  const getSalonService = () => {
    setLoading(true);
    //***** api calling */
    getService('salon/salonServices')
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);
          // console.log("services res ==> ", res.data.response.image_url);
          let data = res.data.response.records;
          setImageUrl(res.data.response.image_url);
          setServices(data);
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
  };
  //***** For delete salon service */
  const deleteSalonService = (item) => {
    setLoading(true);
    const data = {
      _id: item._id,
    };
    console.log('data =>', data);
    //***** api calling */
    postService('salon/delete-service', data) //salon/delete-service
      .then((res) => {
        // console.log("res.data =>", res.data);
        if (res.data.status === 1) {
          setLoading(false);
          getSalonService();
          showToast(res.data.message);

          // setServices(data);
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
  };

  const animationShow = async (key, val) => {
    let data = [...services];
    data[key].animate = val;
    setServices(await data);
  };

  // Render recommand salon
  const recommandSalon = (item, index) => {
    return (
      <View style={styles.renderOuterView}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            flexDirection: 'row',
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}>
          <View style={{justifyContent: 'center'}}>
            <Image
              source={
                item.image
                  ? {uri: imageUrl + item.image}
                  : globalImagePath.user_dummy
              }
              style={styles.image}
              resizeMode={'cover'}
              onLoadStart={() => animationShow(index, true)}
              onLoad={() => animationShow(index, false)}
            />
            {item.animate ? (
              <ActivityIndicator
                style={{position: 'absolute', marginLeft: width * (30 / 375)}}
                size="small"
                color={'rgb(196,170,153)'}
                animating={item.animate}
              />
            ) : null}
          </View>
          <View style={{flex: 1, marginLeft: 20}}>
            <View style={{flex: 1, marginVertical: 4}}>
              <Text style={{fontWeight: 'bold', color: '#000', fontSize: 12}}>
                {item.salon_service}
              </Text>
              <Text
                style={{marginTop: 5, color: colors.darkShade, fontSize: 14}}>
                {'SAR ' + item.price}
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', marginBottom: 5}}>
              <Text style={{fontWeight: 'bold', color: '#000', fontSize: 12}}>
                {'Service Type : '}
              </Text>
              <Text style={{color: colors.darkShade, fontSize: 14}}>
                {item.service_type}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                alignSelf: 'flex-start',
              }}>
              <TouchableOpacity
                onPress={() => {
                  deleteSalonService(item);
                }}
                style={{
                  right: 10,
                  borderRadius: 5,
                  paddingHorizontal: 8,
                  paddingVertical: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  flexDirection: 'row',
                  borderWidth: 0.8,
                  borderColor: colors.themeColor,
                }}>
                <View style={{marginLeft: 5}}>
                  <Text style={{color: colors.darkShade, fontSize: 14}}>
                    {I18n.t('lbl_delete')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddService', {
                    serviceDetails: item,
                  });
                }}
                style={{
                  borderRadius: 5,
                  paddingHorizontal: 8,
                  paddingVertical: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  flexDirection: 'row',
                  borderWidth: 0.8,
                  borderColor: colors.themeColor,
                }}>
                <View style={{marginLeft: 5}}>
                  <Text style={{color: colors.darkShade, fontSize: 14}}>
                    {I18n.t('lbl_edit')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = () => {
    setIsFetching(true);
    getSalonService();
  };

  const emptyComponent = () => {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            marginTop: 100,
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {I18n.t('lbl_no_service')}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        marginHorizontal: width * (20 / 375),
        // backgroundColor: 'red',
      }}>
      <Loader loading={loading} />
      <View style={{marginTop: 20}}>
        <FlatList
          inverted={true}
          onRefresh={() => onRefresh()}
          nestedScrollEnabled={true}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          data={services}
          renderItem={({item, index}) => recommandSalon(item, index)}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={emptyComponent()}
        />
      </View>
      <View style={{marginTop: 20, marginBottom: 10}}>
        <Button
          label={I18n.t('lbl_add_service')}
          textSize={16}
          onPress={() => {
            navigation.navigate('AddService');
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  renderOuterView: {
    //flexDirection: 'row',
    marginTop: width * (10 / 375),
    padding: 2,
    borderRadius: 15,
    backgroundColor: Platform.OS == 'ios' ? 'transparent' : '#efefef',
    elevation: 1,
    shadowColor: '#aaaaaa',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
  },
  image: {
    // borderWidth: 5,
    height: width * (88 / 375),
    width: width * (88 / 375),
    borderRadius: 10,
  },
  addimage: {
    // borderWidth: 5,
    height: width * (11 / 375),
    width: width * (11 / 375),
    borderRadius: 10,
  },
});
