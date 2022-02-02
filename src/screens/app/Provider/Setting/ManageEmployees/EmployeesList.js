//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Container, Content} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {height, width} from '../../../../../constants/screenSize';
import {fonts, colors} from '../../../../../Theme';
// import { styles } from './styles';
import {globalImagePath} from '../../../../../constants/globalImagePath';
import font from '../../../../../Theme/font';
import Button from '../../../../../components/Button';
import I18n from '../../../../../I18n';
import NavBar from '../../../../../components/NavBar';
import {getService} from '../../../../../services/getServices';
import {postService} from '../../../../../services/postServices';
import Loader from '../../../../../components/Loader';
import {
  showToast,
  showDangerToast,
} from '../../../../../components/ToastMessage';
import {useIsFocused} from '@react-navigation/native';

// create a component
const EmployeeList = ({navigation}) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [userID, setUserID] = React.useState('');
  const [employees, setEmployees] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');

  React.useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      AsyncStorage.getItem('user', (err1, item1) => {
        var userDetail = JSON.parse(item1);
        setUserID(userDetail._id);
        setLoading(true);
        getEmployeeList(userDetail._id);
      });
    });
    return focusListener;
  }, [navigation]);

  //***** For getting salon employee */
  const getEmployeeList = (salonID) => {
    //***** api calling */
    getService('employee/employee-list/' + salonID)
      .then((res) => {
        console.log('employees list ==> ', res);
        if (res.data.status === 1) {
          setLoading(false);
          let data = res.data.response;
          setEmployees(data);
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

  const confirmDeleteAlert = (item, key) => {
    Alert.alert(
      `${I18n.t('lbl_delete_employee_alert')}`,
      '',
      [
        {
          text: `${I18n.t('lbl_cancel')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: `${I18n.t('lbl_ok')}`,
          onPress: () => deleteEmployee(item, key),
        },
      ],
      {cancelable: false},
    );
  };

  //***** For delete employee */
  const deleteEmployee = (item, key) => {
    setLoading(true);
    const id = item._id;
    //***** api calling */
    getService('employee/remove-employee/' + id)
      .then((res) => {
        // console.log("res.data =>", res.data);
        if (res.data.status === 1) {
          let data = [...employees];
          data.splice(key, 1);
          setEmployees(data);
          setLoading(false);
          showToast(res.data.message);
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
    let data = [...employees];
    data[key].animate = val;
    setEmployees(await data);
  };

  // Render recommand salon
  const _renderEmployee = (item, index) => {
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
              source={globalImagePath.user_dummy}
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
                {item.name}
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', marginBottom: 5}}>
              <Text style={{color: colors.darkShade, fontSize: 14}}>
                {item.email}
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
                  confirmDeleteAlert(item, index);
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
                  navigation.navigate('EditEmployee', {
                    employeeDetails: item,
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

  const _renderEmptyComponent = () => {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            marginTop: 100,
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {I18n.t('lbl_no_employee_found')}
        </Text>
      </View>
    );
  };

  const onRefresh = () => {
    setIsFetching(true);
    getSalonService();
  };

  return (
    <Container style={{flex: 1}}>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        title={I18n.t('lbl_employee_list')}
        isCenterImage={false}
        centerText={I18n.t('lbl_employee_list')}
        navigation="HomePage"
        titleTop={''}
      />
      <View
        style={{flex: 1, marginTop: 20, paddingHorizontal: width * (20 / 375)}}>
        <FlatList
          //onRefresh={() => onRefresh()}
          nestedScrollEnabled={true}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          data={employees}
          renderItem={({item, index}) => _renderEmployee(item, index)}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={() => _renderEmptyComponent()}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          paddingHorizontal: width * (20 / 375),
          left: 0,
          bottom: 20,
        }}>
        <Button
          label={I18n.t('lbl_add_new_employee')}
          textSize={16}
          onPress={() => navigation.navigate('AddEmployee')}
        />
      </View>
    </Container>
  );
};

// define your styles
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

//make this component available to the app
export default EmployeeList;
