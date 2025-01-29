import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import useHttp from "../hooks/useHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExam } from "../context/ExamProvider";
import Audio from "../components/PassageAudioComponent";
import AudioPlayer from "../components/Audio";

const PassageScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const [passage, setPassage] = useState();
  const { module, level } = useExam();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch passage data when the component mounts
    fetchPassage();
  }, [route.params.passage]);

  const fetchPassage = async () => {
    setLoading(true); // Set loading state to true while fetching data
    // Fetch passage data here
    setPassage(route.params.passage); // Set passage state with fetched data
    setLoading(false); // Set loading state to false after fetching data
  };

  const { height: windowHeight } = Dimensions.get("window");

  return (
    <>
      <ScrollView style={styles.passageContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View
            style={{
              flex: 1,
              height: (windowHeight * 72) / 100,
            }}
          >
            {passage && passage.includes(".mp3") ? (
              <>
                <Text style={styles.question}>
                  Hear the audio carefully and answer the questions that follow:
                </Text>
                <Text style={{ marginTop: "1%", fontSize: 15 }}>
                  {"\n"}(Note: Audio might take a few seconds to load. Please
                  hold patience.)
                </Text>
              </>
            ) : (
              <Text style={styles.question}>
                Read the passage carefully and answer the questions that follow:
              </Text>
            )}
            {passage && passage.includes(".mp3") ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    padding: "5%",
                    borderWidth: 2,
                    borderRadius: 8,
                    borderColor: "rgba(0,0,0,0.15)",
                    backgroundColor: "#FAF7FF",
                  }}
                >
                  <AudioPlayer
                    key={1}
                    source={`https://ielts-iema.iemamerica.com${passage}`}
                  />
                </View>
              </View>
            ) : (
              <ScrollView style={{ marginTop: "5%" }}>
                <Text style={styles.passageText}>{passage}</Text>
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>
      {!loading && (
        <Pressable
          style={styles.continueButton}
          onPress={() => {
            navigation.navigate("Test");
          }}
        >
          <Text style={styles.continueText}>Proceed to Test</Text>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  passageContainer: {
    flex: 1,
    margin: "3%",
    padding: "3%",
    backgroundColor: "#fff",
    borderWidth: 3,
    borderRadius: 8,
    borderColor: "#ccc",
    elevation: 8,
    paddingBottom: "5%",
  },
  question: {
    color: "blue",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "justify",
  },
  infoText: {
    fontSize: 16,
    marginBottom: "1%",
    textAlign: "justify",
  },
  passageText: {
    fontSize: 16,
    textAlign: "justify",
  },
  continueButton: {
    padding: "3%",
    backgroundColor: "blue",
    alignSelf: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 4,
    margin: "3%",
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PassageScreen;
