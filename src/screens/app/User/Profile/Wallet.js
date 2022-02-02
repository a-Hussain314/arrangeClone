//***** import libraries */
import React from 'react';
import { Text, View, Image, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import Button from '../../../../components/Button';
import { Container, Content } from 'native-base';
import { postService } from '../../../../services/postServices';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import { colors, fonts, matrics } from '../../../../Theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { height, width } from '../../../../constants/screenSize';
import font from '../../../../Theme/font';
import I18n from '../../../../I18n';
import { useIsFocused } from '@react-navigation/native';
import { showToast, showDangerToast } from '../../../../components//ToastMessage';
import moment from "moment";

var pageNo = 1;
export default function Wallet({ navigation }) {
    let onEndReachedCalledDuringMomentum = true;
    const isFocused = useIsFocused();
    const [loading, setLoading] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [showLoadMore, setShowLoadMore] = React.useState(false);
    const [walletTotal, setWalletTotal] = React.useState(0);
    const [addressList, setAddressList] = React.useState([]);

    React.useEffect(() => {
        pageNo = 1;
        if (isFocused) {
            setLoading(true);
            getWalletList();
        }
    }, [isFocused]);

    const getWalletList = () => {
        const postData = {
            page: pageNo,
        };
        //***** api calling */
        postService('home/walletlist', postData)
            .then(async (res) => {
                setLoading(false);
                setRefreshing(false);
                setShowLoadMore(false);
                console.log('home/walletlist res ==> ', res);
                if (res.data.status === 1) {
                    let data = res.data.response;
                    setWalletTotal(data.wallet_total);

                    if (pageNo == 1) {
                        setAddressList([...data.list]);
                    } else {
                        data && data.list
                            ? setAddressList([...addressList, ...data.list])
                            : setAddressList([...addressList]);
                    }
                } else {
                    setLoading(false);
                    setRefreshing(false);
                    setShowLoadMore(false);
                    setTimeout(function () {
                        showDangerToast(res.data.message);
                    }, 100);
                }
            })
            .catch((error) => {
                setLoading(false);
                setRefreshing(false);
                setShowLoadMore(false);
                setTimeout(function () {
                    showDangerToast(error);
                }, 100);
            });
    };

    const onRefresh = () => {
        setRefreshing(true);
        pageNo = 1;
        getWalletList();
    };

    const onReached = () => {
        setRefreshing(true);
        setShowLoadMore(true);
        pageNo = parseInt(pageNo) + 1;
        getWalletList();
    };

    const _renderEmptyComponent = (type) => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        marginTop: 100,
                        fontSize: 22,
                        fontWeight: 'bold',
                        fontFamily: fonts.type.NunitoSans_Regular,
                    }}>
                    {I18n.t('lbl_no_balance')}
                </Text>
            </View>
        );
    };

    const _renderHeader = () => {
        return (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ImageBackground source={globalImagePath.walletBack} style={{ height: 134, width: 343 }} resizeMode={'contain'}>
                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={styles.title1}>{I18n.t('lbl_total_current_balance')}</Text>
                        <Text style={styles.title2}>{`SAR ${walletTotal}`}</Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    const _renderFooter = () => {
        if (!refreshing) return null;
        if (!showLoadMore) return null;

        return (
            <View
                style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                        padding: 10,
                        borderRadius: 4,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            fontFamily: fonts.type.NunitoSans_Regular,
                            textAlign: 'center',
                        }}>
                        {I18n.t('lbl_load_more')}
                    </Text>
                    {true ? (
                        <ActivityIndicator color="rgb(74,74,74)" style={{ marginLeft: 8 }} />
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    };

    const _addressList = (item, index) => {
        return (
            <View style={styles.renderOuterView}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, width: '58%' }}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.subTitle}>{item.description}</Text>
                    </View>
                    <View style={{ width: '40%' }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            {item.type == 1 ? (
                                <Image source={globalImagePath.plus} />
                            ) : (
                                <Image source={globalImagePath.minus} />
                            )}
                            <Text style={styles.itemTitle}>{` SAR ${item.price.toFixed(2)}`}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.subTitle}>{moment(item.created).format("ll")}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    //***** For rendering UI */
    return (
        <Container style={{ flex: 1 }}>
            <Loader loading={loading} />
            <NavBar
                textColor={'black'}
                isLeftIconUrl={false}
                leftIcon={globalImagePath.back_icon}
                navigator={navigation}
                backgroundColor={'#ffffff'}
                title={I18n.t('lbl_wallet')}
                isCenterImage={false}
                centerText={I18n.t('lbl_wallet')}
                navigation="HomePage"
                titleTop={''}
            />
            <View style={{
                flex: 1,
                paddingHorizontal: width * (20 / 375),
                backgroundColor: 'rgba(239,243,248,0.4)'
            }}
            >
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <ImageBackground source={globalImagePath.walletBack} style={{ height: 134, width: 343 }} resizeMode={'contain'}>
                        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                            <Text style={styles.title1}>{I18n.t('lbl_total_current_balance')}</Text>
                            <Text style={styles.title2}>{`SAR ${walletTotal.toFixed(2)}`}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={addressList}
                    renderItem={({ item, index }) =>
                        _addressList(item, index)
                    }
                    keyExtractor={(item, index) => String(index)}
                    onRefresh={() => onRefresh()}
                    refreshing={refreshing}
                    onEndReached={({ distanceFromEnd }) => {
                        if (!onEndReachedCalledDuringMomentum) {
                            onReached();
                            onEndReachedCalledDuringMomentum = true;
                        }
                    }}
                    onEndReachedThreshold={0.005}
                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum = false;
                    }}
                    //ListHeaderComponent={() => _renderHeader()}
                    ListFooterComponent={() => _renderFooter()}
                    ListEmptyComponent={() => _renderEmptyComponent()}
                />
            </View>
        </Container >
    );
}

//***** Define style */
const styles = {
    container: {
        paddingHorizontal: width * (20 / 375),
        //backgroundColor: 'rgba(239,243,248,0.4)'
    },
    renderOuterView: {
        //paddingHorizontal: width * (15 / 375),
        marginBottom: width * (10 / 375),
        borderRadius: 4,
        backgroundColor: 'rgba(239,243,248,0.1)',
        padding: width * (10 / 375),
        borderWidth: 0.3,
        borderColor: colors.themeColor
    },
    sectionOneOuter: {
        flexDirection: 'row'
    },
    itemTitle: {
        fontFamily: fonts.type.NunitoSans_SemiBold,
        fontSize: width * (14 / 375),
    },
    defaultOuter: {
        //  alignItems: '',
        //borderWidth: 1
    },
    default_text: {
        // color: '#fff',
        fontFamily: fonts.type.NunitoSans_Regular,
        fontSize: width * (10 / 375),

    },
    subTitle: {
        fontSize: 12,
        color: colors.darkShade,
        //fontFamily: font.type.OpenSans_Regular
    },
    title1: {
        color: colors.whiteColor,
        fontSize: 12,
        fontFamily: font.type.NunitoSans_Regular
    },
    title2: {
        color: colors.whiteColor,
        fontSize: 22,
        fontFamily: font.type.NunitoSans_bold
    }
};
