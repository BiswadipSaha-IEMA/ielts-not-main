import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import useHttp from "../hooks/useHttp";

const ResetPasswordScreen = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState();
  const { postRequest } = useHttp();

  const { identifier } = route.params;

  const checkPassword = async () => {

    if(newPassword !== confirmPassword){
      Alert.alert("New password and confirm password do not match.")
    }
    else{ try {
      const response = await postRequest("/auth/change-password", {
        identifier,
        newPassword,
      });
      // console.log(response);
      if (!response.success) {
        Alert.alert("Message", response.message); 
        setError(response.message);
      } else {
        Alert.alert("Message", response.message);
        navigation.navigate("Login");
      }
    } catch (error) {}
  };
}
   
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/appBg.png")}
        style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Reset Password</Text>
          {error && (
            <Text style={[styles.invalidText, { textAlign: "center" }]}>
              {error}
            </Text>
          )}
          <Text style={styles.headerSubText}>
            Your new password must be unique from those previously used.
          </Text>
          <View style={styles.box}>
            <TextInput
              style={styles.input}
              placeholder="Enter New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={checkPassword}>
              <Text style={styles.buttonText}>Reset Password </Text>
            </TouchableOpacity>
            {/* {!error && <Text style={styles.validText}>Passwords match!</Text>}
            {error && (
              <Text style={styles.invalidText}>Passwords don't match!</Text>
            )} */}
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
    padding: '5%',
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
    marginBottom: '3%',
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
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    marginTop: '8%',
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
    paddingHorizontal: '4%',
    paddingVertical: '5%',
    marginTop: 20,
    width: "100%",
  },
  validText: {
    fontSize: 16,
    color: "green",
    marginTop: '6%',
    textAlign: "center",
  },
  invalidText: {
    fontSize: 16,
    color: "red",
    marginTop: '6%',
    textAlign: "center",
  },
});

export default ResetPasswordScreen;
