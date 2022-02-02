import Permissions from 'react-native-permissions';
import {openSettings} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';

/************************ OPEN LOCATION SETTING PAGE ************************/

//This methid will navigate the user to setting page
export function openLocationSettings() {
  if (Platform.OS === 'ios') {
    Alert.alert(
      '',
      'Arrange app does not have access to your location. To enable access, tap Settings > Location',
      [
        {text: 'Not Now', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Settings', onPress: () => openSettings()},
      ],
      {cancelable: false},
    );
  }
}

/************************ OPEN IMAGE SETTING PAGE ************************/

//This methid will navigate the user to setting page
export function openImageSettings() {
  if (Platform.OS === 'ios') {
    Alert.alert(
      '',
      'Click Dubai app does not have access to your photos. To enable access, tap Settings > turn on Photos.',
      [
        {text: 'Not Now', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Settings', onPress: () => openSettings()},
      ],
      {cancelable: false},
    );
  }
}

export function openCameraSettings() {
  if (Platform.OS === 'ios') {
    Alert.alert(
      '',
      'Click Dubai app does not have access to your camera. To enable access, tap Settings > turn on camera.',
      [
        {text: 'Not Now', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Settings', onPress: () => openSettings()},
      ],
      {cancelable: false},
    );
  }
}

//This methid will navigate the user to setting page
export function openContactSettings() {
  if (Platform.OS === 'ios') {
    Alert.alert(
      '',
      'Click Dubai app does not have access to your Contacts. To enable access, tap Settings > turn on Contacts.',
      [
        {text: 'Not Now', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Settings', onPress: () => openSettings()},
      ],
      {cancelable: false},
    );
  }
}
