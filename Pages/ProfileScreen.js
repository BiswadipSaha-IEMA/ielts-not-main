import React, { useEffect, useState } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import {
  View,
  Text,
  StyleSheet,
  Image,

  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import Modal from 'react-native-modal';

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
// Import Permissions module
import useHttp from "../hooks/useHttp";
import Constants from "expo-constants";
import DeleteProfileModal from "../components/DeleteProfileModal";
import ResetPasswordModal from "../components/ResetPasswordModal";

const { domain } = Constants.expoConfig.extra;
const defaultProfilePic = require('../assets/user.png');
function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [imageUri, setImageUri] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const { getRequest, patchRequest, deleteRequest } = useHttp();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await getRequest("/exam/progress", token);
        // console.log("Response", response);
        // console.log(response);
        if (!response.success) {
          throw new Error("Failed to fetch user data");
        }
        const { user } = response;
        setUserData(user);
//console.log(user.profilePhoto)
        // Set the profile picture URI from the fetched user data
        if (user && user.profilePhoto) {
          // Assuming that profilePhoto is the URL of the image
          // console.log(user.profilePhoto)
          setImageUri(`https://ielts-iema.iemamerica.com/${user.profilePhoto}`);
        }

      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const saveImageUri = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const endpoint =
        "https://ielts-iema.iemamerica.com/api/auth/update-profile";

      if (!uri) {
        // console.log("Response", response.message);
        console.error("No image selected");
        return;
      }

      const formData = new FormData();
      formData.append("profilePhoto", {
        uri: uri,
        type: "image/jpeg",
        name: "profilePhoto.jpg",
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      //console.log(response.message);
      // console.log("Status Text:", response.success); 
      const responseText = await response.text();
      // console.log("Response status:", response.status);
      // console.log("Response text:", responseText);

      if (response.ok) {
        // console.log("Response:", response);
        // console.log("Profile Image updated successfully");
        await AsyncStorage.setItem("profileImageUri", uri);
      } else {
        // console.error("Failed to update Profile Picture");
        Alert.alert(
          "Failed to update Profile Picture. Please try again later."
        );
      }
    } catch (error) {
      // console.error("Error Updating Image:", error.message);
      Alert.alert("Error Updating Image. Please try again later.");
    }
  };

  const openImagePicker = async (source) => {
    try {
      let result = null;

      // Check permissions before opening the image picker
      const permissionGranted = await getPermissionAsync();
      if (!permissionGranted) {
        return;
      }

      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else if (source === "library") {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.cancelled) {
        const resizedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 500 } }],
          { compress: 0.5, format: "jpeg" }
        );
        await saveImageUri(resizedImage.uri);
        setImageUri(resizedImage.uri);
      }
    } catch (error) {
      // console.error("Error selecting image:", error.message);
    }
  };

  const resetPassHandler = () => {
    setResetModalVisible(!resetModalVisible);
  };

  const deleteAccountHandler = () => {
    setDeleteModalVisible(!deleteModalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
    Keyboard.dismiss();
  };

  // Function to request camera roll permission
  const getPermissionAsync = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant camera roll permission to access images.');
        return false;
      }
      return true;
    } catch (error) {
      // console.error('Error getting permission:', error.message);
      return false;
    }
  };

  return (
    <>
      {loading ? (
        <View style={[styles.display, styles.loaderContainer]}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.display}>
            {userData ? (
              <>
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "flex-start",
                    gap: 25,
                  }}
                >
                  <View style={styles.details}>
                    <Image
                      source={imageUri ? { uri: imageUri } : require("../assets/user.png")}
                      style={styles.image}
                    />
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "white",
                        textShadowColor: "rgba(0, 0, 0, 0.65)",
                        textShadowOffset: { width: 2, height: 2.5 },
                        textShadowRadius: 2,
                      }}
                    >
                      Hii, {userData.name} !
                    </Text>
                    <Pressable
                      style={{
                        backgroundColor: "white",
                        padding: "3.5%",
                        paddingHorizontal: "4%",
                        borderRadius: 50,
                        borderColor: "blue",
                        borderWidth: 1.5,
                      }}
                      onPress={() => {
                        Alert.alert(
                          "Choose Image Source",
                          "Please select the source to choose your profile picture from:",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Gallery",
                              onPress: () => openImagePicker("library"),
                            },
                            {
                              text: "Camera",
                              onPress: () => openImagePicker("camera"),
                            },
                          ]
                        );
                      }}
                    >
                      <Text style={{ color: "blue", fontWeight: 700 }}>
                        Change Profile Picture
                      </Text>
                    </Pressable>


                  </View>

                  <View style={{ margin: "5%", marginBottom: "0%" }}>
                    <View style={styles.field}>
                      <Text style={styles.label}>Email</Text>
                      <Text style={[{ fontSize: 16 }, styles.data]}>
                        {userData.email}
                      </Text>
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>Mobile Number</Text>
                      <Text
                        style={[{ fontSize: 16, elevation: 4 }, styles.data]}
                      >
                        {userData.mobileNumber}
                      </Text>
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>Department</Text>
                      <Text style={[{ fontSize: 16 }, styles.data]}>
                        {userData.department}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Pressable
                      style={{
                        backgroundColor: "#fff",
                        padding: "3%",
                        paddingHorizontal: "4%",
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: "blue",
                        elevation: 4,
                        shadowColor: "black",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                      }}
                      onPress={resetPassHandler}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "blue",
                        }}
                      >
                        Reset Password
                      </Text>
                    </Pressable>
                    <Pressable
                      style={{
                        backgroundColor: "#BB3F3F",
                        padding: "3%",
                        paddingHorizontal: "4%",
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: "#BB3F3F",
                        elevation: 5,
                        shadowColor: "black",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                      }}
                      onPress={deleteAccountHandler}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        Delete Account
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </>
            ) : (
              <Text>No user data found</Text>
            )}

            <DeleteProfileModal
              setDeleteModalVisible={setDeleteModalVisible}
              deleteModalVisible={deleteModalVisible}
            />
            <ResetPasswordModal
              setResetModalVisible={setResetModalVisible}
              resetModalVisible={resetModalVisible}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  display: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: "2%",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 2,
  },
  details: {
    alignItems: "center",
    gap: 15,
    backgroundColor: "#a5b7f2",
    padding: "4%",
    borderRadius: 30,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  line: {
    marginVertical: "4%",
    borderColor: "blue",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "1%",
  },
  label: {
    fontWeight: "bold",
    marginRight: "1%",
    color: "blue",
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalButton: {
    backgroundColor: "#fff",
    padding: "5%",
    borderRadius: 10,
    marginBottom: "5%",
    width: "80%",
    borderRadius: 50,
    alignItems: "center",
  },
  modalButtonText: {
    color: "blue",
    fontWeight: 600,
    fontSize: 16,
  },
  field: {
    width: "100%",
    marginBottom: "8%",
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "blue",
    paddingVertical: "3.5%",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    color: "blue",
    backgroundColor: "white",
    fontSize: 12,
    paddingHorizontal: "1.5%",
  },
  data: {
    fontSize: 17,
    left: 10,
  },
  loaderContainer: {
    justifyContent: "center",
  },
});
