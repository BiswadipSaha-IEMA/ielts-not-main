import { Formik, Field } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLogin } from "../context/LoginProvider";
import Icon from "react-native-vector-icons/FontAwesome";
import Svg, { Image, err } from "react-native-svg";
import useHttp from "../hooks/useHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { usePost } from "../hooks/useHttp";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function LoginScreen({ navigation }) {
  const { setIsLoggedIn, isLoggedIn } = useLogin();
  const [error, setError] = useState("");
  const { postRequest } = useHttp();
  const [isLoading, setIsLoading]= useState(false)

  async function submitHandler(values) {
    setIsLoading(true)
    try {
      const endpoint = "/auth/login"; // Endpoint to send the request
      

      const response = await postRequest(endpoint, values); 
      //console.log("Response:", response);
      // Call postRequest with the endpoint
      if (response.success) {
        // If response.success is true, set token in AsyncStorage
        await AsyncStorage.setItem("token", response.token);

        // Update state or do whatever you want with the response
        setIsLoggedIn(true);
        
      } else {
        // Handle error if success key is not true
        Alert.alert("Message", response.message);
        console.error("Signup failed:", response.error); // Assuming there's an error key in the response
        // You can set an error state or show an error message to the user
        //console.log("Response:");
      }
    } catch (error) {
      Alert.alert("Message", "Network error, check your internet connection.");
      console.error("Error while signing up:", error.message);
      // Handle other errors such as network errors
    }
    finally{
      setIsLoading(false)
    }
  }

  function forgotPassHandler() {
    //Alert.alert("Pass Change");
    navigation.navigate("ForgetPassword");
  }
  function SignupHandler() {
    //Alert.alert("Pass Change");
    navigation.navigate("Signup");
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/appBg.png")}
            style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <View style={styles.headingContainer}>
              <Text style={[styles.headerText, styles.textCenter]}>
                Login Here
              </Text>
              <Text style={[styles.headerSubText, styles.textCenter]}>
                Welcome Back!
              </Text>
              <Text style={[styles.headerSubText, styles.textCenter]}>
                You've been missed
              </Text>
              {error && (
                <Text style={[styles.errorText, styles.textCenter]}>
                  {error}
                </Text>
              )}
            </View>
            <ScrollView contentContainerStyle={styles.outerFormContainer}>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <View style={{ gap: 20, alignItems: "center" }}>
                  <Pressable
                    style={styles.forgotPassBtn}
                    onPress={forgotPassHandler}
                  >
                    <Text style={[styles.textBlue, styles.submitText]}>
                      Forgot your password?
                    </Text>
                  </Pressable>
                  <Pressable style={styles.registerBtn} onPress={handleSubmit}>
                    <Text
                      style={[
                        styles.textWhite,
                        styles.submitText,
                        styles.textUpper,
                      ]}
                    >
                      {
                        isLoading
                         ? "Logging..."
                          : "Login"
                      }
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.createAccount}
                    onPress={SignupHandler}
                  >
                    <Text style={[styles.textGray, styles.submitText]}>
                      Create new account
                    </Text>
                  </Pressable>
                  {/* <Text style={[styles.textBlue, styles.submitText]}>
                    Or continue with
                  </Text>
                  <View style={styles.iconContainer}>
                    <Icon
                      name="google"
                      size={24}
                      color="#000000"
                      style={styles.icon}
                      onPress={() => {}}
                    />
                    <Icon
                      name="facebook"
                      size={24}
                      color="#000000"
                      style={styles.icon}
                      onPress={() => {}}
                    />
                  </View> */}
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
      )}
    </Formik>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    resizeMode: "cover",
  },
  headingContainer: {
    height: "10%",
    marginTop: "20%",
    gap: 10,
  },
  outerFormContainer: {
    flex: 1,
    paddingHorizontal: "2%",
    marginTop: "15%",
    gap: 10,
  },
  formContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: "80%",
    width: "100%",
    gap: 20,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 30,
  },
  headerText: {
    color: "blue",
    fontWeight: "700",
    fontSize: 24,
    textTransform: "uppercase",
  },
  textCenter: {
    textAlign: "center",
  },
  headerSubText: {
    fontSize: 18,
    fontWeight: 600,
  },
  input: {
    padding: Platform.OS === 'android'? '2.5%' : '3.5%',
    width: "80%",
    borderRadius: 8,
    backgroundColor: "#e0e6f6",
    borderWidth: 2,
    borderColor: "blue",
  },
  picker: {
    color: "gray",
    borderRadius: 8,
    backgroundColor: "#e0e6f6",
  },
  registerBtn: {
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.75,
    backgroundColor: "blue",
    paddingHorizontal: "8%",
    paddingVertical: "5%",
  },
  textWhite: {
    color: "white",
  },
  submitText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  textUpper: {
    textTransform: "uppercase",
  },
  textBlue: {
    color: "blue",
  },
  textGray: {
    color: "gray",
  },
  forgotPassBtn: {
    fontStyle: "italic",
  },
  errorText: {
    color: "red",
    // marginTop: 5,
  },
  icon: {
    backgroundColor: "#ccc",
    padding: "3%",
    width: 60,
    borderRadius: 8,
    textAlign: "center",
  },
  svgContainer: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#000",
  },
  bottomLeft: {
    left: 0,
    bottom: 0,
  },
  topRight: {
    right: 0,
    top: 0,
  },
});
