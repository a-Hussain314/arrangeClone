export const loginAction = data => {
  return async function(dispatch) {
    try {
      console.log('enter in loginAction  ', data);
      const response = await userLogin(data);
      console.log('response  ', response);
      //dispatch(setInternetConnection(data));
    } catch (error) {
      console.log('err ', error);
    } finally {
      dispatch(removeAsyncWorkingRequest());
      console.log('finally ');
    }
  };
};
