import { View, Text, StyleSheet, Image, Platform } from "react-native";
import InsetShadow from "react-native-inset-shadow";
import React from "react";

const AnalysisCard = ({ detail }) => {
  return (
    <View style={styles.cardContainer}>
      <InsetShadow containerStyle={styles.container}>
        <View style={styles.cardText}>
          <Text style={styles.moduleNo}>Module {detail.id}</Text>
          <View style={styles.hr} />
          <Text style={styles.moduleText}>{detail.name}</Text>
        </View>
        <View style={{ position: "relative" }}>
          <Image
            source={require("../assets/Bandscore.png")}
            style={{ width: 110, height: 150 }}
          />
          <Text style={styles.bandScore}>{detail.bandScore}</Text>
          <Text style={styles.bandScoreText}>Bandscore</Text>
        </View>
      </InsetShadow>
    </View>
  );
};

export default AnalysisCard;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    gap: 15,
  },
  container: {
    backgroundColor: "rgba(207,212,238, 0.5)",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 8,
    margin: "2%",
    paddingVertical: "2%",
  },
  cardText: {
    marginVertical: "2%",
  },
  moduleNo: {
    textAlign: "left",
    fontWeight: "700",
    fontSize: 18,
    color: "black",
    marginTop: "3%",
  },
  moduleText: {
    textAlign: "left",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: "4%",
    color: "blue",
  },
  hr: {
    borderBottomColor: "rgba(207,212,238, 1)",
    borderBottomWidth: 1,
    marginVertical: 6,
  },
  bandScore: {
    position: "absolute",
    top: Platform.OS === 'android' ? "15%": "20%",
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: "center",
    color: "blue",
    fontSize: 30,
    fontWeight: "900",
  },
  bandScoreText: {
    position: "absolute",
    top: Platform.OS === 'android' ? "40%": "45%",
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
});
