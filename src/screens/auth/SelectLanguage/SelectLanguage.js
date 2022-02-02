
import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, I18nManager } from 'react-native';
import { Container, Content, Item } from 'native-base';
import { globalImagePath } from '../../../constants/globalImagePath';
import I18n from '../../../I18n';
import RNRestart from "react-native-restart";
import { styles } from './styles';
import { CustomLanguage } from '../../../components';
import AsyncStorage from '@react-native-community/async-storage';
export default function SelectLangauge({ navigation }) {
    const [defaultLang, setDefaultLang] = React.useState(I18nManager.isRTL)
    const [langName, setLangName] = React.useState('en')
    React.useEffect(() => {

    }, []);


    const _selectLanguage = async (value, lang) => {

        setLangName(lang)
        setDefaultLang(value);
        I18n.locale = lang;
        await I18nManager.forceRTL(value);
    }

    const _nav = async () => {

        await AsyncStorage.setItem('appLanguage', JSON.stringify(langName));

        RNRestart.Restart();
        navigation.navigate('AppGuide');
    }

    return (

        <Container>
            <Content contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>{I18n.t('title')}</Text>
                    <Text style={styles.subTitle}>{I18n.t('subTitle')}</Text>
                </View>
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', }}>
                    <CustomLanguage
                        langImg={globalImagePath.languageImage}
                        langTitle={I18n.t('englishLangaugeTitle')}
                        onPress={() => defaultLang != false ? _selectLanguage(false, 'en') : {}}
                        engLang={defaultLang}
                    />
                    <CustomLanguage
                        langImg={globalImagePath.arabicImg}
                        langTitle={I18n.t('arablicLangaugeTitle')}
                        onPress={() => defaultLang != true ? _selectLanguage(true, 'ar') : {}}
                        arLang={defaultLang}
                    />

                </View>

                <TouchableOpacity onPress={async () => { _nav() }} style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(196, 170, 153)', borderRadius: 5, height: 45, width: 135 }}>
                    <Text style={styles.nextText}>{I18n.t('next')}</Text>
                </TouchableOpacity>
            </Content>
        </Container>
    )
}