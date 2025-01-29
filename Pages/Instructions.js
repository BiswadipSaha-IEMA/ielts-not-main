import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import React from "react";

const Instructions = ({ modalVisible, setModalVisible, instructions }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Instructions:</Text>
          <ScrollView style={styles.listContainer}>
            {instructions &&
              instructions.map((instruction, index) => {
                return <Text key={index} style={styles.item}>► {instruction}</Text>;
              })}
          </ScrollView>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Proceed to test</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Instructions;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? "6%" : "5%",

    // marginTop: Dimensions.get("window").height > 700 && 10,
  },
  modalView: {
    height: Platform.OS === "ios" ? "75%" : "80%",
    // height: Dimensions.get("window").height < 700 ? "90%" : "80%",
    width: Platform.OS === "ios" ? "85%" : "80%",
    margin: "5%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: "7%",
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
    backgroundColor: "blue",
    marginTop: "auto",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: "6%",
  },
  listContainer: {
    marginLeft: "4%",
    marginBottom: "3%",
  },
  item: {
    fontSize: Dimensions.get("window").height > 850 ? 18 : 16,
    marginBottom: 16,
  },
});
