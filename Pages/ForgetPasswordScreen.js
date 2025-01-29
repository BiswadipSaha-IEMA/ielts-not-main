import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import useHttp from "../hooks/useHttp";

export default function ForgetPasswordScreen({ navigation }) {
  const [identifier, setEmail] = useState("");
  const { postRequest } = useHttp();
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    const response = await postRequest("/auth/forget-password", {
      identifier: identifier,
    });
    // console.log(response);
    Alert.alert("Message",response.message);
    if (!response.success) {      
      setError(response.message);
    } else {
      navigation.navigate("GetOTP", { identifier });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/appBg.png")}
        style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <View style={styles.headingContainer}>
          <Text style={[styles.headerText, styles.textCenter]}>
            Forget Password
          </Text>
          {!error && (
            <Text style={[styles.headerSubText, styles.textCenter]}>
              Enter your email or phone number to get OTP and reset password.
            </Text>
          )}
          {/* {error && (
            <Text style={{ color: "red", fontSize: 18, fontWeight: "400" }}>
              {error}
            </Text>
          )} */}
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            label="Email"
            mode="outlined"
            placeholder="Email"
            style={styles.input}
            value={identifier}
            onChangeText={(text) => setEmail(text)}
          />
          {/* {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null} */}
          <Pressable onPress={handleResetPassword} style={styles.button}>
            <Text
              style={[styles.textWhite, styles.submitText, styles.textUpper]}
            >
              Forget Password
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    resizeMode: "cover",
  },
  headingContainer: {
    height: "10%",
    marginTop: "20%",
    gap: 20,
    alignItems: "center",
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
    fontSize: 16,
    fontWeight: "400",
  },
  input: {
    padding: Platform.OS === 'android'? '2.5%' : '3.5%',
    width: "80%",
    borderRadius: 8,
    backgroundColor: "#e0e6f6",
    borderWidth: 2,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.75,
    backgroundColor: "blue",
    paddingHorizontal: "9%",
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
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
