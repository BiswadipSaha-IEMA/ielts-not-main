import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CountDown from "react-native-countdown-fixed";
import { useExam } from "../context/ExamProvider";

const Timer = ({ time }) => {
  const [currentTime, setCurrentTime] = useState();
  const { setIsTestRunning } = useExam();

  const handleTestFinish = () => {
    setIsTestRunning((prev) => {
      prev = !prev;
    });
  };
  return (
    <View style={{ flexDirection: "row" }}>
      <CountDown
        until={time * 60}
        onFinish={handleTestFinish}
        onChange={(time) => {
          setCurrentTime(time);
        }}
        size={20}
        digitStyle={{
          backgroundColor: "#FFF",
          borderWidth: 2,
          borderColor: "blue",
        }}
        digitTxtStyle={{ color: "blue", fontSize: 16, fontWeight: "900" }}
        timeToShow={["M", "S"]}
        timeLabels={{ m: "", s: "" }}
        showSeparator
        separatorStyle={{ color: "blue" }}
      />
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  timer: {},
  timerText: {},
});
