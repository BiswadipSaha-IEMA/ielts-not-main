import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MicrophoneRecorder({ scoreUpdate, setScoreUpdate, setCorrectAnswers, currentQuestion, setIsSpeakingSet, isSpeakingSet, level, module, set, apiUrl }) {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [progress, setProgress] = useState(new Animated.Value(0));

  const RECORDING_DURATION = 60000; // 1 minute in milliseconds

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setIsLoading(true);
      
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsLoading(false);

      // Start progress animation
      Animated.timing(progress, {
        toValue: 1,
        duration: RECORDING_DURATION,
        useNativeDriver: false,
      }).start();

      // Auto-stop after 1 minute
      setTimeout(() => {
        stopRecording();
      }, RECORDING_DURATION);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
    Animated.timing(progress, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();

    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    if (!uri) {
      setIsLoading(false);
      return;
    }

    try {
      const BEARER_TOKEN = await AsyncStorage.getItem('token');
      if (!BEARER_TOKEN) {
        console.error('❌ Token not found in AsyncStorage');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'Recording.wav',
        type: 'audio/wave',
      });

      console.log('🔹 FormData:', formData);

      const API_URL = `${apiUrl}exam/module${module}/level${level}/set${set}/sendAudioFiles`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });



      const responseText = await response.text();
      console.log('🔹 Raw Response:', responseText);

      if (response.ok) {
        const result = JSON.parse(responseText);
        if(!isSpeakingSet.includes(currentQuestion)){
          setIsSpeakingSet((prev) => [...prev, currentQuestion]);
        }
        setScoreUpdate((prev)=>prev+result.finalScore);
        console.log('correct answers:', result.correctAnswer)
        // setCorrectAnswers(response.correctAnswersArray[0])
        setCorrectAnswers((prev)=>prev+result.correctAnswer)
        console.log('✅ Upload successful:', result);
      } else {
        console.error('❌ Server Error:', response.status, responseText);
      }

      setAudioUri(uri);
    } catch (error) {
      console.error('❌ Upload failed:', error);
    } finally {
      setRecording(null);
      setIsLoading(false);
    }
  };

  const playAudio = async () => {
    if (!audioUri) return;

    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);

    await sound.playAsync();
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={styles.micButton}
      disabled={isLoading===true}
      >
        <Animated.View
          style={[
            styles.progressCircle,
            {
              borderColor: isRecording ? '#FF3B30' : '#007AFF',
              borderWidth: 5,
              transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }],
            },
          ]}
        />
        <FontAwesome name="microphone" size={40} color="white" />
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  micButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  progressCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: '#007AFF',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
