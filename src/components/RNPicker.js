import React, { Component } from "react";
import { View } from "native-base";
import RNPicker from "rn-modal-picker";
import { colors } from "../Theme";
import { globalImagePath } from '../constants/globalImagePath';
//var Lables = "";
export default function DropDown({
  dataSource,
  dummyDataSource,
  defaultValue = false,
  pickerTitle,
  showSearchBar = true,
  disablePicker = false,
  changeAnimation = "none",
  searchBarPlaceHolder,
  showPickerTitle = true,
  selectedLabel,
  placeHolderLabel,
  selectedValue,
  placeholderColor,
  selectedId = false,
  ifCountry = false,
  showIcon = true,
  timeSlot = ''
}) {

  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",

        }}
      >

      </View>
      <RNPicker
        slotType={timeSlot}
        placeholderColor={placeholderColor}
        dataSource={dataSource}
        dummyDataSource={dummyDataSource}
        defaultValue={defaultValue}
        pickerTitle={pickerTitle}
        showSearchBar={showSearchBar}
        disablePicker={disablePicker}
        changeAnimation={changeAnimation}
        searchBarPlaceHolder={searchBarPlaceHolder}
        showPickerTitle={showPickerTitle}
        searchBarContainerStyle={ifCountry ? Styles.searchBarContainerStyle_2 : Styles.searchBarContainerStyle}
        pickerStyle={ifCountry ? Styles.pickerStyle_2 : Styles.pickerStyle}
        pickerItemTextStyle={ifCountry ? Styles.listTextViewStyle_2 : Styles.listTextViewStyle}
        selectedLabel={selectedLabel}
        placeHolderLabel={placeHolderLabel}
        selectLabelTextStyle={ifCountry ? Styles.selectLabelTextStyle_2 : Styles.selectLabelTextStyle}
        placeHolderTextStyle={ifCountry ? Styles.placeHolderTextStyle_2 : Styles.placeHolderTextStyle}
        dropDownImageStyle={ifCountry ? !showIcon ? Styles.dropDownTimeSlot : Styles.dropDownImageStyle_2 : Styles.dropDownImageStyle}
        selectedId={selectedId}
        dropDownImage={showIcon ? globalImagePath.modal_dropDown_img : ''}
        selectedValue={selectedValue}

      />
    </View>
  );
}
const Styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },

  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: "row",
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1
    },
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,

  },

  selectLabelTextStyle: {
    color: colors.themeColor,
    // padding: 8,
    textAlign: "left",
    //  width: "70%",
    flexDirection: "row",
    alignSelf: "center",
    //borderWidth: 1

  },
  placeHolderTextStyle: {
    color: '#4782c5',
    padding: 10,
    textAlign: "left",
    // width: "90%",
    flexDirection: "row",
    alignSelf: "center",
    borderWidth: 1
  },
  dropDownImageStyle: {
    //marginRight: 5,
    width: 30,
    height: 8,
    alignSelf: "center",

  },
  listTextViewStyle: {
    color: colors.themeColor,
    marginVertical: 2,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left",
    fontWeight: 'bold',

  },
  pickerStyle: {
    width: "65%",
    marginTop: 20,

    // height: 50,
    //  marginRight: 15,
    //  marginLeft: 10,
    //marginBottom: 10,
    //  borderWidth: 1,
    //  shadowRadius: 10,
    // backgroundColor: "rgba(255,255,255,1)",
    // borderRadius: 5,
    //   borderColor: "#cdcdcd",
    flexDirection: "row",
    //  justifyContent: "space-between",

  },

  searchBarContainerStyle_2: {
    marginBottom: 10,
    flexDirection: "row",
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1
    },
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,

  },

  selectLabelTextStyle_2: {
    color: '#000',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    textAlign: "left",
    width: "90%",
    flexDirection: "row",
    alignSelf: "center",

  },
  placeHolderTextStyle_2: {
    color: '',
    paddingVertical: 10,
    textAlign: "left",
    width: "90%",
    flexDirection: "row",
    alignSelf: "center",
  },
  dropDownImageStyle_2: {
    marginRight: 15,
    width: 16,
    height: 8,
    alignSelf: "center",

  },
  dropDownTimeSlot: {

    width: 16,
    height: 8,
    alignSelf: "center",

  },
  listTextViewStyle_2: {
    color: colors.themeColor,
    marginVertical: 2,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left",
    fontWeight: 'bold',
  },
  pickerStyle_2: {
    width: "100%",
    // height: 50,
    // marginRight: 15,
    // marginLeft: 10,
    // marginBottom: 10,
    // borderWidth: 1,
    // shadowRadius: 10,
    //backgroundColor: "rgba(255,255,255,1)",
    // borderRadius: 5,
    // borderColor: "#cdcdcd",
    flexDirection: "row",
    justifyContent: "space-between",
  }
};
