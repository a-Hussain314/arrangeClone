import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,

} from 'react-native';
import { Container, Content } from 'native-base';
import { height, width } from '../../../../constants/screenSize';
import { colors, fonts } from '../../../../Theme';
import { globalImagePath } from '../../../../constants/globalImagePath';
//import { style } from './style';
import NavBar from '../../../../components/NavBar';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import { getService } from '../../../../services/getServices';
import { AuthContext } from '../../../../contexts/AuthContext';
import { useIsFocused } from '@react-navigation/native';
export default function BeautyCare({ navigation }) {
    const isFocused = useIsFocused();
    const [image, setImage] = React.useState('');
    const [name, setName] = React.useState('');
    React.useEffect(() => { getUserProfileDetails(); }, [isFocused]);
    //***** For getting user's profile information */
    const getUserProfileDetails = user_id => {
        const postData = {
            update_status: 0,
            user_id: user_id,
        };

        //***** api calling */ 
        getService('profile/detail')
            .then(res => {
                if (res.data.status === 1) {


                    let data = res.data.response;
                    setName(data.first_name);
                    setImage(data.salon_logo_url + data.profile);

                } else {

                    var message = '';
                    res.data.errors.map((val) => {
                        message += Object.values(val) + ' '
                    })
                    setTimeout(function () {
                        showDangerToast(message != null ? message : res.data.message);
                    }, 100);
                }
            })
            .catch(error => {

                setTimeout(function () {
                    alert(error);
                }, 100);
            });
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255 0.1)' }}>
            <AuthContext.Consumer>
                {
                    (context) =>
                        <NavBar
                            textColor={'black'}
                            isLeftIconUrl={true}
                            leftIcon={image}
                            navigator={navigation}
                            backgroundColor={colors.white}
                            // centerImg={''}
                            notifyCount={global.notifyCount == 0 ? 0 : context.notificationCount}
                            rightImage={globalImagePath.notification}
                            navigation="HomePage"
                            centerText={name}
                        />
                }
            </AuthContext.Consumer>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Image source={globalImagePath.comingSoon} style={{ height: 200, width: 200 }} />
                <View style={{ marginTop: 20, marginHorizontal: 40 }}>
                    <Text style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>{'coming soon'}</Text>
                    <Text style={{ marginTop: 5, textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: 'rgb(110,118,130)' }}>{'Lorem Ipsum is simply dummy text of the printing and typesetting industry. '}</Text>
                </View>
            </View>



        </View>
    );
}
