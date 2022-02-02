import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator, Image } from "react-native";
import { colors, images, metrics } from '../Theme';

const width = metrics.screenWidth;
// import { normalize } from "./Dimensions";
const Loader = props => {
  const { loading } = props;

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={() => {
        // console.log("close modal");
      }}
    >
      <View style={styles.modalBackground}>
        <ActivityIndicator size="large" color={colors.whiteColor} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0, 0.4)"
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  }
});

export default Loader;
