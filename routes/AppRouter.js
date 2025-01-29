import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useLogin } from "../context/LoginProvider";
import HomeScreen from "../Pages/HomeScreen";
import ProgressScreen from "../Pages/ProgressScreen";
import Layout from "../Pages/Layout";
import TestLayout from "../Pages/TestLayout";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import TestScreen from "../Pages/TestScreen";
import PassageScreen from "../Pages/PassageScreen";
import AnalysisScreen from "../Pages/AnalysisScreen";
import ProfileScreen from "../Pages/ProfileScreen";
import { useExam } from "../context/ExamProvider";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Module from "../Pages/Module";
import AudioPage from "../Pages/AudioPage";

const Stack = createNativeStackNavigator();

function CustomDrawerContent({ navigation }) {
  const { setIsLoggedIn } = useLogin();
  return (
    <View style={styles.drawerContent}>
      <DrawerContentScrollView>
        <DrawerItem
          style={styles.items}
          label="Home"
          onPress={() => navigation.navigate("Home")}
          icon={() => (
            <Icon name="gears" size={32} color="blue" style={{ flex: 1 / 4 }} />
          )}
          labelStyle={styles.label}
        />
        <DrawerItem
          style={styles.items}
          label="Progress"
          onPress={() => navigation.navigate("Progress")}
          icon={() => (
            <MaterialIcon
              name="checklist-rtl"
              size={36}
              color="blue"
              style={{ flex: 1 / 4 }}
            />
          )}
          labelStyle={styles.label}
        />
        <DrawerItem
          style={styles.items}
          label="Analysis"
          onPress={() => navigation.navigate("Analysis")}
          icon={() => (
            <Icon
              name="line-chart"
              size={32}
              color="blue"
              style={{ flex: 1 / 4 }}
            />
          )}
          labelStyle={styles.label}
        />
        <DrawerItem
          style={styles.items}
          label="Profile"
          onPress={() => navigation.navigate("Profile")}
          icon={() => (
            <Icon name="user" size={32} color="blue" style={{ flex: 1 / 4 }} />
          )}
          labelStyle={styles.label}
        />
        {/* Add more drawer items as needed */}
      </DrawerContentScrollView>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          setIsLoggedIn(false);
        }}
      >
        <Icon name="sign-out" size={20} color="#ffffff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const Drawer = createDrawerNavigator();

const DrawerRouter = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        // header: (props) => <CustomDrawerHeader {...props} />,
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home">
        {() => (
          <Layout>
            <HomeScreen />
          </Layout>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Module">
        {() => (
          <Layout>
            <Module />
          </Layout>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Progress">
        {() => (
          <Layout>
            <ProgressScreen />
          </Layout>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Analysis">
        {() => (
          <Layout>
            <AnalysisScreen />
          </Layout>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Profile">
        {() => (
          <Layout>
            <ProfileScreen />
          </Layout>
        )}
      </Drawer.Screen>
      {/* Add more screens as needed */}
    </Drawer.Navigator>
  );
};

const StackRouter = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Test">
        {() => (
          <TestLayout>
            <TestScreen />
          </TestLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Passage">
        {() => (
          <TestLayout>
            <PassageScreen />
          </TestLayout>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default function AppRouter() {
  // const [loading, setLoading] = useState(false);
  // const { getRequest } = useHttp();
  // const { setIsLoggedIn } = useLogin();
  // checkIsAuthenticated = async () => {
  //   setLoading(true);
  //   const token = await AsyncStorage.getItem("token");
  //   const response = await getRequest("/auth/test", token);
  //   if (!response) {
  //     await AsyncStorage.clear();
  //     setIsLoggedIn(false);
  //   }
  //   return response?.success;
  // };
  // useEffect(() => {
  //   const data = useQuery("checkIsAuthenticated", checkIsAuthenticated, {
  //     refetchInterval: 65000,
  //   });
  //   fetchDataAndLogState();
  // }, []);
  const { isTestRunning } = useExam();
  return <>{isTestRunning ? <StackRouter /> : <DrawerRouter />}</>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  drawerContent: {
    flex: 1,
    backgroundColor: "#e7eafa",
    paddingLeft: "5%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : "15%",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#BB3F3F",
    borderRadius: 8,
    paddingVertical: "4%",
    paddingHorizontal: "2%",
    marginHorizontal: "5%",
    marginBottom: "8%",
    height: "7%",
    justifyContent: "center",
  },
  logoutButtonText: {
    marginLeft: "2%",
    color: "#ffffff",
    fontSize: 18,
  },
  menuButton: {
    paddingLeft: 20,
    backgroundColor: "#ffffff",
    // marginTop: StatusBar.currentHeight,
  },
  items: {
    // marginTop: "20%",
    paddingBottom: "5%",
  },
  label: {
    flex: 1 / 4,
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
    marginLeft: "5%",
  },
});
