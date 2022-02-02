//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Resumable from 'react-native-resumable';
import {globalImagePath} from '../../constants/globalImagePath';
import {Upload} from 'react-native-tus-client';

import I18n from '../../I18n';

const option = {
  // withCredentials: true,
  chunkNumberParameterName: 'chunk',
  totalSizeParameterName: 'size',
  typeParameterName: 'type',
  fileNameParameterName: 'video',
  // relativePathParameterName: 'md5', // relativePath as md5 for server
  totalChunksParameterName: 'chunks',
  // target: BASEURL + apiName.addVideo,
  target: 'https://qpayport.devtechnosys.info/api/testingVideosUpload',
  fileParameterName: 'file',
  // query: {
  //   'page_id': page_id,
  //   'title': title,
  //   'video': videoFile,
  //   'category': category,
  //   'user_group': user_group,
  //   'page_ids': page_ids,
  //   'description': description,
  //   'gender': gender,
  //   'min_age': min_age,
  //   'max_age': max_age,
  //   'status': status,
  // },
  testChunks: false,
  chunkSize: 1024 * 1024,
  forceChunkSize: true,
  simultaneousUploads: 5,
  maxChunkRetries: 3,
  chunkRetryInterval: 500,
  allowDuplicateUploads: true,
  xhrTimeout: 30 * 1000,
  testMethod: 'POST',
  uploadMethod: 'POST',
  //headers: headers,
};

// create a component
const FileUpload = () => {
  const pickSingleImageHandler = async () => {
    ImagePicker.showImagePicker(
      {title: 'Pick an Image', maxWidth: 800, maxHeight: 600},
      async (res) => {
        if (res.didCancel) {
        } else if (res.error) {
        } else {
          console.log('img uri ==> ', res.uri);

          let body = new FormData();
          body.append('image', {
            uri: res.uri,
            name: 'avatar.png',
            filename: 'avatar.png',
            type: 'image/png',
          });

          var r = new Resumable({
            // withCredentials: true,
            chunkNumberParameterName: 'chunk',
            totalSizeParameterName: 'size',
            typeParameterName: 'type',
            fileNameParameterName: 'video',
            // relativePathParameterName: 'md5', // relativePath as md5 for server
            totalChunksParameterName: 'chunks',
            // target: BASEURL + apiName.addVideo,
            target:
              'https://qpayport.devtechnosys.info/api/testingVideosUpload',
            fileParameterName: 'file',
            query: {
              title: 'testing',
              file: body,
            },
            testChunks: false,
            chunkSize: 1024 * 1024,
            forceChunkSize: true,
            simultaneousUploads: 5,
            maxChunkRetries: 3,
            chunkRetryInterval: 500,
            allowDuplicateUploads: true,
            xhrTimeout: 30 * 1000,
            testMethod: 'POST',
            uploadMethod: 'POST',
            //headers: headers,
          });
          r.on('fileAdded', (file, event) => {
            console.log('fileAdded', file);
            r.upload();
          });

          r.on('fileSuccess', (file, message) => {
            console.log('fileSuccess', file);
            closeFileBlob();
          });

          r.on('error', (message, file) => {
            console.log('error', file);
            console.log('error', message);
            closeFileBlob();
          });
          r.on('timeout', (message, file) => {
            console.log('timeout', message);
            closeFileBlob();
          });

          r.on('fileProgress', (file, message) => {
            console.log('fileProgress', file);
            console.log('message fileProgress', message);
            const progress = file.progress();
            console.log(progress);
          });

          var blob = await fetch(res.uri).then((res) => res.blob()); // convert native file to blob
          console.log('blob = ', blob);
          blob.name = blob._data.name;
          //const md5 = await RNFS.hash(res.uri, 'md5')
          //blob.relativePath = md5 // relativePath as md5
          r.addFile(blob);

          const closeFileBlob = () => {
            console.log('blob = ', blob);
            if (blob instanceof Blob) {
              try {
                blob.close(); // close blob destroy memory
              } catch (error) {
                console.warn('close blob error', error);
              }
            }
          };

          // var resumable = new Resumable({
          //   chunkSize: 1 * 1024 * 1024, // 1MB
          //   simultaneousUploads: 3,
          //   testChunks: false,
          //   throttleProgressCallbacks: 1,
          //   target:
          //     'https://qpayport.devtechnosys.info/api/testingVideosUpload',
          //   // Append token to the request - required for web routes
          //   query: {
          //     title: 'saurabh',
          //     file: body,
          //   },
          // });

          // // Handle file add event
          // resumable.on('fileAdded', function (file) {
          //   console.log('fileAdded');
          //   // resumable.upload();
          // });
          // resumable.on('fileSuccess', function (file, message) {
          //   console.log('fileSuccess ==> ', JSON.parse(message).name);
          //   console.log(message);
          // });
          // resumable.on('fileError', function (file, message) {
          //   console.log(message);
          //   file.close(); // close blob destroy memory
          // });
          // resumable.on('fileProgress', function (file, message) {
          //   console.log('fileProgress == ', message);
          //   console.log(file.progress());
          // });

          // // r.on('fileAdded', function (file, event) {
          // //   console.log(' file ==> ', file, ' event ==> ', event);

          // //   console.log('fileAdded');
          // // });
          // // r.on('fileProgress', function (file, message) {
          // //   console.log(file.progress());
          // // });
          // // r.on('fileSuccess', function (file, message) {
          // //   console.log(message);
          // // });
          // // r.on('fileError', function (file, message) {
          // //   console.log(message);
          // //   file.close(); // close blob destroy memory
          // // });

          // // get native file for example via react-native-syan-image-picker react-native-document-picker
          // // fetch(file.uri).then((res) => {
          // //   const blob = res.blob(); // convert native file to blob
          // //   r.addFile(blob);
          // //   r.upload();
          // // });

          // fetch(res.uri).then((ress) => {
          //   console.log(' bold result ==> ', ress);

          //   const blob = ress.blob(); // convert native file to blob
          //   console.log(' blod data == ', blob);
          //   console.log('blob name == ', blob._W._data.name);
          //   blob.name = blob._W._data.name;
          //   resumable.addFile(blob);

          //   setTimeout(() => {
          //     try {
          //       resumable.upload();
          //       console.log('is upload ==> ', resumable.isUploading());
          //     } catch (e) {
          //       console.log(e);
          //     }
          //   }, 5000);
          // });
        }
      },
    );
  };

  const tusFileUpload = () => {
    new Promise((resolve, reject) => {
      ImagePicker.showImagePicker({}, ({uri, error, path}) => {
        return uri ? resolve(path || uri) : reject(error || null);
      });
    })
      .then((file) => {
        console.log('image file ==> ', file);
        const upload = new Upload(file, {
          endpoint:
            'https://qpayport.devtechnosys.info/api/testingVideosUpload', // use your tus server endpoint instead
          onError: (error) => console.log('error', error),
          onSuccess: () => {
            console.log('Upload completed. File url:', upload.url);
          },
          onProgress: (uploaded, total) =>
            console.log(`Progress: ${((uploaded / total) * 100) | 0}%`),
        });
        upload.start();
      })
      .catch((e) => console.log('error', e));
  };

  return (
    <View style={styles.container}>
      <Text>FileUpload</Text>
      <TouchableOpacity
        onPress={() => {
          pickSingleImageHandler();
        }}
        style={{flexDirection: 'row', height: 50, alignItems: 'center'}}>
        <Text
          style={{
            borderRadius: 5,
            //  paddingHorizontal: 15,
            color: 'rgb(183,190,197)',
            fontSize: 14,
            flex: 1,
          }}>
          Image upload Resumable
        </Text>
        <Image
          source={globalImagePath.upload}
          resizeMode="cover"
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          tusFileUpload();
        }}
        style={{flexDirection: 'row', height: 50, alignItems: 'center'}}>
        <Text
          style={{
            borderRadius: 5,
            //  paddingHorizontal: 15,
            color: 'rgb(183,190,197)',
            fontSize: 14,
            flex: 1,
          }}>
          Image upload Tus client
        </Text>
        <Image
          source={globalImagePath.upload}
          resizeMode="cover"
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default FileUpload;
