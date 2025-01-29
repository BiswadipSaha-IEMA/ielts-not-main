import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  View,
  ImageBackground,
  Platform,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Instructions from "./Instructions";
import PassageScreen from "./PassageScreen";
import { useExam } from "../context/ExamProvider";
import useHttp from "../hooks/useHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";
function Layout1({ children }) {
  const navigation = useNavigation();
  const { module, level } = useExam();
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const { getRequest } = useHttp();
  const [firstPassage, setFirstPassage] = useState("");
  const [secondPassage, setSecondPassage] = useState("");
  const [instructions, setInstructions] = useState();

  // Function to handle opening the instructions modal
  const handleInstructions = async () => {
    await getPassage();
    if (instructions) {
      setModalVisible(true); // Set modalVisible state to true
    }
  };

  const getPassage = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await getRequest(
      `/exam/module${module}/level${level}/questions`,
      token
    );
    setInstructions(response.instructions);
    setFirstPassage(response.passage);
    if (module === 3) {
      setSecondPassage(response.passage2);
    }
  };

  // Function to navigate to the PassageScreen
  const handlePassage = async () => {
    // Navigate to the passage screen component
    await getPassage();
    if (firstPassage) {
      navigation.navigate("Passage", { passage: firstPassage });
    }
  };
  // Function to navigate to the PassageScreen
  const handleSecondPassage = async () => {
    // Navigate to the passage screen component
    await getPassage();
    if (secondPassage) {
      navigation.navigate("Passage", { passage: secondPassage });
    }
  };

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/appBg.png")}
        style={{
          flex: 1,
          backgroundColor: "rgba(245,255,255, 0.6)",
          paddingHorizontal: "2%",
        }}
      >
        <View style={styles.header}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              gap: module === 3 ? 100 : module === 4 ? 0 : 50,

              marginHorizontal: 20,
              marginVertical: 5,
              marginLeft: module === 3 ? 90 : module === 4 ? 0 : 40,

              justifyContent: "space-evenly",
              width: "80%",
            }}
          >
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleInstructions}
            >
              <Icon
                name="info"
                size={20}
                color="#858585"
                onPress={handleInstructions}
                // Call handleInstructions when info icon is pressed
              />
            </TouchableOpacity>

            {module !== 4 && (
              <>
                <TouchableOpacity
                  style={styles.menuButtonContainer}
                  onPress={handlePassage}
                >
                  <Icon
                    name="book"
                    size={module === 3 ? 18 : 20}
                    color="#858585"
                    style={styles.image}
                    onPress={handlePassage}
                    // Call handleInstructions when info icon is pressed
                  />
                  {module === 3 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>1</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {module === 3 && (
                  <TouchableOpacity
                    style={styles.menuButtonContainer}
                    onPress={handleSecondPassage}
                  >
                    <Icon
                      name="book"
                      size={18}
                      color="#858585"
                      style={styles.image}
                      onPress={handleSecondPassage}
                      // Call handleInstructions when info icon is pressed
                    />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>2</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          <Text style={styles.timertxt}>Test Ends In:</Text>
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </ImageBackground>

      {/* Instructions modal */}
      <Instructions
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        instructions={instructions}
      />
    </View>
  );
}

export default Layout1;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: StatusBar.currentHeight,
    paddingBottom: "5%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuButton: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginVertical: "2%",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton1: {
    paddingright: "2%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginVertical: "2%",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  timertxt: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: "40%",
  },
  menuButtonContainer: {
    position: "relative",
    borderRadius: 8, // Fully rounded
    borderWidth: 1, // Red border
    borderColor: "rgba(0,0,0,0.3)",
    ...Platform.select({
      ios: {
        // Right padding for iOS
        paddingHorizontal: 20,
      },
      android: {
        paddingHorizontal: 22, // Bottom margin for Android
      },
    }),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 50,
    width: 60,
  },
  image: {
    height: 24,
    width: 24,
  },
  badge: {
    position: "absolute",
    top: -5, // Adjust position as needed
    right: -5, // Adjust position as needed
    backgroundColor: "red",
    borderRadius: 50, // Fully rounded
    width: 18,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    ...Platform.select({
      ios: {
        paddingBottom: 8, // Bottom padding for iOS
      },
      android: {
        marginBottom: 1, // Bottom padding for Android
      },
      default: {
        paddingBottom: 10, // Default bottom padding
      },
    }),
  },
});
