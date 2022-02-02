//***** import libraries */
import React from 'react';
import { Text, View, TouchableOpacity, Keyboard } from 'react-native';
import Button from '../../../../components/Button';
import { Container, Content } from 'native-base';
import { postService } from '../../../../services/postServices';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import { colors, fonts, matrics } from '../../../../Theme';
import { height, width } from '../../../../constants/screenSize';
import { useIsFocused } from '@react-navigation/native';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import { showToast, showDangerToast } from '../../../../components//ToastMessage';
import validate from '../../../../components/Validations/validate_wrapper';
import TextInput from '../../../../components/TextInput';
import ErrorMessage from '../../../../components/ErrorMessage';
import Picker from 'react-native-picker';
import { TextInputMask } from 'react-native-masked-text';
export default function AddNewCard({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);
  const [cardName, setCardName] = React.useState('');
  const [cardNameError, setCardNameError] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardNumberError, setCardNumberError] = React.useState('');
  const [cardMonth, setCardMonth] = React.useState('');
  const [cardMonthError, setCardMonthError] = React.useState('');
  const [cardYear, setCardYear] = React.useState('');
  const [cardYearError, setCardYearError] = React.useState('');
  const [cardCVV, setCardCVV] = React.useState('');
  const [cardCVVError, setCardCVVError] = React.useState('');

  const [monthData, setMonthData] = React.useState('');
  const [yearData, setYearData] = React.useState('');

  React.useEffect(() => {
    let monData = [];
    let yearData = [];
    for (let month = 1; month <= 12; month++) {
      monData.push(month);
    }

    for (let year = new Date().getFullYear(); year <= 2050; year++) {
      yearData.push(year);
    }

    setMonthData(monData);
    setYearData(yearData);
  }, [isFocused]);

  const handleMonthPress = () => {
    Keyboard.dismiss();
    const pickerStyle = {
      pickerConfirmBtnColor: [255, 255, 255, 1],
      pickerBg: [255, 255, 255, 1],
      pickerToolBarBg: [196, 170, 153, 1],
      pickerTitleColor: [255, 255, 255, 1],
      pickerCancelBtnColor: [255, 255, 255, 1],
    };
    Picker.init({
      ...pickerStyle,
      pickerData: monthData,
      selectedValue: [`${cardMonth ? cardMonth : monthData[0]}`],
      pickerTextEllipsisLen: 25,
      pickerCancelBtnText: 'Cancel',
      pickerConfirmBtnText: 'Confirm',
      pickerTitleText: 'Select Month',
      onPickerConfirm: (data) => {
        setCardMonth(parseInt(data[0]));
        setCardMonthError(validate('card_month', data[0]));
      },
      onPickerCancel: (data) => { },
      onPickerSelect: (data) => { },
    });
    Picker.show();
  };

  const handleYearPress = () => {
    Keyboard.dismiss();
    const pickerStyle = {
      pickerConfirmBtnColor: [255, 255, 255, 1],
      pickerBg: [255, 255, 255, 1],
      pickerToolBarBg: [196, 170, 153, 1],
      pickerTitleColor: [255, 255, 255, 1],
      pickerCancelBtnColor: [255, 255, 255, 1],
    };
    Picker.init({
      ...pickerStyle,
      pickerData: yearData,
      selectedValue: [`${cardYear ? cardYear : yearData[0]}`],
      pickerTextEllipsisLen: 25,
      pickerCancelBtnText: 'Cancel',
      pickerConfirmBtnText: 'Confirm',
      pickerTitleText: 'Select Year',
      onPickerConfirm: (data) => {
        setCardYear(data[0]);
        setCardYearError(validate('card_year', data[0]));
      },
      onPickerCancel: (data) => { },
      onPickerSelect: (data) => { },
    });
    Picker.show();
  };

  const addCard = () => {
    const cardNumberError = validate('card_number', cardNumber);
    const cardNameError = validate('card_name', cardName);
    const monthError = validate('card_month', cardMonth);
    const yearError = validate('card_year', cardYear);
    const cvvError = validate('card_cvv', cardCVV);

    setCardNumberError(cardNumberError);
    setCardNameError(cardNameError);
    setCardMonthError(monthError);
    setCardYearError(yearError);
    setCardCVVError(cvvError);

    if (
      cardNumberError ||
      cardNameError ||
      monthError ||
      yearError ||
      cvvError
    ) {
    } else {
      setLoading(true);
      let data = {
        card_number: cardNumber.replace(/\s+/g, '').trim(),
        nameoncard: cardName,
        month: cardMonth,
        year: cardYear,
        cvv: cardCVV,
      };

      console.log("data =>", data);

      // ***** api calling */
      postService('usercards/addCard', data)
        .then(async (res) => {
          //  console.log("add card res ==> ", res);
          if (res.data.status === 1) {
            setLoading(false);
            showToast(res.data.message);
            navigation.goBack();
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
  };

  //***** For rendering UI */
  return (
    <Container>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={false}
        leftIcon={globalImagePath.back_icon}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        title={I18n.t('lbl_save_card')}
        isCenterImage={false}
        centerText={I18n.t('lbl_add_new_card')}
        navigation="HomePage"
        titleTop={''}
      />

      <Content
        enableResetScrollToCoords={false}
      //enableOnAndroid={true}
      >
        <View style={styles.container}>
          <TextInput
            isPlaceHolder={true}
            placeholder={I18n.t('lbl_enter_name_card')}
            isLevelShow={false}
            level={'Name on card'}
            error={cardNameError}
            maxLength={55}
            onFocus={() => Picker.hide()}
            onChangeText={(cardName) => {
              setCardName(cardName);
              setCardNameError(validate('card_name', cardName));
            }}
            value={cardName}
          />
          {/* <TextInput
            isPlaceHolder={true}
            placeholder={I18n.t('lbl_card_number')}
            isLevelShow={false}
            onFocus={() => Picker.hide()}
            level={'Card number'}
            keyboardType={'number-pad'}
            error={cardNumberError}
            maxLength={19}
            onChangeText={(cardNumber) => {
              setCardNumber(cardNumber);
              setCardNumberError(validate('card_number', cardNumber));
            }}
            value={cardNumber}
          /> */}
          <View style={{ borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5, marginBottom: 10, marginTop: -10 }}>
            <TextInputMask
              type={'credit-card'}
              placeholder={I18n.t('lbl_card_number')}
              onChangeText={cardNumber => {
                setCardNumber(cardNumber);
                setCardNumberError(validate("card_number", cardNumber))
              }}
              value={cardNumber}
            />
          </View>
          {cardNumber.length != 19 ? (
            <ErrorMessage text={cardNumberError} />
          ) : null}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ width: '48%' }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  borderBottomColor: 'rgba(196,170,153,0.5)',
                  borderBottomWidth: 1,
                  marginTop: 0,
                  //marginBottom: 10,
                  paddingHorizontal: 0,
                  height: 50,
                }}
                onPress={() => {
                  handleMonthPress();
                }}>
                {cardMonth ? (
                  <Text
                    style={{
                      fontFamily: fonts.type.NunitoSans_Regular,
                      color: '#000000',
                    }}>{`${cardMonth}`}</Text>
                ) : (
                    <Text
                      style={{
                        fontFamily: fonts.type.NunitoSans_Regular,
                        color: 'rgb(183,190,197)',
                        fontSize: 14,
                      }}>{`${I18n.t('lbl_expiry_month')}`}</Text>
                  )}
              </TouchableOpacity>
              {cardMonthError.length > 0 && (
                <ErrorMessage text={cardMonthError} />
              )}
            </View>
            <View style={{ width: '48%' }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  borderBottomColor: 'rgba(196,170,153,0.5)',
                  borderBottomWidth: 1,
                  marginTop: 0,
                  //marginBottom: 10,
                  paddingHorizontal: 0,
                  height: 50,
                }}
                onPress={() => handleYearPress()}>
                {cardYear ? (
                  <Text
                    style={{
                      fontFamily: fonts.type.NunitoSans_Regular,
                      color: '#000000',
                    }}>{`${cardYear}`}</Text>
                ) : (
                    <Text
                      style={{
                        fontFamily: fonts.type.NunitoSans_Regular,
                        color: 'rgb(183,190,197)',
                        fontSize: 14,
                      }}>{`${I18n.t('lbl_expiry_year')}`}</Text>
                  )}
              </TouchableOpacity>
              {cardYearError.length > 0 && (
                <ErrorMessage text={cardYearError} />
              )}
            </View>
          </View>
          <TextInput
            isPlaceHolder={true}
            placeholder={I18n.t('lbl_enter_cvv')}
            isLevelShow={false}
            level={'Card CVV'}
            onFocus={() => Picker.hide()}
            secureTextEntry={true}
            keyboardType={'number-pad'}
            error={cardCVVError}
            maxLength={3}
            onChangeText={(cardCVV) => {
              setCardCVV(cardCVV);
              setCardCVVError(validate('card_cvv', cardCVV));
            }}
            value={cardCVV}
          />
          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Button
              label={I18n.t('lbl_add')}
              textSize={16}
              onPress={() => {
                addCard();
              }}
            />
          </View>
        </View>
      </Content>
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
