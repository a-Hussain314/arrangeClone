//***** import libraries */
import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';

import { Container, Content } from 'native-base';
import { postService } from '../../../../services/postServices';
import I18n from '../../../../I18n';
import { showToast, showDangerToast } from '../../../../components//ToastMessage';
import validate from '../../../../components/Validations/validate_wrapper';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import CalendarPicker from 'react-native-calendar-picker';
import { colors, fonts } from '../../../../Theme';
import { height, width } from '../../../../constants/screenSize';
import Button from '../../../../components/Button';
import ErrorMessage from '../../../../components/ErrorMessage';
import { CommonStyles } from "../../../../assets/css";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";

export default function SelectDateAndTime({ route, navigation }) {

    const isFocused = useIsFocused();
    const [timeSlot, setTimeSlot] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [bookingDate, setBookingDate] = React.useState(new Date());
    const [bookingTimeSlot, setBookingTimeSlot] = React.useState('');
    const [endTimeSlot, setEndTimeSlot] = React.useState('');
    const [dateError, setDateError] = React.useState('');

    React.useEffect(() => {
        let day = moment().format('dddd');
        setBookingDate(new Date());
        var curdate = new Date();

        isFocused ? getTimeSlot(day, curdate) : null;
    }, [isFocused]);

    const getTimeSlot = async (selectedDay, dt) => {
        setLoading(true);

        const postData = {
            day: selectedDay,
            salon_id: route.params.salon_id,
            date: dt
        }
        //***** api calling */
        postService('home/getSlots', postData)
            .then(async res => {
                setLoading(false);
                console.log("getSlots res ==> ", res);
                if (res.data.status === 1) {
                    setLoading(false);
                    setTimeSlot(res.data.response ? res.data.response : []);
                    setBookingTimeSlot('');
                    setEndTimeSlot('');
                } else {
                    setLoading(false);
                    setTimeout(function () {
                        showDangerToast(res.data.message);
                        setTimeSlot([]);
                    }, 100);
                }
            })
            .catch(error => {
                setLoading(false);
                setTimeout(function () {
                    alert(error);
                }, 100);
            });
    }

    const onDateChange = (date) => {
        setBookingDate(date.toString());
        //moment(bookingDate).format("YYYY-MM-DD")
        let dt = new Date(date.toString());
        //console.log("date =>", dt);
        let date1 = new Date();
        let date2 = new Date(date.toString());
        let date3 =
            date1.getFullYear() +
            "-" +
            (date1.getMonth() + 1) +
            "-" +
            date1.getDate();
        let date4 =
            date2.getFullYear() +
            "-" +
            (date2.getMonth() + 1) +
            "-" +
            date2.getDate();

        if (date1.getTime() > date2.getTime() && date3 != date4) {
            setDateError("Appointment date should be greater than today date");
            setTimeSlot([]);
        } else {
            setDateError("");
            let day = moment(date.toString()).format('dddd');
            getTimeSlot(day, dt);
        }
    }

    // Handle Offers subcategory selection
    const handleCategory = (title, index) => {

        let Arr = timeSlot;

        for (var i = 0; i < Arr.length; i++) {
            if (i == index) {
                Arr[i].active = true;
                setBookingTimeSlot(Arr[i].starttime);
                setEndTimeSlot(Arr[i].endtime)
            } else {
                Arr[i].active = false;
            }
        }
        setTimeSlot(Arr);
        // console.log("index of selected option ", index);
    };

    const _renderEmptyComponent = type => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center'
                }}>
                <Text style={{ marginTop: 50, fontSize: 22, fontWeight: 'bold', fontFamily: fonts.type.NunitoSans_Regular, }}>
                    Time slots not found..
            </Text>
            </View>
        );
    };

    // Render offers subcategory
    const _renderTimeSlot = (item, index) => {

        return (
            <TouchableOpacity
                onPress={() => { handleCategory(item.name, index); }}
                style={{
                    marginTop: 5,
                    marginBottom: 5,
                    alignItems: 'center',
                    marginLeft: 5,
                    marginRight: 5
                }}>
                <View
                    style={[
                        styles.treatmentOption,
                        { backgroundColor: item.active ? colors.darkShade : colors.whiteColor },

                    ]}>

                    <View style={styles.treatmentOptionTitle}>
                        <Text style={[styles.treatmentTitle, { color: item.active ? colors.whiteColor : colors.darkShade }]}>{item.text}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        );
    };

    const bookAppointment = () => {
        if (dateError.length > 0) {
            showDangerToast(dateError);
            return;
        }

        if (bookingTimeSlot == '') {
            showDangerToast(I18n.t('lbl_select_available_time'));
            return;
        }

        // console.log("date ==> ", moment(bookingDate).format("YYYY-MM-DD"), " time slot ==> ", bookingTimeSlot);

        navigation.navigate("Booking", {
            booking_date: moment(bookingDate).format("MM/DD/YYYY"),
            booking_time: bookingTimeSlot,
            bookingEndTime: endTimeSlot
        });
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
                title={I18n.t('lbl_dateTime_title')}
                isCenterImage={false}
                centerText={I18n.t('lbl_dateTime_title')}
                navigation="HomePage"
                titleTop={''}
            />

            <Content
                enableResetScrollToCoords={false}
            //enableOnAndroid={true}
            >
                <View style={styles.container}>
                    <View
                        style={{
                            backgroundColor: "#ffffff",
                            margin: 5,
                            borderRadius: 5,
                            elevation: 1,
                            shadowColor: "#aaaaaa",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                        }}
                    >
                        <CalendarPicker
                            weekdays={["M", "T", "W", "T", "F", "S", "S"]}
                            startFromMonday={true}
                            previousTitle={I18n.t('lbl_pre')}
                            nextTitle={I18n.t('lbl_next')}
                            enableSwipe={false}
                            selectedStartDate={bookingDate ? bookingDate.toString() : ""}
                            selectedDayColor={colors.darkShade}
                            selectedDayTextColor={colors.whiteColor}
                            todayBackgroundColor="transparent"
                            todayTextStyle="#333333"
                            width={400}
                            height={320}
                            textStyle={{
                                fontSize: 14,
                                color: "rgba(51, 51, 51, 0.54)",
                                fontFamily: fonts.type.NunitoSans_Regular
                            }}

                            onDateChange={(date) => onDateChange(date)}
                        />
                    </View>
                    {dateError.length > 0 && <ErrorMessage text={dateError} />}
                    <View style={{ flex: 1, marginTop: 20 }}>
                        <Text style={{ color: '#000', fontSize: 18, fontFamily: fonts.type.NunitoSans_bold }}>{I18n.t('lbl_available_slot')}</Text>
                        <View style={{ flex: 1, alignItems: 'center', marginTop: 20, marginBottom: 60 }}>
                            <FlatList
                                numColumns={2}
                                data={timeSlot}
                                renderItem={({ item, index }) =>
                                    _renderTimeSlot(item, index)
                                }
                                keyExtractor={(item, index) => String(index)}
                                ListEmptyComponent={() => _renderEmptyComponent()}
                            />
                        </View>

                    </View>
                </View>

            </Content>
            <View style={{ position: 'absolute', width: '100%', bottom: 0 }}>
                <View style={{ marginTop: 10, }}>
                    <TouchableOpacity
                        style={{ ...CommonStyles.buttonStyle(), borderRadius: 0, paddingHorizontal: 10 }}
                        onPress={() => bookAppointment()}
                    >
                        <Text style={{ ...CommonStyles.buttonTextStyle(16) }}>{I18n.t('lbl_book_apointment')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Container>
    );
}

//***** Define style */
const styles = {
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    treatmentOptionTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * (10 / 375),
        marginTop: width * (10 / 375),

    },
    treatmentOption: {
        height: width * (40 / 375),
        width: width * (150 / 375),
        borderRadius: width * (5 / 375),
        borderWidth: 0.5,
        borderColor: colors.themeColor,
        // justifyContent: 'center',
        // alignItems: 'center',

    },

    treatmentTitle: {
        fontSize: width * (10 / 375),
        fontFamily: fonts.type.NunitoSans_SemiBold,
        color: colors.darkShade,
        textAlign: 'center'
    },
};
