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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Instructions from "./Instructions";
import { useExam } from "../context/ExamProvider";
import useHttp from "../hooks/useHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Layout1({ children }) {
  const navigation = useNavigation();
  const { module, level } = useExam();
  const [modalVisible, setModalVisible] = useState(false);
  const { getRequest } = useHttp();
  const [firstPassage, setFirstPassage] = useState("");
  const [secondPassage, setSecondPassage] = useState("");
  const [instructions, setInstructions] = useState();

  const handleInstructions = async () => {
    await getPassage();
    if (instructions) {
      setModalVisible(true);
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
    setSecondPassage(response.passage2 || "");
  };

  const handlePassage = async () => {
    await getPassage();
    if (firstPassage) {
      navigation.navigate("Passage", { passage: firstPassage });
    }
  };

  const handleSecondPassage = async () => {
    await getPassage();
    if (secondPassage) {
      navigation.navigate("Passage", { passage: secondPassage });
    }
  };

  return (
    <View style={styles.screen}>
      <ImageBackground source={require("../assets/appBg.png")} style={styles.background}>
        <View style={styles.header}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuButton} onPress={handleInstructions}>
              <Icon name="info" size={20} color="#858585" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButtonContainer} onPress={handlePassage}>
              <Icon name="book" size={20} color="#858585" />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.menuButtonContainer} onPress={handleSecondPassage}>
              <Icon name="book" size={20} color="#858585" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity> */}
          </View>
          <Text style={styles.timertxt}>Test Ends In:</Text>
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </ImageBackground>
      <Instructions modalVisible={modalVisible} setModalVisible={setModalVisible} instructions={instructions} />
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
  background: {
    flex: 1,
    backgroundColor: "rgba(245,255,255, 0.6)",
    paddingHorizontal: "2%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  menuButton: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonContainer: {
    position: "relative",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 50,
    width: 60,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 50,
    width: 18,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    paddingBottom: Platform.OS === "ios" ? 8 : 1,
  },
  timertxt: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});