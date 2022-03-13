//***** import libraries */
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

//***** common url for calling webservices */
// const URL = 'https://thin-skunk-17.loca.lt/webservice/user/';
//const URL = 'http://oppa.devtechnosys.tech/public/api/'; // oppa
// const URL = "https://arrange-api.herokuapp.com/webservice/user/";
// const URL = 'http://app.arrange.sa:8082/webservice/user/';
const URL = "http://195.201.194.86:8082/webservice/user/"

//***** common function for post services */
export const postService = async (urlAction, params) => {
  let ServiceUrl = URL + urlAction;
  let token = '';
  await AsyncStorage.getItem('user', (err1, item1) => {
    var userDetail = JSON.parse(item1);
    if (err1 == null) {
      if (item1 != null) {
        //console.log("userDetail =>", userDetail.token);
        token = userDetail.token;
      }
    }
  });
  //token = "dggdfgd";
  console.log('ServiceUrl ==>', ServiceUrl);
  //console.log('token ==>', token);
  let headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  //console.log("ServiceUrl ==>", headers);
  console.log('🚀 ~ file: postServices.js ~ line 38 ~ ServiceUrl', ServiceUrl);
  return new Promise(function (resolve, reject) {
    axios({
      method: 'post',
      url: ServiceUrl,
      timeout: 1000 * 60,
      data: params,
      headers: headers,
    })
      .then(async (reponse) => {
        resolve(reponse);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
