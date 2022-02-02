//const baseApiUrl = 'https://devnode.devtechnosys.tech:17274/api/webservice', // live
//const baseApiUrl = 'http://192.168.1.84:3056/api/webservice', // local

apiVersion = 'api';
const apiUrls = {
  getLanguages: `${baseApiUrl}/languages`,
};
///
const pagesId = {
  termsPage: 'terms__conditions',
  dealsPage: 'deals_terms',
};

export {apiUrls, pagesId};
