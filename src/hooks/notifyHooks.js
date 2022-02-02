// import React from 'react';
// import AsyncStorage from '@react-native-community/async-storage';
// import { createAction } from '../utils/createAction';
// import { sleep } from '../utils/sleep';

// export function useNotify() {
//   const [state, dispatch] = React.useReducer(
//     (state, action) => {
//       switch (action.type) {
//         case 'SET_NOTIFY':
//           return {
//             ...state,
//             notifyCount: { ...action.payload },
//           };

//         default:
//           return state;
//       }
//     },
//     {
//       notifyCount: undefined,
//       loading: true,
//     },
//   );
//   const noti = React.useMemo(
//     () => ({
//       notificationCount: async notifyData => {
//         console.log('userData in hook ==> ', notifyData);
//         await AsyncStorage.setItem('notifyData', JSON.stringify(notifyData));
//         dispatch(createAction('SET_NOTIFY', notifyData));
//       },
//       // logout: async () => {
//       //   await AsyncStorage.removeItem('user');
//       //   dispatch(createAction('REMOVE_USER'));
//       // },

//     }),
//     [],
//   );
//   React.useEffect(() => {
//     sleep(2000).then(() => {
//       AsyncStorage.getItem('notifyData').then(notificationData => {
//         if (notificationData) {
//           dispatch(createAction('SET_NOTIFY', JSON.parse(notificationData)));
//         }
//         dispatch(createAction('SET_LOADING', false));
//       });
//     });
//   }, []);
//   return { noti, state };
// }
