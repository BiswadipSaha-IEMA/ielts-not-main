import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";

const FunctionalAudioPlayer = ({
  key,
  uri,
  isActive,
  onTogglePlay,
  stopCurrentSound,
}) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (uri) {
      loadSound();
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [uri]);

  useEffect(() => {
    if (isActive && !isPlaying) {
      handlePlayPause();
    } else if (!isActive && isPlaying) {
      handlePlayPause();
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      setSound(sound);
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setDuration(status.durationMillis);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
      if (
        !status.isPlaying &&
        status.positionMillis === status.durationMillis
      ) {
        setPosition(0); // Reset position to 0 when audio finishes playing
      }
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!sound) return;
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        setPosition(0); // Reset position to 0 when audio is paused
      } else {
        stopCurrentSound(); // Stop any currently playing audio
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling play:", error);
    }
  };

  const handleTogglePlay = () => {
    onTogglePlay();
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = milliseconds / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <Text>{formatTime(position)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        disabled={!isActive}
      />
      <Text>{formatTime(duration)}</Text>
      {isPlaying ? (
        <Pressable onPress={handleTogglePlay}>
          <Icon name="pause" size={20} color={"blue"} />
        </Pressable>
      ) : (
        <Pressable onPress={handleTogglePlay}>
          <Icon name="play" size={20} color={"blue"} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    gap: 10,
  },
  activeContainer: {
    backgroundColor: "#e0e0e0",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default FunctionalAudioPlayer;
