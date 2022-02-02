//***** import libraries */
import React from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Button from '../../../../components/Button';
import { Container, Content } from 'native-base';
import { postService } from '../../../../services/postServices';
import { getService } from '../../../../services/getServices';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import { colors, fonts, matrics } from '../../../../Theme';
import { height, width } from '../../../../constants/screenSize';
import { useIsFocused } from '@react-navigation/native';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import { showToast, showDangerToast } from '../../../../components//ToastMessage';

var pageNo = 1;
export default function SaveCard({ navigation }) {
  let onEndReachedCalledDuringMomentum = true;
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showLoadMore, setShowLoadMore] = React.useState(false);
  const [cardList, setCardList] = React.useState([]);

  React.useEffect(() => {
    pageNo = 1;
    if (isFocused) {
      setLoading(true);
      getCardList();
    }
  }, [isFocused]);

  const getCardList = () => {
    const postData = {
      page: pageNo,
    };
    //***** api calling */
    postService('usercards', postData)
      .then(async (res) => {
        setLoading(false);
        setRefreshing(false);
        setShowLoadMore(false);
        // console.log('usercards res ==> ', res);
        if (res.data.status === 1) {
          let data = res.data.response;

          if (pageNo == 1) {
            setCardList([...data.card_list]);
          } else {
            data && data.card_list
              ? setCardList([...cardList, ...data.card_list])
              : setCardList([...cardList]);
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
          showDangerToast(error);
        }, 100);
      });
  };

  const makeCardDefault = (item, index) => {
    setLoading(true);

    //***** api calling */
    getService(`usercards/${item._id}`, {})
      .then(async (res) => {
        setLoading(false);

        //console.log('default res ==> ', res);
        if (res.data.status === 1) {
          let cardArr = [...cardList];
          cardArr.map((itm, key) => {
            if (key == index) {
              itm.isdefault = 1;
            } else {
              itm.isdefault = 0;
            }
          });

          setCardList(await cardArr);
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
          showDangerToast(error);
        }, 100);
      });
  };

  const showDangerAlert = () => {
    showDangerToast(
      I18n.t('lbl_cant_delete_card'),
    );
  };

  const deleteCardAlert = (item, index) => {
    Alert.alert(
      I18n.t('lbl_alert_title'),
      '',
      [
        {
          text: `${I18n.t('lbl_cancel')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: `${I18n.t('lbl_ok')}`,
          onPress: () => deleteCard(item, index),
        },
      ],
      { cancelable: false },
    );
  };

  const deleteCard = (item, index) => {
    setLoading(true);

    const postData = {
      _id: item._id,
    };
    //***** api calling */
    postService('usercards/remove', postData)
      .then(async (res) => {
        setLoading(false);
        // console.log('usercards res ==> ', res);
        if (res.data.status === 1) {
          const cardArr = [...cardList];
          cardArr.splice(index, 1);
          setCardList(cardArr);
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
          showDangerToast(error);
        }, 100);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    pageNo = 1;
    getCardList();
  };

  const onReached = () => {
    setRefreshing(true);
    setShowLoadMore(true);
    pageNo = parseInt(pageNo) + 1;
    getCardList();
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
          {I18n.t('lbl_no_card')}
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
            <ActivityIndicator color="rgb(74,74,74)" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const _cardList = (item, index) => {
    return (
      <View style={styles.renderOuterView}>
        <View style={styles.sectionOneOuter}>
          <View>
            <Image source={globalImagePath.visa} resizeMode={'contain'}></Image>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{item.card_number}</Text>
            <Text style={styles.subTitle}>{item.nameoncard}</Text>
          </View>
          {item.isdefault == 1 ? (
            <View>
              <TouchableOpacity style={styles.defaultOuter}>
                <Text style={styles.default_text}>{I18n.t('lbl_default')}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          {/* <TouchableOpacity style={styles.editOuter}>
            <Text style={styles.btnText2}>{I18n.t('lbl_edit')}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() =>
              item.isdefault == 1
                ? showDangerAlert()
                : deleteCardAlert(item, index)
            }>
            <Text style={styles.btnText}>{I18n.t('lbl_delete')}</Text>
          </TouchableOpacity>
          {item.isdefault != 1 ? (
            <TouchableOpacity
              style={styles.makeDefaultBtn}
              onPress={() => makeCardDefault(item, index)}>
              <Text style={styles.btnText2}>{I18n.t('lbl_make_default')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  //***** For rendering UI */
  return (
    <Container style={{ flex: 1 }}>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        title={I18n.t('lbl_save_card')}
        isCenterImage={false}
        centerText={I18n.t('lbl_save_card')}
        navigation="HomePage"
        titleTop={''}
      />
      <View style={{ flex: 1, marginTop: 20, paddingHorizontal: width * (20 / 375), }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={cardList}
          renderItem={({ item, index }) => _cardList(item, index)}
          keyExtractor={(item, index) => String(index)}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
          onEndReached={({ distanceFromEnd }) => {
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
      <View style={{
        position: 'absolute',
        width: '100%',
        paddingHorizontal: width * (20 / 375),
        left: 0,
        bottom: 20
      }}
      >
        <Button
          label={I18n.t('lbl_add_new_card')}
          textSize={16}
          onPress={() => navigation.navigate('AddNewCard')}
        />
      </View>
    </Container>
  );
}

//***** Define style */
const styles = {
  container: {
    paddingHorizontal: width * (20 / 375),
  },
  renderOuterView: {
    paddingHorizontal: width * (15 / 375),
    marginBottom: width * (10 / 375),
    borderRadius: 5,
    backgroundColor: colors.moreLight,
    padding: width * (10 / 375),
  },
  sectionOneOuter: {
    flexDirection: 'row',
  },
  itemTitle: {
    fontFamily: fonts.type.NunitoSans_bold,
    fontSize: width * (12 / 375),
  },
  defaultOuter: {
    paddingHorizontal: width * (10 / 375),
    paddingVertical: width * (3 / 375),
    borderRadius: 3,
    backgroundColor: colors.lightThemeColor,
  },
  default_text: {
    color: '#fff',
    fontFamily: fonts.type.NunitoSans_Regular,
    fontSize: width * (10 / 375),
  },
  btnText: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (12 / 375),
  },
  btnText2: {
    fontFamily: fonts.type.NunitoSans_SemiBold,
    fontSize: width * (12 / 375),
    color: colors.whiteColor,
  },
  editOuter: {
    borderRadius: 5,
    backgroundColor: colors.themeColor,
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: colors.themeColor,
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  makeDefaultBtn: {
    borderRadius: 5,
    backgroundColor: colors.themeColor,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  subTitle: {
    fontSize: 12,
    color: colors.darkShade,
    //fontFamily: font.type.OpenSans_Regular
  },
};
