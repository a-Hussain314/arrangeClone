//***** import libraries */
import { showMessage } from "react-native-flash-message";
import { CommonStyles } from "../assets/css";

//***** Function for showing alert messages for 5 sec in whole app */
export function showToast(message, type = "success", btnText = "") {
  showMessage({
    position: "top",
    message: "Success",
    icon: "success",
    description: message,
    duration: 5000,
    type: type,
    backgroundColor: CommonStyles.THEME_COLOR,
    color: "#ffffff",
  });
}

//***** Function for showing long alert messages for 10 sec in whole app */
export function showToastLong(message, type = "success", btnText = "") {
  showMessage({
    position: "top",
    message: "Success",
    icon: "success",
    description: message,
    duration: 10000,
    type: type,
    // backgroundColor: "rgb(35,120,190)",
    backgroundColor: CommonStyles.THEME_COLOR,
    color: "#ffffff",
  });
}

//***** Function for showing danger(red) alert messages in whole app */
export function showDangerToast(message, type = "danger", btnText = "") {
  showMessage({
    position: "top",
    message: "Alert",
    icon: "danger",
    description: message,
    duration: 5000,
    type: type,
  });
}

//***** Function for showing long danger(red) alert messages in whole app */
export function showDangerToastLong(message, type = "danger", btnText = "") {
  showMessage({
    position: "top",
    message: "Alert",
    icon: "danger",
    description: message,
    duration: 20000,
    type: type,
    textStyle: {
      flex: 1,
      paddingRight: 15,
    },
  });
}
