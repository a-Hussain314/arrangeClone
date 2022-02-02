import React, {useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {height, width} from '../../../../../../constants/screenSize';
import {fonts, colors} from '../../../../../../Theme';
// import { styles } from './styles';
import {globalImagePath} from '../../../../../../constants/globalImagePath';
import font from '../../../../../../Theme/font';
import ActionSheet from 'react-native-actionsheet';
import Loader from '../../../../../../components/Loader';
import {getService} from '../../../../../../services/getServices';
import {postService} from '../../../../../../services/postServices';
import {ImagePopup} from '../../../../../../components';
import {
  showToast,
  showDangerToast,
  showDangerToastLong,
} from '../../../../../../components/ToastMessage';
import Button from '../../../../../../components/Button';
import I18n from '../../../../../../I18n';
import {
  checkPhotoPermission,
  checkCameraPermission,
  pickImageHandler,
  openCameraPickerView,
} from '../../../../../../components/imagePicker';
var deleteImageArray = [];
export default function SalonGallery({navigation, currentTabNum}) {
  const ActionSheetRef = useRef(null);
  const [salonGallery, setSalonGalley] = React.useState([]);
  const [localImgArray, setLocalImgArray] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [imageUri, setImageUri] = React.useState('');
  const [galleryUrl, setGalleryUrl] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [galleryImage, setGalleryImage] = React.useState([]);
  const [apiData, setApiData] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  React.useEffect(() => {}, []);

  React.useEffect(() => {
    getSalonGallery();
  }, [currentTabNum]);

  const getSalonGallery = () => {
    setLoading(true);
    //***** api calling */
    getService('profile/salon-gallery')
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);
          let data = res.data.response;
          // console.log("profile/salon-gallery", data);
          setGalleryUrl(data.url);
          var imageList = [
            {
              uri: globalImagePath.addImage,
              name: 'add image',
              type: 'avatar',
              animate: false,
            },
          ];
          data.images.map((el, index) => imageList.push(el));
          //  console.log("imageList =>", imageList);
          setApiData(true);
          setSalonGalley(imageList);
          setLocalImgArray(data.images);
        } else {
          setLoading(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };

  const addSalonGallery = (imageList) => {
    setLoading(true);
    //***** api calling */
    let body = new FormData();
    if (imageList != 0) {
      imageList.forEach((item, i) => {
        if (i != 0) {
          item.uri &&
            body.append('image', {
              uri: item.uri,
              type: 'image/jpeg',
              name: 'image' + i + '.jpeg',
            });
        }
      });
    }

    postService('profile/upload-gallery', body)
      .then((res) => {
        setLoading(false);
        //console.log("profile/upload-gallery =>", res);
        if (res.data.status === 1) {
          setLoading(false);
          showToast(res.data.message);
          getSalonGallery();
        } else {
          setLoading(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };

  const deleteSalonGallery = (item, index) => {
    setLoading(true);
    //***** api calling */

    let body = new FormData();
    body.append('removedImage', JSON.stringify([item.image_name]));
    console.log('body =>', body);
    postService('profile/upload-gallery', body)
      .then((res) => {
        console.log('delete image =>', res);
        if (res.data.status === 1) {
          setSalonGalley([]);
          let data = res.data.response;
          //console.log("profile/salon-gallery", data);
          var imageList = [
            {
              uri: globalImagePath.addImage,
              name: 'add image',
              type: 'avatar',
              animate: false,
            },
          ];
          data.images.map((el, index) => imageList.push(el));

          setSalonGalley(imageList);
          setLocalImgArray(data.images);
          showToast(res.data.message);
          setTimeout(() => {
            setLoading(false);
          }, 5000);
        } else {
          setLoading(false);
          setTimeout(function () {
            showDangerToast(res.data.message);
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(function () {
          alert(error);
        }, 100);
      });
  };

  const confirmationPopup = (item, index) => {
    Alert.alert(
      I18n.t('lbl_image_delete_confirmation'),
      '',
      [
        {
          text: `${I18n.t('lbl_cancel')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: `${I18n.t('lbl_ok')}`,
          onPress: () => deleteSalonGallery(item, index),
        },
      ],
      {cancelable: false},
    );
    //  deleteSalonGallery(item, index)
  };

  const animationShow = async (key, val) => {
    let data = [...salonGallery];
    data[key].animate = val;
    setSalonGalley(await data);
  };

  const showImage = (item) => {
    setImageUri(item.image_name);
    setVisible(true);
  };

  // Render gallery salon
  const _renderSalonGallery = (item, index) => {
    return index == 0 ? (
      <TouchableOpacity
        onPress={() => {
          ActionSheetRef.current.show();
        }}
        style={{justifyContent: 'center', marginRight: 6, marginBottom: 10}}>
        <Image source={item.uri} style={styles.image} resizeMode={'cover'} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => {
          showImage(item);
        }}
        style={{
          justifyContent: 'center',
          marginRight: 6,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: '#efefef',
          borderRadius: 5,
        }}>
        <ImageBackground
          source={
            item.image_name
              ? {uri: galleryUrl + item.image_name}
              : {uri: item.uri}
          }
          style={styles.image}
          resizeMode={'cover'}
          onLoadStart={() => animationShow(index, true)}
          onLoad={() => animationShow(index, false)}>
          {item.animate ? (
            <ActivityIndicator
              style={{marginTop: 50}}
              size="small"
              color={'rgb(196,170,153)'}
              animating={item.animate}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                confirmationPopup(item, index);
              }}
              style={{position: 'absolute', right: 10, top: 10}}>
              <Image source={globalImagePath.crossImage} />
            </TouchableOpacity>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const showActionSheet = () => {
    return (
      <ActionSheet
        ref={ActionSheetRef}
        title={''}
        options={[
          I18n.t('lbl_camera'),
          I18n.t('lbl_gallery'),
          I18n.t('lbl_cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={3}
        style={{useNativeDriver: true}}
        onPress={async (index) => {
          if (index == 0) {
            Platform.OS == 'ios'
              ? checkCameraPermission().then((res) => {
                  console.log('1st res is ', res);
                  handleImgRes(res);
                })
              : openCameraPickerView().then((res) => {
                  console.log('2st res is ', res);
                  handleImgRes(res);
                });
          } else if (index == 1) {
            Platform.OS == 'ios'
              ? checkPhotoPermission(true).then((res) => {
                  console.log('3st res is ', res);
                  handleImgRes(res);
                })
              : pickImageHandler(true).then((res) => {
                  console.log('4st res is ', res);
                  handleImgRes(res);
                });
          }
        }}
      />
    );
  };

  const handleImgRes = (res) => {
    var tempImgList = [];
    if (typeof res != 'string') {
      res.map((i) => {
        var lstIndex = i.path.lastIndexOf('/');
        var fileNameAndroid = i.path.slice(lstIndex + 1, i.path.length);
        var name = Platform.OS == 'ios' ? i.filename : fileNameAndroid;
        var type = i.mime;
        var uri = i.path;
        tempImgList.push({name: name, type: type, uri: uri});
      });

      var imageList = [
        {
          uri: globalImagePath.addImage,
          name: 'add image',
          type: 'avatar',
          animate: false,
        },
      ];

      tempImgList.map((el, index) => imageList.push(el));

      localImgArray.map((item, index) => {
        imageList.push(item);
      });

      console.log('imageList ==>', imageList);
      setSalonGalley(imageList);
      addSalonGallery(imageList);
    }
  };

  const _goBack = () => {
    setVisible(false);
  };

  const emptyComponent = () => {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            marginTop: 100,
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: fonts.type.NunitoSans_Regular,
          }}>
          {I18n.t('lbl_no_image')}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: width * (20 / 375),
        backgroundColor: '#fff',
      }}>
      <ImagePopup
        visible={visible}
        imgUri={imageUri}
        galleryUrl={galleryUrl}
        _goBack={() => {
          _goBack();
        }}
      />
      <Loader loading={loading} />
      {showActionSheet()}
      <View style={{flex: 1, marginTop: 20, borderColor: 'red'}}>
        <FlatList
          numColumns={3}
          showsVerticalScrollIndicator={false}
          data={salonGallery}
          renderItem={({item, index}) => _renderSalonGallery(item, index)}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={emptyComponent()}
        />
      </View>
      {showDelete ? (
        <View style={{position: 'absolute', width: '100%'}}>
          <View style={{marginTop: 10}}>
            <Button
              label={'Delete'}
              textSize={16}
              onPress={() => {
                deleteSalonGallery();
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  renderOuterView: {
    flexDirection: 'row',
    marginTop: width * (10 / 375),

    paddingBottom: 2,
    paddingRight: 2,
    paddingTop: 2,
    paddingLeft: 2,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    //  marginRight: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  image: {
    // borderWidth: 5,
    height: width * (107 / 375),
    width: width * (107 / 375),
    borderRadius: 10,
  },
  addimage: {
    // borderWidth: 5,
    height: width * (11 / 375),
    width: width * (11 / 375),
    borderRadius: 10,
  },
});
