import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import ModuleCard from "../components/ModuleCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useHttp from "../hooks/useHttp";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState();
  const [loading, setLoading] = useState(true);
  const { getRequest } = useHttp();
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await getRequest(`/exam/progress`, token);
        setProgress(response);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchProgress();
    setLoading(false);

    return () => {
      // Cleanup if needed
    };
  }, []);
  const propsList = [
    {
      title: "Reading",
      icon: "book",
      locked: false,
      completed: progress?.progress?.module1?.isCompleted ? true : false,
      modalVisible: modalVisible,
      setModalVisible: setModalVisible,
      module: 1,
      level: 1,
    },
    {
      title: "Listening",
      icon: "hard-of-hearing",
      locked:
        progress?.progress?.module1?.level2?.isLevelCompleted ? false
          : true,
      completed: !progress?.progress?.module2?.isCompleted
        ? false
        : true,
      // locked: false,
      modalVisible: modalVisible,
      setModalVisible: setModalVisible,
      module: 2,
      level: 1,
    },
    {
      title: "Writing",
      icon: "pencil-square-o",
      locked:
        progress?.progress?.module2?.level2?.isLevelCompleted ? false
          : true,
      completed: !progress?.progress?.module3?.isCompleted
        ? false
        : true,
      modalVisible: modalVisible,
      setModalVisible: setModalVisible,
      module: 3,
      level: 1,
    },
    {
      title: "Speaking",
      icon: "microphone",
      locked:
        progress?.progress?.module3?.level2?.isLevelCompleted ? false
          : true,
      completed: !progress?.progress?.module4?.isCompleted
        ? false
        : true,
      modalVisible: modalVisible,
      setModalVisible: setModalVisible,
      module: 4,
      level: 1,
    },
  ];
  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={{ flex: 1 }}>
      {propsList.map((props) => {
        return <ModuleCard {...props} key={props.title} />;
      })}
    </View>
  );
};

export default HomeScreen;
