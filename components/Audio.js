import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

let currentSound = null;

const AudioPlayer = ({ source }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(source);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        setLoading(true);
    
        const response = await fetch(source, {
          method: "GET", // Explicitly defining the GET request
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Ensure the URL is accessible before loading it
        setAudioUrl(source);
        loadAudio(source);
      } catch (error) {
        console.error("Error fetching audio:", error);
        Alert.alert("Error", "Failed to fetch the audio file.");
        setAudioUrl(null);
      } finally {
        setLoading(false);
      }
    };
    

    if (source) {
      fetchAudio();
    }
  }, [source]);

  const loadAudio = async (audioUri) => {
    try {
      const { sound: audioSound, status } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(audioSound);
      setDuration(status.durationMillis);
    } catch (error) {
      console.error("Error loading audio:", error);
      Alert.alert("Error", "Failed to load audio.");
      setSound(null);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!sound) {
        console.error("Audio not loaded");
        return;
      }

      if (currentSound && currentSound !== sound) {
        await currentSound.stopAsync();
      }

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }

      currentSound = sound;
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error during audio playback:", error);
      Alert.alert("Error", "Failed to play audio.");
    }
  };

  const handleSliderChange = async (value) => {
    if (sound !== null) {
      const newPosition = value;
      setPosition(newPosition);
      try {
        await sound.setPositionAsync(newPosition);
      } catch (error) {
        console.error("Error setting audio position:", error);
      }
    }
  };

  useEffect(() => {
    const updatePosition = async () => {
      if (sound !== null) {
        const status = await sound.getStatusAsync();
        setPosition(status.positionMillis);
        setIsPlaying(status.isPlaying);
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      }
    };

    const interval = setInterval(updatePosition, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
        <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={24} color="#fff" />
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={handleSliderChange}
        minimumTrackTintColor="#4287f5"
        maximumTrackTintColor="rgba(66, 135, 245, 0.5)"
        thumbTintColor="#4287f5"
      />
      <Text style={styles.timeText}>{`${formatTime(position)} / ${formatTime(duration)}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  playButton: {
    backgroundColor: "#4287f5",
    padding: 8,
    borderRadius: 16,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: "grey",
  },
  loadingText: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AudioPlayer;
