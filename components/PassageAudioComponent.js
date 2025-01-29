import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { tracks } from "./Module3Audios";
import { Audio as ExpoAudio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

let currentlyPlaying = null;
const PassageAudioComponent = ({ id, navigation }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound !== null) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      const { sound } = await ExpoAudio.Sound.createAsync(
        { uri: tracks[id - 1].url },
        { shouldPlay: false }
      );
      setSound(sound);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
          setIsPlaying(status.isPlaying);
          setSliderValue(status.positionMillis / status.durationMillis);
        }
      });
    } catch (error) {
      console.error("Audio Not Found");
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);
  const stopAudio = async () => {
    try {
      if (sound !== null && isPlaying) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  };

  const togglePlayback = async () => {
    if (sound !== null) {
      try {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          if (currentlyPlaying) {
            await currentlyPlaying.pauseAsync();
          }
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
        currentlyPlaying = isPlaying ? null : sound;
      } catch (error) {
        console.error("Error toggling playback:", error);
      }
    }
  };
  const handleSliderChange = async (value) => {
    if (sound !== null) {
      const newPosition = value;
      setPosition(newPosition);
      try {
        await sound.setPositionAsync(newPosition);
        if (!isPlaying) {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } catch (error) {
        Alert.alert("Error setting audio position:", error);
      }
    }
  };

  useEffect(() => {
    loadAudio();
    return () => {
      stopAudio();
    };
  }, [id]);
  const renderAudioControls = () => {
    return (
      <View style={styles.audioControls}>
        <View style={styles.sliderContainer}>
          <Text style={styles.durationText}>{`${Math.floor(
            (position / 1000 / 60) << 0
          )}:${
            Math.floor((position / 1000) % 60) < 10
              ? "0" + Math.floor((position / 1000) % 60)
              : Math.floor((position / 1000) % 60)
          }`}</Text>
          <Slider
            style={styles.slide}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            tapToSeek={true}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="black"
            maximumTrackTintColor="black"
            thumbTintColor="black"
          />
          <Text style={styles.durationText}>{formatTime(duration)}</Text>
        </View>
        <TouchableOpacity onPress={togglePlayback}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={35}
            color="black"
          />
        </TouchableOpacity>
      </View>
    );
  };
  const formatTime = (timeInMilliseconds) => {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${padWithZeroes(minutes)}:${padWithZeroes(seconds)}`;
  };

  const padWithZeroes = (number) => {
    return number < 10 ? `0${number}` : `${number}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlatList data={tracks} keyExtractor={(item) => item.id} />
      </View>
      {renderAudioControls()}
      <Pressable
        style={styles.continueButton}
        onPress={() => {
          navigation.navigate("Test");
          stopAudio();
        }}
      >
        <Text style={styles.continueText}>Proceed to Test</Text>
      </Pressable>
    </View>
  );
};

export default PassageAudioComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  audioControls: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(207,212,238, 0.3)",
    marginTop: "60%",
    borderColor: "blue",
    borderWidth: 1,
    height: 100,
    borderRadius: 6,
    paddingVertical: "5%",
  },
  slide: {
    flex: 1,
  },
  sliderContainer: {
    paddingHorizontal: "3%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  continueButton: {
    padding: "3%",
    backgroundColor: "blue",
    alignSelf: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 4,
    margin: "5%",
    height: 40,
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
