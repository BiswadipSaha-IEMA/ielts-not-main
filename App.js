import "react-native-gesture-handler";
import React from "react";
import LoginProvider from "./context/LoginProvider";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./routes";
import { StatusBar } from "expo-status-bar";

const App = () => {
  return (
    <>
      <StatusBar style="auto" backgroundColor="#fff" />
      <LoginProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </LoginProvider>
    </>
  );
};

export default App;
