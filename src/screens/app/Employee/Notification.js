import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {globalImagePath} from '../../../constants/globalImagePath';
import {Container, Content} from 'native-base';
import {normalize} from '../../../components/Dimensions';
import NavBar from '../../../components/NavBar';
import Loader from '../../../components/Loader';
import {fonts, colors, metrics} from '../../../Theme';
import {postService} from '../../../services/postServices';
import {showToast, showDangerToast} from '../../../components/ToastMessage';
import {useIsFocused} from '@react-navigation/native';
import I18n from '../../../I18n';
const height = metrics.screenHeight;
const width = metrics.screenWidth;

var pageNo = 1;
export default function Notification({navigation}) {
  let onEndReachedCalledDuringMomentum = true;
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showLoadMore, setShowLoadMore] = React.useState(false);
  const [notificationList, setNotificationList] = React.useState([]);
  // const [notificationList, setNotificationList] = React.useState([
  //     { title: 'Your order successfully placed', img: globalImagePath.dummyUserIcon, },
  //     { title: 'Request Accepted', img: globalImagePath.changePass, },
  //     { title: 'Your order successfully placed', img: globalImagePath.address, },
  //     { title: 'Your order successfully placed', img: globalImagePath.card, },
  //     { title: 'Your order successfully placed', img: globalImagePath.Wallet, },
  //     { title: 'Your order successfully placed', img: globalImagePath.bookings, },
  //     { title: 'Your order successfully placed', img: globalImagePath.ratting, },
  //     { title: 'Your order successfully placed', img: globalImagePath.support, },
  //     { title: 'Your order successfully placed', img: globalImagePath.information, },
  //     { title: 'Your order successfully placed', img: globalImagePath.logout, },
  // ]);

  React.useEffect(() => {
    pageNo = 1;
    if (isFocused) {
      setLoading(true);
      getNotifications();
    }
  }, [isFocused]);

  const getNotifications = () => {
    const data = {
      page: pageNo,
    };
    //***** api calling */
    postService('profile/notifications', data)
      .then((res) => {
        if (res.data.status === 1) {
          console.log('profile/notification ==> ', res.data.response);
          setLoading(false);
          setRefreshing(false);
          setShowLoadMore(false);
          global.notifyCount = 0;
          let data = res.data.response;
          if (pageNo == 1) {
            setNotificationList([...data.list]);
          } else {
            data && data.list
              ? setNotificationList([...notificationList, ...data.list])
              : setNotificationList([...notificationList]);
          }
        } else {
          setLoading(false);
          setRefreshing(false);
          setShowLoadMore(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        setShowLoadMore(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };

  const _renderEmptyComponent = (type) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text
          style={{
            marginTop: 100,
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {I18n.t('lbl_notification_not_found')}
        </Text>
      </View>
    );
  };

  const _renderFooter = () => {
    if (!refreshing) return null;
    if (!showLoadMore) return null;

    return (
      <View
        style={{
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            padding: 10,
            borderRadius: 4,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              fontFamily: fonts.type.NunitoSans_Regular,
              textAlign: 'center',
            }}>
            {I18n.t('lbl_load_more')}
          </Text>
          {true ? (
            <ActivityIndicator color="rgb(74,74,74)" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const _notificationList = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={{
          marginBottom: 10,
          borderRadius: 10,
          borderColor: 'rgba(0,0,0, 0.2)',
          borderBottomColor: colors.themeColor,
          padding: 10,
          borderWidth: 0.5,
          paddingHorizontal: 20,
          flexDirection: 'row',
        }}>
        <View style={{}}>
          <Image
            source={globalImagePath.card}
            style={{width: normalize(38), height: normalize(38)}}
          />
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: '#000',
              fontSize: normalize(14),
              fontFamily: fonts.type.NunitoSans_bold,
              left: 20,
            }}>
            {item.description}
          </Text>
          <Text
            style={{
              color: colors.themeColor,
              fontSize: normalize(10),
              fontFamily: fonts.type.NunitoSans_Regular,
              left: 20,
            }}>
            {item.created}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    pageNo = 1;
    getNotifications();
  };

  const onReached = () => {
    setRefreshing(true);
    setShowLoadMore(true);
    pageNo = parseInt(pageNo) + 1;
    getNotifications();
  };

  return (
    <Container>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={colors.white}
        titleTop={''}
        // centerImg={''}
        //rightImage={globalImagePath.notification}
        navigation="HomePage"
        centerText={I18n.t('lbl_notification')}
        _rightNavigation={'Notifications'}
        //centerText={I18n.t('lbl_myAccount')}
      />
      <View style={{flex: 1, marginHorizontal: 16}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notificationList}
          renderItem={({item, index}) => _notificationList(item, index)}
          keyExtractor={(item, index) => String(index)}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
          onEndReached={({distanceFromEnd}) => {
            if (!onEndReachedCalledDuringMomentum) {
              onReached();
              onEndReachedCalledDuringMomentum = true;
            }
          }}
          onEndReachedThreshold={0.005}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          ListFooterComponent={() => _renderFooter()}
          ListEmptyComponent={() => _renderEmptyComponent()}
        />
      </View>
    </Container>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
};
