import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import * as Progress from "react-native-progress";
import Test from "../Pages/Test";
import useHttp from "../hooks/useHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExam } from "../context/ExamProvider";
import { useNavigation } from "@react-navigation/native";

function Module() {
  const { getRequest } = useHttp();
  const navigation = useNavigation();
  const [progress, setProgress] = useState();
  const [loading, setLoading] = useState(true);
  const { module, title } = useExam();
  const prevModule = module - 1;
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [text, setText] = useState("0%");
  const [levelInfo, setLevelInfo] = useState({
    level1NumberOfQuestions: 0,
    level2NumberOfQuestions: 0,
    level1Time: 0,
    level2Time: 0,
  });

  const isLevel1Attempted =
    progress?.[`module${module}`].level1?.isLevelCompleted;
  const isLevel2Attempted =
    progress?.[`module${module}`].level2?.isLevelCompleted;

  useEffect(() => {
    if (isLevel2Attempted) {
      setProgressBarValue(1);
      setText("100%");
    } else if (isLevel1Attempted) {
      setProgressBarValue(0.5);
      setText("50%");
    } else {
      setProgressBarValue(0);
      setText("0%");
    }
  }, [isLevel1Attempted, isLevel2Attempted]);

  // Function to check if the previous module's level 2 is completed
  const isPrevModuleLevel2Completed = () => {
    if (prevModule <= 0) {
      const currentModuleProgress = progress?.[`module${module}`];
      // If current module is 1, check if its level 1 is completed
      if (currentModuleProgress.level1?.isLevelCompleted) {
        return false;
      } else {
        return true;
      }
    } else {
      // If not the first module, check if the previous module's level 2 is completed
      const prevModuleProgress = progress?.[`module${prevModule}`];
      const currentModuleProgress = progress?.[`module${module}`];
      return (
        prevModuleProgress?.level2?.isLevelCompleted &&
        !currentModuleProgress.level1.isLevelCompleted
      );
    }
  };

  // Function to check if current module's level 1 is completed and level 2 is not completed
  const isCurrentModuleLevel1Completed = () => {
    const currentModuleProgress = progress?.[`module${module}`];
    return currentModuleProgress?.level1?.isLevelCompleted;
  };

  // Function to check if current module's level 2 is not completed
  const isCurrentModuleLevel2NotCompleted = () => {
    const currentModuleProgress = progress?.[`module${module}`];
    return !currentModuleProgress?.level2?.isLevelCompleted;
  };

  // Function to fetch progress and questions level
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const progressResponse = await getRequest("/exam/progress", token);
      const questionsResponse = await getRequest(
        `/exam/module${module}/level1/questions`,
        token
      );

      setProgress(progressResponse.progress); // Update to set the progress properly
      setLevelInfo({
        level1NumberOfQuestions: questionsResponse?.questions?.length,
        level1Time: questionsResponse?.totaltime,
        level2NumberOfQuestions: questionsResponse?.l2numberofQuestion,
        level2Time: questionsResponse?.l2totalTime,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>{title}</Text>
        </View>
        <View style={styles.level}>
          <Text style={styles.levelText}>{text}</Text>
          <Progress.Bar
            progress={progressBarValue}
            width={Dimensions.get('window').width * 0.8}
            color="#385682"
          />
        </View>
        <Pressable
          style={styles.button}
          onPress={() => {
            navigation.navigate("Analysis");
          }}
          android_ripple={{ color: "#839efc" }}
        >
          <Text style={styles.buttonText}>View Module Analytics</Text>
        </Pressable>
        <View style={styles.line}></View>
        <Test
          level="1"
          module={module}
          navigation={navigation}
          enabled={isPrevModuleLevel2Completed()}
          numberOfQuestions={levelInfo?.level1NumberOfQuestions}
          totalTime={levelInfo?.level1Time}
        />
        <Test
          level="2"
          module={module}
          navigation={navigation}
          enabled={
            isCurrentModuleLevel1Completed() &&
            isCurrentModuleLevel2NotCompleted()
          }
          numberOfQuestions={levelInfo?.level2NumberOfQuestions}
          totalTime={levelInfo?.level2Time}
        />
        <StatusBar style="auto" />
      </ScrollView>
    </View>
  );
}

export default Module;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: "blue",
    fontSize: 28,
    fontWeight: "900",
  },
  level: {
    alignItems: "center",
    gap: 6,
    marginVertical: '4%',
  },
  levelText: {
    fontSize: 15,
    color: "blue",
    fontSize: 15,
    fontWeight: "400",
  },
  line: {
    marginVertical: '3%',
    height: 1,
    width: "100%",
    backgroundColor: "#0e0e0e",
  },
  button: {
    borderColor: "blue",
    paddingVertical: "2.5%",
    paddingHorizontal: "8%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: '2%',
  },
  buttonText: {
    color: "blue",
    fontWeight: "500",
    fontSize: 18,
  },
});
