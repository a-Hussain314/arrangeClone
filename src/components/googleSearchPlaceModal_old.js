import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as React from "react";
import { StyleSheet, TextInput, Modal, View, Text, Image, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { fonts, images, colors, metrics } from '../Theme';
import { globalImagePath } from '../constants/globalImagePath';
import Button from '../components/Button';
const height = metrics.screenHeight;
const width = metrics.screenWidth;

export class GooglePlaceSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,
            location: '',
            lat: '',
            lng: ''
        }
    }

    // goToAccount = () => {
    //     this.props.onDisable();
    //     this.props.navigation.navigate('settingsAccount');
    // }

    getValue(data, details) {

        this.setState({ location: data.description, lat: details.geometry.location.lat, lng: details.geometry.location.lng })
    }

    submitValue() {

        this.setState({ visible: false })
        this.props._placeValue(this.state.location, this.state.lat, this.state.lng);
    }

    render() {
        var { navigation, } = this.props;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}>
                <TouchableWithoutFeedback style={styles.close_view}>
                    <View style={styles.container}>

                        <View style={styles.text_view}>
                            <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#d9d9d9', flexDirection: 'row', paddingHorizontal: 20 }}>
                                <TouchableOpacity onPress={() => this.props._goBack()} style={styles.crossIcon}>
                                    <Image source={globalImagePath.crossIcon} style={styles.crossImg} />
                                </TouchableOpacity>
                            </View>
                            <GooglePlacesAutocomplete
                                placeholder='Search'
                                fetchDetails={true}
                                GooglePlacesDetailsQuery={{ fields: 'geometry', }}
                                onPress={(data, details = null) => {

                                    this.getValue(data, details)
                                    //console.log(data,);
                                }}
                                query={{
                                    key: 'AIzaSyB3F_B_YH0XuWy_EB-zK-w4hyNJ1vjEJqQ',
                                    language: 'en',
                                }}
                            />
                            <View style={{ height: 50, marginTop: 20, marginBottom: 10, marginHorizontal: 20 }}>
                                {this.state.location != '' ? <Button
                                    label={'Ok'}
                                    textSize={16}
                                    onPress={() => { this.submitValue() }}
                                /> : null}
                            </View>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </Modal >
        );
    }
}

export default GooglePlaceSearch

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        paddingHorizontal: 20,

    },
    close_view: {
        width: width * (60 / 375),
        marginTop: width * (50 / 375),

    },
    text_view: {
        flex: 0.8,
        backgroundColor: colors.whiteColor,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        //paddingBottom: 20,

    },
})