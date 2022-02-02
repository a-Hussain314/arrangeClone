//***** import libraries */
import React from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content } from 'native-base';
import I18n from '../../../I18n';
import NavBar from '../../../components/NavBar';
import Loader from '../../../components/Loader';
import { globalImagePath } from '../../../constants/globalImagePath';
import AutoHeightWebView from "../../../components/autoheight_webview/autoHeightWebView";
import { postService } from '../../../services/postServices';
export default function RefundAndCancellation({ navigation }) {
    const [loading, setLoading] = React.useState(false);
    const [refundAndCancel, setRefundAndCancel] = React.useState('');
    React.useEffect(() => {
        getRefundAndPolicy();
    }, []);

    const getRefundAndPolicy = () => {
        setLoading(true);
        const data = {
            slug: 'privacy-policy'

        };
        console.log("data =>", data);
        // //***** api calling */
        postService('cms', data)
            .then(async res => {

                setLoading(false);

                if (res.data.response.status == 1) {
                    try {
                        setRefundAndCancel(res.data.response.content_ar);
                        // console.log("res refund and cancel==>", res.data.response.content_ar);
                    } catch (e) {
                        showDangerToast(e);
                        setLoading(false);
                    }
                } else if (res.data.response.status == 2) {
                    setAboutData('Content Not Available')
                } else {
                    setLoading(false);
                    setTimeout(function () {
                        showDangerToast(res.data.message);
                    }, 100);
                }
            })
            .catch(error => {
                setLoading(false);
                setTimeout(function () {
                    alert(error);
                }, 100);
            });

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
                title={I18n.t('lbl_refund_cancellation')}
                isCenterImage={false}
                centerText={I18n.t('lbl_refund_cancellation')}
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
                    <AutoHeightWebView
                        startInLoadingState={true}
                        customStyle={`p {font-size: ${18}px;}`}
                        style={{
                            width: -10,
                            marginTop: 16,
                        }}
                        // or uri
                        source={{
                            html: `<p>${refundAndCancel}</p>`
                        }}
                        zoomable={false}
                    />
                </View>
            </Content>

        </Container>
    );
}

//***** Define style */
const styles = {
    container: {
        paddingHorizontal: 20,
    },
};
