//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { Container, Content, Textarea } from 'native-base';
import { globalImagePath } from '../../../../constants/globalImagePath';
import NavBar from '../../../../components/NavBar';
import Loader from '../../../../components/Loader';
import { CommonStyles } from '../../../../assets/css';
import { showToast, showDangerToast, } from '../../../../components/ToastMessage';
import validate from '../../../../components/Validations/validate_wrapper';
import ErrorMessage from '../../../../components/ErrorMessage';
import { normalize } from '../../../../components/Dimensions';
import Button from '../../../../components/Button';
import { postService } from '../../../../services/postServices';
import { USER_HOME_SALON_URL } from '../../../../utils/constants';
import I18n from '../../../../I18n';

// create a component
const ReviewRatingScreen = ({ route, navigation }) => {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const [profileLoad, setProfileLoad] = React.useState(false);

    //***** function for adding card on strip */
    const saveUserRating = () => {
        let commentError = validate('comment', comment);
        setCommentError(commentError);

        if (
            commentError
        ) {
            //showDangerToast('Please fill all fields.');
        } else {
            setLoading(true);
            const postData = {
                salon_id: route.params.salon_id,
                booking_id: route.params.booking_id,
                rating: rating,
                description: comment
            };

            //console.log("postData ==> ", postData);

            //***** api calling */
            postService('reviews/add-review', postData)
                .then(res => {
                    if (res.data.status === 1) {
                        setLoading(false);
                        showToast(res.data.message);
                        navigation.goBack();
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
                        showDangerToast(error.message);
                    }, 100);
                });
        }
    };

    return (
        <Container style={{ flex: 1 }}>
            <Loader loading={loading} />
            <NavBar
                textColor={'black'}
                isLeftIconUrl={false}
                leftIcon={globalImagePath.back_icon}
                navigator={navigation}
                backgroundColor={'#ffffff'}
                title={'Rating & Review'}
                isCenterImage={false}
                centerText={I18n.t('lbl_rate_review')}
                navigation="HomePage"
                titleTop={''}
            />
            <Content
                enableResetScrollToCoords={false}
                enableOnAndroid={true}
                style={{ flex: 1 }}
            >

                <View style={styles.container}>
                    <View
                        style={{
                            marginVertical: 20,
                        }}>
                        <Text style={{ ...CommonStyles.blackSemiBoldTextStyle(20) }}>
                            {I18n.t('lbl_rate_salon')}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={route.params.salon_detail.banner_salon ? { uri: USER_HOME_SALON_URL + route.params.salon_detail.banner_salon } : globalImagePath.default_img}
                            style={{
                                width: normalize(100),
                                height: normalize(100),
                                borderRadius: 5,
                            }}
                            onLoadStart={() => setProfileLoad(true)}
                            onLoad={() => setProfileLoad(false)}
                        />
                        {profileLoad ? (
                            <ActivityIndicator
                                style={{ position: 'absolute', marginLeft: normalize(50), marginTop: normalize(50), }}
                                size='small'
                                color={'rgb(196,170,153)'}
                                animating={profileLoad}
                            />
                        ) : null}
                        <Text style={{ ...CommonStyles.blackSemiBoldTextStyle(20), marginTop: 20 }}>{'SAR '}{route.params.booking_price}</Text>
                        <Text style={{ ...CommonStyles.blackSemiBoldTextStyle(15), marginTop: 20 }}>{route.params.salon_detail.salon_name}</Text>

                        <AirbnbRating
                            count={5}
                            reviews={['', '', '', '', '']}
                            showRating={false}
                            ratingImage={globalImagePath.yellow_star}
                            defaultRating={rating}
                            selectedColor={CommonStyles.THEME_COLOR}
                            size={40}
                            onFinishRating={rate => setRating(rate)}
                            starContainerStyle={{
                                alignSelf: 'flex-start',
                                marginTop: 10,
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 15 }} />
                    <Textarea
                        rowSpan={4}
                        placeholder={I18n.t('lbl_enter_cmt')}
                        placeholderTextColor="rgb(149,149,149)"
                        style={{ ...CommonStyles.TextareaInputStyle() }}
                        onChangeText={(comment) => {
                            setComment(comment);
                            setCommentError(validate('comment', comment));
                        }}
                        value={comment}
                    />
                    {commentError.length > 0 && (
                        <ErrorMessage text={commentError} />
                    )}
                    <View style={{ marginVertical: 20 }}>
                        <Button
                            label={I18n.t('lbl_submit')}
                            textSize={16}
                            onPress={() => saveUserRating()}
                        />
                    </View>
                </View>

            </Content>
        </Container>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
    },
});

//make this component available to the app
export default ReviewRatingScreen;
