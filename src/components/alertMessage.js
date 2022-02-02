import {showMessage} from 'react-native-flash-message';
import {CommonStyles} from '../assets/css';

/************************ SHOW TOAST MESSAGE ************************/

export default function showToast12(message, type = 1) {
  if (type == 1) {
    showMessage({
      position: 'bottom',
      message: 'Success',
      icon: 'success',
      description: message,
      type: 'success',
      backgroundColor: CommonStyles.THEME_COLOR, // background color
      color: '#606060', // text color
    });
  } else {
    showMessage({
      position: 'bottom',
      message: 'Alert',
      icon: 'danger',
      description: message,
      type: 'danger',
    });
  }
}
