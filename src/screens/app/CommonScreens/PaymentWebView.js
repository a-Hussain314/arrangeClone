//***** import libraries */
import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Container, Content} from 'native-base';
import I18n from '../../../I18n';
import NavBar from '../../../components/NavBar';
import Loader from '../../../components/Loader';
import {globalImagePath} from '../../../constants/globalImagePath';
// import AutoHeightWebView from "../../../components/autoheight_webview/autoHeightWebView";
import {postService} from '../../../services/postServices';
import {WebView} from 'react-native-webview';
import AutoHeightWebView from '../../../components/autoheight_webview/autoHeightWebView';

export default function PaymentWebView({navigation, route}) {
  const [loading, setLoading] = React.useState(false);
  const [termCondition, setTermCondition] = React.useState('');
  const [canGoBack, setCanGoBack] = React.useState('');
  React.useEffect(() => {
    console.log('route =>', route.params.webUrl);
  }, []);

  const getTermCondition = () => {
    setLoading(true);
    const data = {
      slug: 'term-and-condition',
    };
    console.log('data =>', data);
    // //***** api calling */
    postService('cms', data)
      .then(async (res) => {
        setLoading(false);

        if (res.data.response.status == 1) {
          try {
            setTermCondition(res.data.response.content_ar);
          } catch (e) {
            showDangerToast(e);
            setLoading(false);
          }
        } else if (res.data.response.status == 2) {
          setAboutData('Content Not Available');
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

  const _onNavigationStateChange = (webViewState) => {
    // console.log("webViewState", webViewState);
    setCanGoBack(webViewState.canGoBack);
    var staticUrl =
      'https://35.208.113.133:17345/webservice/web-view/backtoapp';
    if (webViewState.url == staticUrl) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Bookings',
          },
        ],
      });
    }
  };

  console.log('canGoBack =>>>', canGoBack);
  //***** For rendering UI */
  return (
    <Container>
      <Loader loading={loading} />
      <NavBar
        textColor={'black'}
        isLeftIconUrl={!canGoBack ? false : true}
        leftIcon={!canGoBack ? globalImagePath.back_icon : ''}
        navigator={navigation}
        backgroundColor={'#ffffff'}
        title={'Payment'}
        isCenterImage={false}
        centerText={'Payment'}
        navigation="HomePage"
        titleTop={''}
      />

      <View style={styles.container}>
        <AutoHeightWebView
          startInLoadingState={true}
          style={{
            width: Dimensions.get('window').width - 40,
            marginTop: 16,
            marginLeft: 20,
          }}
          onNavigationStateChange={(val) => _onNavigationStateChange(val)}
          source={{uri: route.params.webUrl}}
          zoomable={false}
        />
      </View>
    </Container>
  );
}

//***** Define style */
const styles = {
  container: {
    flex: 1,
    height: 350,
  },
};
