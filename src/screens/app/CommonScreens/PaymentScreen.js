//***** import libraries */
import React from 'react';
import { Text, View, NativeMethod, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content } from 'native-base';
import I18n from '../../../I18n';
import NavBar from '../../../components/NavBar';
import Loader from '../../../components/Loader';
import { globalImagePath } from '../../../constants/globalImagePath';
import { WebView } from 'react-native-webview';
import AutoHeightWebView from "../../../components/autoheight_webview/autoHeightWebView";
import { postService } from '../../../services/postServices';
import { TouchableOpacity } from 'react-native';
import { showToast, showDangerToast } from '../../../components//ToastMessage';

export default function PaymentScreen({ navigation, route }) {
    const [loading, setLoading] = React.useState(false);
    const [checkOutId, setCheckOutId] = React.useState('');
    const { NativeMethodModule } = NativeModules;
    React.useEffect(() => {

        if (route.params.checkOutDetails) {
            var id = route.params.checkOutDetails.id
            setCheckOutId(id)
        }
    }, []);

    const requestHyperPay = () => {

        let data = { checkoutId: checkOutId }

        setTimeout(() => {
            NativeMethodModule.openHyperPay(data, (response) => {
                setTimeout(() => {
                    console.log('success', response);
                    showToast('success');
                    //get resoucePath
                    // Toast.show({
                    //     text: Identify.__('Payment success !'),
                    //     type: 'success',
                    //     duration: 3000,
                    // });
                }, 500);
            }, (message) => {
                setTimeout(() => {

                    showDangerToast('Sorry, payment failed !');
                    //request cancel
                    // Toast.show({
                    //     text: Identify.__('Sorry, payment failed !'),
                    //     type: 'danger',
                    //     duration: 3000,
                    // });
                }, 500)
            })
        }, 500);
    }

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
                title={I18n.t('lbl_privacy_policy')}
                isCenterImage={false}
                centerText={I18n.t('lbl_privacy_policy')}
                navigation="HomePage"
                titleTop={''}
            />

            <Content
                style={{}}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
                enableResetScrollToCoords={false}
            //enableOnAndroid={true}
            >
                <View style={styles.container}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => { requestHyperPay() }}>
                        <Text style={{ fontSize: 20, }}>{'Click'}</Text>
                    </TouchableOpacity>
                </View>
            </Content>

        </Container>
    );
}

//***** Define style */
const styles = {
    container: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
};
