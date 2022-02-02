import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {createAction} from '../utils/createAction';
import {sleep} from '../utils/sleep';

export function useAuth() {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_USER':
          return {
            ...state,
            user: {...action.payload},
          };
        case 'REMOVE_USER':
          return {
            ...state,
            user: undefined,
          };
        case 'SET_NOTIFICATION':
          return {
            ...state,
            notifyCount: undefined,
          };
        case 'SET_LOADING':
          return {
            ...state,
            loading: action.payload,
          };
        default:
          return state;
      }
    },
    {
      user: undefined,
      notifyCount: undefined,
      loading: true,
    },
  );
  const auth = React.useMemo(
    () => ({
      login: async (userData) => {
        console.log('userData in hook ==> ', userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch(createAction('SET_USER', userData));
      },
      logout: async () => {
        await AsyncStorage.removeItem('user');
        dispatch(createAction('REMOVE_USER'));
      },
    }),
    [],
  );
  React.useEffect(() => {
    sleep(2000).then(() => {
      AsyncStorage.getItem('user').then((user) => {
        if (user) {
          dispatch(createAction('SET_USER', JSON.parse(user)));
        }
        dispatch(createAction('SET_LOADING', false));
      });
    });
  }, []);
  return {auth, state};
}
