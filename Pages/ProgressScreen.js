import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import StepIndicator from "react-native-step-indicator";
import dummyData from "../models/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useHttp from "../hooks/useHttp";
import { TouchableOpacity } from "react-native-gesture-handler";
import useTemplate from "../hooks/use-template";
import { printToFileAsync } from "expo-print"
import { moveAsync } from "expo-file-system"
import { shareAsync } from "expo-sharing"
import Action from "../components/Action";
const stepIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 5,
  stepStrokeCurrentColor: "blue",
  separatorFinishedColor: "blue",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "blue",
  stepIndicatorUnFinishedColor: "#aaaaaa",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: "#000000",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "rgba(255,255,255,0.5)",
  labelColor: "#666666",
  labelSize: 15,
  currentStepLabelColor: "blue",
};

export default function ProgressScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState();
  const { getRequest } = useHttp();
  const [loading, setLoading] = useState(true);
  const [name,setName]=useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const progressResponse = await getRequest("/exam/progress", token);
        //console.log(progressResponse)
        setProgress(progressResponse?.progress);
        setCurrentPage(progressResponse?.progress?.noOfCompletedModule); // Update currentPage after fetching data
        setLoading(false); // Move setLoading(false) here so it's only called after data is fetched
        setName(progressResponse.user.name)
        
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData inside useEffect
  }, []); // Empty dependency array to run the effect only once on component mount

  if (loading) {
    return <ActivityIndicator />;
  }
const generatePdf=async(html)=>{
  const { uri } = await printToFileAsync({ html, height: 710, width: 1000 })
  const renamedUri = `${uri.slice(0, uri.lastIndexOf('/') + 1)}${name.replace(' ', '_')}_Robotics.pdf`
  await moveAsync({
      from: uri,
      to: renamedUri
  })
  await shareAsync(renamedUri)
}

 const handleDownload=()=>{
  generatePdf(html).catch(err => console.log(err))
 }
  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <StepIndicator
          customStyles={stepIndicatorStyles}
          stepCount={dummyData.data.length}
          direction="vertical"
          currentPosition={currentPage}
          labels={dummyData.data.map((item) => item.title)}
        />
      </View>
      <View style={styles.rowItem}>
        <Image
          source={require("../assets/congrats.png")}
          style={styles.congratsImage}
        />
        {currentPage===0 ? <Text style={styles.title}>{`Welcome to IELTS Learning!`}{"\n\n"}{`Complete the modules to get your certificate with your Band Score.`}</Text> :
        <Text style={styles.title}>
          {`Congratulations!!!👏🎉 on completing the ${
            dummyData.data[currentPage - 1]?.title
          } Module`} 
          .{"\n\n"}
          {currentPage <= 3 ? (
            <Text style={[styles.title, { marginTop: 10 }]}>
              Complete the rest of the modules to get your certificate with your
              Band Score.
            </Text>
          ) : (
            <Text style={styles.title}>
              You can download your certificate now!
            </Text>
          )}
        </Text>}
        {currentPage === 4 && (
          <View style={{ marginTop: "auto", marginBottom: "20%" }}>
          <Action name={name} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  stepIndicator: {
    marginVertical: '5%',
    paddingHorizontal: '4%',
  },
  rowItem: {
    flex: 1,
    paddingVertical: '5%',
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 25,
    marginTop: "15%",
  },
  title: {
    fontSize: 16,
    color: "blue",
    paddingVertical: '2%',
    fontWeight: "600",
  },
  congratsImage: {
    width: 200,
    height: 200,
  },
});