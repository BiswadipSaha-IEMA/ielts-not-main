import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import LoginScreen from "../Pages/LoginScreen";
import SignupScreen from "../Pages/SignupScreen";
import LandingPageScreen from "../Pages/LandingPageScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import ProgressScreen from "../Pages/ProgressScreen";
import ForgetPasswordScreen from "../Pages/ForgetPasswordScreen";
import OtpScreen from "../Pages/OtpScreen";
import ResetPasswordScreen from "../Pages/ResetPasswordScreen";

const Tab = createBottomTabNavigator();

const getColor = (route, tabName) => {
  const isFocused = useIsFocused();
  return isFocused && route.name === tabName ? "blue" : "#898989"; // Set color to blue if the route is focused, else set it to default color
};

export default function AuthRouter() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        // tabBarStyle: { display: "none" },
      }}
      initialRouteName="LandingPageScreen"
    >
      <Tab.Screen
        name="LandingPageScreen"
        component={LandingPageScreen}
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={({route}) => ({
          tabBarLabel: "Login",
          tabBarIcon: ({ color, size }) => (
            <Icon name="sign-in" size={20} color={getColor(route, "Login")} />
          ),
        })}
      />
      <Tab.Screen
        name="Signup"
        component={SignupScreen}
        options={({route}) => ({
          tabBarLabel: "Sign Up",
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-plus" size={20} color={getColor(route, "Signup")} />
          ),
        })}
      />
      <Tab.Screen
        name="ForgetPassword"
        component={ForgetPasswordScreen}
        options={{
          tabBarButton: () => null,
          tabBarLabel: "Forget Password",
          tabBarVisibile: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tab.Screen
        name="GetOTP"
        component={OtpScreen}
        options={{
          tabBarButton: () => null,
          tabBarLabel: "Get OTP",
          tabBarVisibile: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tab.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          tabBarButton: () => null,
          tabBarVisibile: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />
    </Tab.Navigator>
  );
}
