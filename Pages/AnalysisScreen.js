import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AnalysisCard from "../components/AnalysisCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useHttp from "../hooks/useHttp";

const AnalysisScreen = () => {
  const [progress, setProgress] = useState();
  const [loading, setLoading] = useState(true);
  const { getRequest } = useHttp();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await getRequest(`/exam/progress`, token);
        //console.log(response.progress);
        setProgress(response.progress);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
      setLoading(false);
    };

    fetchProgress();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const analysisCardDetails = [
    {
      id: 1,
      name: "Reading",
      bandScore: progress?.module1?.bandScore,
    },
    {
      id: 2,
      name: "Listening",
      bandScore: progress?.module2?.bandScore,
    },
    {
      id: 3,
      name: "Writing",
      bandScore: progress?.module3?.bandScore,
    },
    {
      id: 4,
      name: "Speaking",
      bandScore: progress?.module4?.bandScore,
    },
  ];

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1 }}>
      {analysisCardDetails.map((detail) => {
        return <AnalysisCard detail={detail} key={detail.id} />;
      })}
    </View>
  );
};

export default AnalysisScreen;
