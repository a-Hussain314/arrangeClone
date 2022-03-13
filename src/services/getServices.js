//***** import libraries */
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

//***** common url for calling webservices */
// const URL = 'https://35.208.113.133:17345/webservice/user/';
// const URL = "https://arrange-api.herokuapp.com/webservice/user/";
// const URL = "http://App.arrange.sa:8082/webservice/user/";
const URL = "http://195.201.194.86:8082/webservice/user/"
//***** common function for get services */
export const getService = async (urlAction, getParams) => {
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

  let headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log('ServiceUrl =>', ServiceUrl);
  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: ServiceUrl,
      timeout: 1000 * 60,
      params: getParams,
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
