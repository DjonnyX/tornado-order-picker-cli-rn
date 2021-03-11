import React from "react";
import {
  createStackNavigator,
} from "@react-navigation/stack";

import { LoadingScreen } from "../screens/LoadingScreen";
import { IntroScreen } from "../screens/IntroScreen";
import { MainNavigationScreenTypes } from "./MainNavigationScreenTypes";
import { MenuScreen } from "../screens/MenuScreen";
import { ConfirmationOrderScreen } from "../screens/ConfirmationOrderScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { PayStatusScreen } from "../screens/PayStatusScreen";
import { PayConfirmationScreenScreen } from "../screens/PayConfirmationScreen";

const Stack = createStackNavigator();

export const MainNavigationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={MainNavigationScreenTypes.AUTH}
      headerMode="none"
      screenOptions={{}}
    >
      <Stack.Screen
        name={MainNavigationScreenTypes.AUTH}
        component={AuthScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.LOADING}
        component={LoadingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.INTRO}
        component={IntroScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.MENU}
        component={MenuScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.CONFIRMATION_ORDER}
        component={ConfirmationOrderScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.PAY_STATUS}
        component={PayStatusScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.PAY_CONFIRMATION}
        component={PayConfirmationScreenScreen}
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}