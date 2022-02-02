import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, ImageBackground, ScrollView, I18nManager, Keyboard, } from 'react-native';
import { globalImagePath } from '../../../constants/globalImagePath';
import { Container, Content } from 'native-base';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import validate from '../../../components/Validations/validate_wrapper';
import { showToast, showDangerToast } from '../../../components/ToastMessage';
import { fonts, metrics, colors } from '../../../Theme';
import { postService } from '../../../services/postServices';
import I18n from '../../../I18n';
import NavBar from '../../../components/NavBar';
import Loader from '../../../components/Loader';
const height = metrics.screenHeight;
const width = metrics.screenWidth;
export default class Support extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            emailError: '',
            name: "",
            nameError: "",
            salonName: "",
            salonNameError: "",
            description: "",
            descriptionError: "",
        };
    }

    _addSupport = () => {
        //***** For validate input field */
        const descriptionError = validate("supportMessage", this.state.description);
        const nameError = validate("name", this.state.name);
        const emailError = validate('email', this.state.email);

        this.setState({
            descriptionError: descriptionError,
            nameError: nameError,
            emailError: emailError,

            //confirmPasswordError: confirmPasswordError,
        });

        if (nameError || emailError || descriptionError) {
            // this.signupBtn.shake();

        } else {
            this.setState({
                loading: true,
            });

            const postData = {
                email: this.state.email.toLowerCase(),
                name: this.state.name,
                message: this.state.description,

            };
            console.log("PostData ==>", postData);
            //***** api calling */
            postService('support/create', postData)
                .then(res => {
                    console.log(JSON.stringify(res));

                    if (res.data.status === 1) {
                        this.setState({
                            loading: false,
                        });
                        setTimeout(() => {
                            showToast(res.data.message);
                            this.setState({ name: '', email: '', description: '' })
                        }, 100);
                    } else {
                        this.setState({
                            loading: false,
                        });
                        setTimeout(function () {
                            showDangerToast(res.data.message);
                        }, 100);
                    }
                })
                .catch(error => {
                    this.setState({
                        loading: false,
                    });
                    setTimeout(function () {
                        alert(error);
                    }, 100);
                });
        }
    };
    onSelectLanguage = (lang, index) => {

        this.setState({
            //   // language: lang._id,
            //   // languageError: validate("language", lang.name),
            langVal: lang.dc
        })

    }
    check = (f) => {
        this.setState({ gender: f })
    };

    getDocument = async () => {
        // Pick a single file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            this.setState({ docFile: res.name })
            // console.log(
            //     res.uri,
            //     res.type, // mime type
            //     res.name,
            //     res.size
            // );
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    render() {

        return (
            <Container style={{ flex: 1 }}>
                <Loader loading={this.state.loading} />
                <NavBar
                    textColor={'black'}
                    isLeftIconUrl={false}
                    leftIcon={globalImagePath.back_icon}
                    navigator={this.props.navigation}
                    backgroundColor={'#ffffff'}
                    title={'Support'}
                    isCenterImage={false}
                    centerText={I18n.t('lbl_support')}
                    navigation="HomePage"
                    titleTop={''}
                />
                <Content style={{ flex: 1 }}>
                    <View style={styles.noteView}>
                        <Text style={{ color: colors.themeColor, fontSize: 14, fontFamily: fonts.type.NunitoSans_Regular }}>
                            {I18n.t('lbl_support_title')}
                        </Text>
                    </View>
                    <View style={styles.container}>

                        <TextInput
                            isPlaceHolder={true}
                            placeholder={I18n.t('lbl_enter_name')}
                            isLevelShow={true}
                            level={I18n.t('lbl_name')}
                            error={this.state.nameError}
                            onEndEditing={() => {
                                this.setState({
                                    name: this.state.name.toLowerCase(),
                                });
                            }}
                            onChangeText={name => this.setState({ name: name, nameError: validate("name", name, "", true) })}
                            value={this.state.name}
                        />


                        <TextInput
                            isPlaceHolder={true}
                            placeholder={I18n.t('lbl_email')}
                            isLevelShow={true}
                            level={I18n.t('lbl_email')}
                            error={this.state.emailError}
                            keyboardType={'email-address'}
                            onEndEditing={() => {
                                this.setState({
                                    email: this.state.email.toLowerCase(),
                                });
                            }}
                            onChangeText={email =>
                                this.setState({
                                    email: email,
                                    emailError: validate('email', email),
                                })
                            }
                            value={this.state.email ? this.state.email : ''}
                        />

                        <TextInput
                            height={100}
                            isPlaceHolder={true}
                            placeholder={I18n.t('lbl_enter_msg')}
                            isLevelShow={true}
                            level={'Message'}
                            error={this.state.descriptionError}
                            onEndEditing={() => {
                                this.setState({
                                    description: this.state.description.toLowerCase(),
                                });
                            }}
                            onChangeText={description => this.setState({ description: description, descriptionError: validate("supportMessage", description, "", true) })}
                            value={this.state.description}
                        />

                        <View
                            ref={ref => (this.signupBtn = ref)}
                            animation="slideInUp"
                            style={{ marginVertical: 30 }}>
                            <Button
                                label={I18n.t('lbl_submit')}
                                textSize={14}
                                onPress={() => { this._addSupport() }}
                            />
                        </View>


                    </View>
                </Content>


            </Container >
        );
    }
}

const styles = {
    noteView: {
        paddingHorizontal: width * (20 / 375),
        backgroundColor: '#fff',

    },
    container: {
        paddingHorizontal: width * (20 / 375),
        backgroundColor: '#fff',
        paddingTop: width * (10 / 375),
    },
    outer_container: {
        //  position: 'absolute',
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        //  marginTop: width * (-260 / 375),

    },
    subTitle: {
        fontSize: width * (14 / 375),
        color: colors.lightThemeColor,
        marginTop: width * (20 / 375),
        fontFamily: fonts.type.NunitoSans_Regular
    },
    title: {
        marginTop: width * (5 / 375),
        fontSize: width * (24 / 375),
        color: colors.whiteColor,
        fontFamily: fonts.type.NunitoSans_bold
    }

};
