import * as React from "react";
import { Modal, View, Text, Image, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./styles";
import { images } from '../../Theme';
import I18n from '../../I18n';

export class ImagePopup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,
            loadProfile: false,

        }
    }

    // goToAccount = () => {
    //     this.props.onDisable();
    //     this.props.navigation.navigate('settingsAccount');
    // }

    animationShow = async (val) => {
        this.setState({ loadProfile: val })
    };

    render() {
        var { appString, imgUri, galleryUrl } = this.props;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}>
                <View style={styles.container}>
                    <View style={styles.outerView}>
                        <TouchableOpacity onPress={() => this.props._goBack()} style={styles.crossIcon}>
                            <Text style={{ color: '#fff', fontSize: 24 }}>{I18n.t('lbl_close')}</Text>
                        </TouchableOpacity>

                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 50
                        }}>
                            <Image
                                source={imgUri ? { uri: galleryUrl + imgUri } : ''}
                                style={styles.img}
                                onLoadStart={() => this.animationShow(true)}
                                onLoad={() => this.animationShow(false)}
                            />
                            {this.state.loadProfile ? (
                                <ActivityIndicator
                                    style={{ position: 'absolute', }}
                                    size='large'
                                    color={'rgb(196,170,153)'}
                                    animating={this.state.loadProfile}
                                />
                            ) :
                                null
                            }
                        </View>
                    </View>
                </View>

            </Modal>

        );
    }
}

export default ImagePopup