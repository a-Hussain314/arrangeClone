//***** import libraries */
import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  TouchableOpacity,
  I18nManager
} from 'react-native';
import { CommonStyles } from '../assets/css/index';
import { globalImagePath } from '../constants/globalImagePath';
import ErrorMessage from '../components/ErrorMessage';
import RNPicker from '../components/RNPicker';
import { countries } from '../constants/countryCode';
//***** Common component for text input*/
export default function ({
  onChangeText,
  height,
  onBlur,
  onFocus,
  onEndEditing,
  secureTextEntry = false,
  placeholder = 'Submit',
  maxLength,
  editable = true,
  inputStyle = CommonStyles.TextInputStyle(14, height),
  value,
  isLevelShow = true,
  level = '',
  isShowMark = false,
  tooltipText = '',
  isPlaceHolder = false,
  keyboardType = 'default',
  showImage = false,
  onUpKeyPress = onUpKeyPress,
  onDownKeyPress = onDownKeyPress,
  error,
  type,
  showIcon = false,
  langVal = '+91',
  onSelect,
  picker = false,
  disablePicker = false,
  textAlignVertical = 'center'
}) {
  // console.log("langVal =>", langVal);
  return (
    <View>
      {isLevelShow ? (
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...CommonStyles.InputLabelStyle() }}>{level}</Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', borderColor: 'rgb(196,170,153)', borderBottomWidth: 0.5, }}>
        {picker ? <RNPicker
          dataSource={countries}
          dummyDataSource={countries}
          defaultValue={langVal != "" ? true : false}
          pickerTitle={'hello'}
          showSearchBar={true}
          searchBarPlaceHolder={'jjjjjj'}
          disablePicker={disablePicker ? true : countries.length > 0 ? false : true}
          changeAnimation={"none"}
          searchBarPlaceHolder={'Search for Country'}
          showPickerTitle={false}
          selectedLabel={langVal}
          placeHolderLabel={'adfas'}
          placeholderColor={'#4782c5'}
          selectedValue={(index, item) =>
            onSelect(item, index)
          }
          selectedId={countries}
          value={langVal}
        /> : null}
        <TextInput
          textAlignVertical={textAlignVertical}
          multiline={height == 100 ? true : false}
          textAlign={I18nManager.isRTL ? 'right' : 'left'}
          underlineColorAndroid="transparent"
          placeholder={isPlaceHolder ? `${placeholder}` : ''}
          secureTextEntry={secureTextEntry}
          style={inputStyle}
          maxLength={maxLength}
          editable={editable}
          placeholderTextColor="rgb(183,190,197)"
          value={value}
          onFocus={onFocus}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onEndEditing={onEndEditing}
          keyboardType={keyboardType}
        />
        {/* {showIcon ? <Image source={globalImagePath.checkIcon} resizeMode="cover" style={{ alignSelf: 'center' }} /> : null} */}
      </View>
      <ErrorMessage text={error} />
      {showImage ? (
        <View
          style={{
            position: 'absolute',
            marginTop: 30,
            marginLeft: '77%',
          }}>
          <TouchableOpacity
            onPress={() => onUpKeyPress(value, type)}
            style={{
              marginBottom: 5,
              padding: 5,
              paddingTop: 10,
              width: 30,
              height: 20,
            }}>
            <Image source={globalImagePath.chevronUP} style={{}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDownKeyPress(value, type)}
            style={{
              padding: 5,
              paddingTop: 0,
              width: 30,
              height: 20,
            }}>
            <Image source={globalImagePath.chevronDOWN} style={{}} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
