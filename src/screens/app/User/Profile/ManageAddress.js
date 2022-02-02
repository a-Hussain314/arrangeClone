//***** import libraries */
import React from 'react';
import { Text, View, Image, FlatList, Alert } from 'react-native';
import Button from '../../../../components/Button';
import { Container, Content } from 'native-base';
import { postService } from '../../../../services/postServices';
import { getService } from '../../../../services/getServices';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import { colors, fonts, matrics } from '../../../../Theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { height, width } from '../../../../constants/screenSize';
import I18n from '../../../../I18n';
import { useIsFocused } from "@react-navigation/native";
import { showToast, showDangerToast, } from '../../../../components/ToastMessage';
export default function ManageAddress({ navigation, props }) {
    const [loading, setLoading] = React.useState(false);
    const isFocused = useIsFocused();
    const [addressList, setAddressList] = React.useState([]);
    React.useEffect(() => {
        getAddress();
    }, [props, isFocused]);

    const getAddress = () => {

        setLoading(true)

        // ***** api calling */
        postService('address')
            .then(res => {
                // console.log('result getAddress = ', res);

                if (res.status === 200) {
                    setLoading(false);
                    setAddressList(res.data.response)
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

    const makeDefault = (id) => {
        setLoading(true)

        // ***** api calling */
        getService(`address/${id}`)
            .then(res => {
                console.log('makeDefault  = ', res);

                if (res.status === 200) {
                    setLoading(false);
                    showToast(res.data.message)
                    getAddress();
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


    const deleteAddress = (details) => {

        // console.log("details", details);
        setLoading(true)
        let data = {
            _id: details._id
        }
        // console.log("data =>", data);
        //  ***** api calling * /
        postService('address/remove', data)
            .then(res => {
                console.log('result deleteAddress = ' + res);

                if (res.data.status === 1) {
                    setLoading(false);
                    showToast(res.data.message);
                    getAddress();
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


    function deleteAddressAlert(item) {
        Alert.alert(
            `Are you sure want to delete this address`,
            '',
            [
                {
                    text: `Cancel`,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: `OK`, onPress: () => deleteAddress(item) },
            ],
            { cancelable: false },
        );
    }

    const _addressList = (item, index) => {

        let tag = ''
        if (item.tag_location == 1) {
            tag = I18n.t('lbl_home');
        } else if (item.tag_location == 2) {
            tag = I18n.t('lbl_office');
        } else if (item.tag_location == 3) {
            tag = I18n.t('lbl_other');
        }
        return (
            <View style={!item.isdefault ? styles.renderOuterView : styles.renderOuterView_2}>
                <View style={styles.sectionOneOuter}>
                    <View style={{ flex: 1 }}>
                        <Text style={!item.isdefault ? styles.itemTitle : styles.itemTitle_white}>{tag}</Text>
                    </View>
                    {item.isdefault ? <View>
                        <TouchableOpacity style={styles.defaultOuter} >
                            <Text style={styles.default_text}>{I18n.t('lbl_default')}</Text>
                        </TouchableOpacity>
                    </View> : null}
                </View>
                <View style={styles.sectionTwo}>
                    <Text style={!item.isdefault ? styles.addressText : styles.addressText_white}>{I18n.t('lbl_landmark') + ' : ' + item.landmark}</Text>
                    {/* <Text style={styles.addressText}>{'+90-6977664062 (mobile phone)'}</Text> */}
                </View>
                <View style={styles.sectionThird}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('AddNewAddress', {
                            addressId: item._id
                        })
                    }} style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={globalImagePath.edit} style={{ tintColor: !item.isdefault ? colors.themeColor : colors.whiteColor }}></Image>
                        </View>
                        <Text style={!item.isdefault ? styles.sectionThirdText : styles.sectionThirdText_white}>{I18n.t('lbl_edit')}</Text>
                    </TouchableOpacity>
                    {!item.isdefault ? <View style={{ marginHorizontal: 30 }}><Text style={styles.bar}>{'|'}</Text></View> : null}
                    {!item.isdefault ? <TouchableOpacity onPress={() => { deleteAddressAlert(item) }} style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={globalImagePath.delete}></Image>
                        </View>
                        <Text style={styles.sectionThirdText}>{I18n.t('lbl_delete')}</Text>
                    </TouchableOpacity> : null}
                    {!item.status ? !item.isdefault ? <TouchableOpacity onPress={() => { makeDefault(item._id) }} style={styles.makeDefault}>
                        <Text style={styles.sectionThirdText}>{I18n.t('lbl_make_default')}</Text>
                    </TouchableOpacity> : null : null}
                </View>
            </View>
        )
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
                title={I18n.t('lbl_manage_address')}
                isCenterImage={false}
                centerText={I18n.t('lbl_manage_address')}
                navigation="HomePage"
                titleTop={''}
            />

            <Content
                enableResetScrollToCoords={false}
            //enableOnAndroid={true}
            >
                <View style={styles.container}>

                    <View style={{ flex: 1, marginTop: 20, }}>
                        <FlatList
                            inverted={true}
                            showsVerticalScrollIndicator={false}
                            data={addressList}
                            renderItem={({ item, index }) =>
                                _addressList(item, index)
                            }
                            keyExtractor={(item, index) => String(index)}
                        />
                    </View>

                    <View style={{ marginTop: 20, marginBottom: 10 }}>
                        <Button
                            label={I18n.t('lbl_add_new_address')}
                            textSize={16}
                            onPress={() => { navigation.navigate('AddNewAddress') }}
                        />
                    </View>
                </View>

            </Content>

        </Container >
    );
}

//***** Define style */
const styles = {
    container: {
        paddingHorizontal: width * (20 / 375),
    },
    renderOuterView: {
        paddingHorizontal: width * (15 / 375),
        marginBottom: width * (10 / 375),
        borderRadius: 5,
        backgroundColor: colors.moreLight,
        padding: width * (10 / 375)
    },
    renderOuterView_2: {
        paddingHorizontal: width * (15 / 375),
        marginBottom: width * (10 / 375),
        borderRadius: 5,
        backgroundColor: colors.themeColor,
        padding: width * (10 / 375)
    },
    sectionOneOuter: {
        flexDirection: 'row'
    },
    itemTitle: {
        fontFamily: fonts.type.NunitoSans_bold,
        fontSize: width * (16 / 375),
        color: colors.code_8c8f9f
    },
    itemTitle_white: {
        fontFamily: fonts.type.NunitoSans_bold,
        fontSize: width * (16 / 375),
        color: colors.whiteColor
    },
    defaultOuter: {
        paddingHorizontal: width * (8 / 375),
        paddingVertical: width * (2 / 375),
        borderRadius: 3,
        backgroundColor: colors.lightThemeColor
    },
    default_text: {
        color: '#fff',
        fontFamily: fonts.type.NunitoSans_Regular,
        fontSize: width * (10 / 375)
    },
    sectionTwo: {
        borderRadius: 3,
        marginTop: width * (10 / 375)
    },
    addressText: {
        color: colors.code_8c8f9f,
        fontSize: width * (14 / 375)
    },
    addressText_white: {
        color: colors.whiteColor,
        fontSize: width * (14 / 375)
    },
    sectionThird: {
        flexDirection: 'row',
        borderRadius: 3,
        marginTop: width * (15 / 375)
    },
    sectionThirdText: {
        marginLeft: width * (5 / 375),
        fontSize: width * (16 / 375),
        fontFamily: fonts.type.NunitoSans_SemiBold,
        color: colors.code_8c8f9f
    },
    sectionThirdText_white: {
        marginLeft: width * (5 / 375),
        fontSize: width * (16 / 375),
        fontFamily: fonts.type.NunitoSans_SemiBold,
        color: colors.whiteColor
    },
    bar: { fontSize: width * (14 / 375), fontWeight: 'bold' },
    makeDefault: {
        marginLeft: width * (20 / 375), flexDirection: 'row'
    }
};
