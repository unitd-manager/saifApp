import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackNav} from '../NavigationKeys';
import AuthStack from './AuthStack';
import AuthContext, {defaultState, reducer, restoreToken} from './Auth';
import HomeTab from '../../containers/tabbar/main/HomeTab';
import BookCourt from '../../containers/tabbar/main/BookCourt';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  React.useEffect(() => {
    restoreToken(dispatch);
  }, []);
  const authContext = React.useMemo(
    () => ({
      signIn: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
    }),
    [],
  );

  if (state.isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
          {state.userToken == null ? ( <Stack.Screen name={StackNav.Auth} component={AuthStack} />) : (
            <>
              <Stack.Screen name={StackNav.MainHome} component={HomeTab} />
              <Stack.Screen name={StackNav.BookCourt} component={BookCourt} />
            </>
            
          )}
    </Stack.Navigator>
    </AuthContext.Provider>
  );
}
