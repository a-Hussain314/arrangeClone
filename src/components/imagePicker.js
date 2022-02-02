import React, { Component } from "react";
import { openImageSettings, openCameraSettings } from "../assets/utility/openSettings";
import ImagePicker from "react-native-image-crop-picker";

import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';




export const checkPhotoPermission = (multiple = false) => {
    console.log("multiple =>", multiple);
    return (
        check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(response => {
            if (response == RESULTS.BLOCKED) {
                openImageSettings();
                return;
            } else {
                return pickImageHandler(multiple);
                // return selectedImg;
            }
        })
    )
};

export const pickImageHandler = (multiple = false) => {
    return (
        ImagePicker.openPicker({
            mediaType: "photo",
            multiple: true
        }).then(image => {
            if (multiple == true) {
                return image
            } else {
                return [image]
            }

        })
            .catch(err => {
                console.log("the error in image picker is ", err.message);
                return err.message
            })
    )

};

export const checkCameraPermission = () => {
    return (
        check(PERMISSIONS.IOS.CAMERA).then(response => {
            if (response == RESULTS.BLOCKED) {
                openCameraSettings();
                return;
            } else {
                return openCameraPickerView();
                // return selectedImg;
            }
        })
            .catch(error => {
                console.log("the error in camera permission is ", error);
            })
    )
};

export const openCameraPickerView = () => {
    return (
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: false
        })
            .then(image => {
                return [image]
                // console.log('selected image is ', image)
                //  return ImageResizer.createResizedImage(image.path, 400, 400, "JPEG", 50).then(
                //         response => {
                //             return { img: response.uri };
                //         }
                //     );
            })
            .catch(error => {
                console.log("error in open camera", error);
                return error.message
            })
    )
};
