import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import useHttp from "../hooks/useHttp";

const OtpScreen = ({ navigation, route }) => {
  const [userInput, setUserInput] = useState("");
  const [isValid, setIsValid] = useState(null);
  const { postRequest } = useHttp();
  const { identifier } = route.params;
  const [error, setError] = useState();

  const validateOtp = async () => {
    try {
      const response = await postRequest("/auth/verify-otp", {
        identifier,
        otpCode: userInput,
      });
      if (!response.success) {
        setError(response.message);
      } else {
        navigation.navigate("ResetPassword", { identifier });
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/appBg.png")}
        style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>OTP Verfication</Text>
          {error && (
            <Text style={[styles.invalidText, { textAlign: "center" }]}>
              {error}
            </Text>
          )}
          <Text style={styles.headerSubText}>
            Enter the verification code we just sent on {identifier}.
          </Text>
          <View style={styles.box}>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={userInput}
              onChangeText={setUserInput}
            />
            <TouchableOpacity style={styles.button} onPress={validateOtp}>
              <Text style={styles.buttonText}>Validate OTP </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    resizeMode: "cover",
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "20%",
  },
  box: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    marginBottom: "2%",
    color: "blue",
    fontWeight: "700",
    fontSize: 24,
    textTransform: "uppercase",
  },
  headerSubText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginHorizontal: "10%",
    gap: 10,
    marginBottom: "8%",
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 10,
    //width: Dimensions.get("window").width * 0.75,
    //paddingHorizontal: "9%",
    //paddingVertical: "5%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "blue",
    backgroundColor: "#e0e6f6",
    borderRadius: 5,
    paddingHorizontal: '3%',
    paddingVertical: '5%',
    marginTop: '5%',
    width: "100%",
  },
  validText: {
    fontSize: 20,
    color: "green",
    marginTop: '5%',
  },
  invalidText: {
    fontSize: 20,
    color: "red",
    marginVertical: "2%",
  },
});

export default OtpScreen;
