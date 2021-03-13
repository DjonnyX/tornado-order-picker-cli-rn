import React from "react";
import {
  createStackNavigator,
} from "@react-navigation/stack";

import { LoadingScreen } from "../screens/LoadingScreen";
import { OrdersScreen } from "../screens/OrdersScreen";
import { MainNavigationScreenTypes } from "./MainNavigationScreenTypes";
import { AuthScreen } from "../screens/AuthScreen";

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
        name={MainNavigationScreenTypes.ORDERS}
        component={OrdersScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}