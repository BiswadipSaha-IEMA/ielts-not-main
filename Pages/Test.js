import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useExam } from "../context/ExamProvider";

function Test({
  level,
  enabled,
  numberOfQuestions,
  totalTime,
  loading,
  module,
}) {
  const { setIsTestRunning, setLevel, setModule } = useExam();
  const lockTestAlert = () => {
    if (!enabled) {
      Alert.alert(
        "Locked!",
        "Please complete previous modules to give this test.",
        [
          {
            text: "Okay",
            onPress: () => {
              style: "destructive";
            },
          },
        ]
      );
    }
  };
  const handleTestPress = () => {
    if (enabled) {
      setLevel(level);
      setModule(module);
      setIsTestRunning(true);
    } else {
      lockTestAlert();
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.test}>
      <View style={[styles.level, !enabled && styles.levelLocked]}>
        <Text style={styles.levelHeading}>Level {level}</Text>
        {!enabled && (
          <Ionicons name="lock-closed-outline" size={22} color="#001AA1" />
        )}
      </View>
      <View style={styles.cardAdvance}>
        <View style={styles.cardAdvanceContent}>
          <View style={styles.cardAdvanceContentHeading}>
            <View style={styles.cardAdvanceContentHeadingLeft}>
              <Ionicons
                name="reader-outline"
                size={20}
                color="white"
                style={{
                  backgroundColor: "blue",
                  borderRadius: 50,
                  padding: 8,
                }}
              />
              <View style={styles.cardAdvanceContentHeadingText}>
                <Text style={styles.cardAdvanceContentHeadingTextHead}>
                  Level {level}
                </Text>
                <Text style={styles.cardAdvanceContentHeadingTextBody}>
                  ASSESSMENT
                </Text>
              </View>
            </View>
            {!enabled && (
              <Ionicons name="lock-closed-outline" size={22} color="#001AA1" />
            )}
          </View>
          <View style={styles.cardAdvanceActivity}>
            <View style={styles.cardContentParts}>
              <Ionicons name="calendar-clear-outline" size={16} color="gray" />
              <Text>{numberOfQuestions}</Text>
            </View>
            <View style={styles.cardContentParts}>
              <Ionicons name="time-outline" size={16} color="gray" />
              <Text>{totalTime}</Text>
            </View>
          </View>
        </View>
        <Pressable
          style={[styles.button, { padding: 10 }]}
          onPress={
            enabled
              ? () => handleTestPress()
              : () => {
                  Alert.alert(
                    "Locked",
                    "You either have uncompleted modules or have already taken the test"
                  );
                }
          }
          android_ripple={{ color: "#839efc" }}
        >
          <View style={styles.testButton}>
            <Text style={{ color: "white", fontWeight: 500 }}>
              {enabled ? "Take Test" : "Locked"}
            </Text>
            {!enabled && (
              <Ionicons name="lock-closed-outline" size={18} color="white" />
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}
export default Test;
const styles = StyleSheet.create({
  test: { flex: 1 },
  level: {
    alignItems: "center",
    justifyContent: "center",
    margin: '3%',
  },
  levelLocked: {
    flexDirection: "row",
  },
  levelHeading: {
    fontSize: 15,
    color: "blue",
    fontSize: 20,
    fontWeight: "700",
  },
  cardAdvance: {
    width: "100%",
    backgroundColor: "#e0edff",
    gap: 10,
    padding: '5%',
    marginBottom: '5%',
    borderRadius: 10,
    elevation: 4,
  },
  cardAdvanceContent: {
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  cardAdvanceContentHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardAdvanceContentHeadingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: '5%',
  },
  cardAdvanceContentHeadingText: {
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardAdvanceContentHeadingTextHead: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
  },
  cardAdvanceContentHeadingTextBody: {
    color: "blue",
    fontSize: 12,
    fontWeight: "400",
  },
  cardAdvanceActivity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "blue",
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: '5%',
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  buttonLocked: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonUnlocked: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  testButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  cardContentParts: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
});
