import React, { useState } from "react";
import {
  Alert,
  Platform,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import useHttp from "../hooks/useHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from "../context/LoginProvider";

const ResetPasswordModal = ({ resetModalVisible, setResetModalVisible }) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const { patchRequest } = useHttp();
  const { setIsLoggedIn } = useLogin();
  const [error, setError] = useState("");

  const resetPasswordHandler = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await patchRequest(
      "/auth/reset-password",
      { oldPassword: oldPass, newPassword: newPass },
      token
    );
    //console.log(response)
    if (!response.success) {
      Alert.alert("Message", response.error);
      setError(response.message);
    } else {
      Alert.alert("Message", response.message);
      setOldPass("");
      setNewPass("");
      setResetModalVisible(!resetModalVisible);
      setIsLoggedIn(false);
    }
  };

  const closeModal = () => {
    Keyboard.dismiss();
    setResetModalVisible(!resetModalVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={resetModalVisible}
      onRequestClose={() => {
        setResetModalVisible(!resetModalVisible);
      }}
    >
      <Pressable style={styles.centeredView} onPress={closeModal}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Confirm your email to delete your account.
          </Text>
          <Text style={{ marginVertical: 5 }}>Enter your old password</Text>
          <TextInput
            editable
            placeholder="Enter old password"
            placeholderTextColor='gray'
            value={oldPass}
            onChangeText={(e) => setOldPass(e)}
            numberOfLines={1}
            maxLength={40}
            style={styles.input}
          />
          <Text style={{ marginVertical: 5 }}>Enter your new password</Text>
          <TextInput
            editable
            placeholder="Enter new password"
            placeholderTextColor='gray'
            value={newPass}
            onChangeText={(e) => setNewPass(e)}
            numberOfLines={1}
            maxLength={40}
            style={styles.input}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={resetPasswordHandler}
          >
            <Text style={styles.textStyle}>Reset Password!</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: '5%',
  },
  modalView: {
    margin: '5%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: '5.5%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 50,
    padding: '4%',
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "blue",
  },
  buttonClose: {
    backgroundColor: "blue",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: '5%',
    textAlign: "center",
  },
  input: {
    backgroundColor: "#e0e6f6",
    borderColor: "black",
    borderWidth: 1,
    width: Dimensions.get('window').width * 0.8,
    padding: Platform.OS === 'android'? '1%' : '3.5%',
    paddingHorizontal: '5%',
    marginBottom: '5%',
    borderRadius: 50,
  },
});

export default ResetPasswordModal;
