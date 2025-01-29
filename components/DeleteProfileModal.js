import React, { useState } from "react";
import {
  Platform,
  Dimensions,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import useHttp from "../hooks/useHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from "../context/LoginProvider";

const DeleteProfileModal = ({ deleteModalVisible, setDeleteModalVisible }) => {
  const [email, setEmail] = useState("");
  const { deleteRequest } = useHttp();
  const { setIsLoggedIn } = useLogin();
  const [deleteEmail, setDeleteEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  const deleteProfileHandler = async () => {
    try {
      setLoading(true); // Start loading

      const token = await AsyncStorage.getItem("token");

      // Check if deleteEmail exists

      const endpoint = "/auth/delete";

      const response = await deleteRequest(endpoint, { email: deleteEmail }, token);

      if (response && response.success) {
        Alert.alert("Message", response.message);
        await AsyncStorage.clear();
        setIsLoggedIn(false);
        // console.log("Account deleted successfully!");
      } else {
        Alert.alert("Message", response.message);
        //Alert.alert("Email does not exist", "Please provide a valid email address.");
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const closeModal = () => {
    Keyboard.dismiss();
    setDeleteModalVisible(!deleteModalVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={deleteModalVisible}
      onRequestClose={() => {
        setDeleteModalVisible(!deleteModalVisible);
      }}
    >
      <Pressable style={styles.centeredView} onPress={closeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Confirm your email to delete your account.
            </Text>
            <TextInput
              editable
              value={deleteEmail}
              placeholder="Enter email"
              placeholderTextColor="gray"
              onChangeText={setDeleteEmail}
              numberOfLines={1}
              maxLength={40}
              style={{
                backgroundColor: "#e0e6f6",
                borderColor: "black",
                borderWidth: 1,
                width: Dimensions.get("window").width * 0.8,
                padding: Platform.OS === "android" ? "1%" : "3.5%",
                paddingHorizontal: "5%",
                marginBottom: "5%",
                borderRadius: 50,
              }}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={deleteProfileHandler}
            >
              {loading ? ( // Show activity indicator if loading
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.textStyle}>Delete your account!</Text>
              )}
            </Pressable>
          </View>
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
    marginTop: "5%",
  },
  modalView: {
    margin: "5%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: "5.5%",
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
    borderRadius: 20,
    padding: "4%",
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "blue",
  },
  buttonClose: {
    backgroundColor: "#BB3F3F",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: "5%",
    textAlign: "center",
  },
});

export default DeleteProfileModal;
