import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

export default function MicrophoneRecorder({token}) {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);

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
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);

    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    if (!uri) {
        setIsLoading(false);
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', {
            uri,
            name: 'Recording.wav', // Matches "originalname"
            type: 'audio/wave', // Matches "mimetype"
        });

        console.log('🔹 FormData:', formData);

        // Replace with actual API URL and Bearer Token
        const API_URL = 'http://192.168.1.174:5000/api/exam/module3/level1/set1/submit';
        const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OWIzZTk1ZDVjNTRhYzJhZDQwMWJlMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM4MjMxNTg4LCJleHAiOjE3MzgyMzg3ODh9.Jl6BE01Ft_Caw01lfw0bDF11qa_H3jFhMkBlJUaFgj4";

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'multipart/form-data', // Necessary for file uploads
            },
            body: formData,
        });

        // Debugging: Log raw response before parsing
        const responseText = await response.text();
        console.log('🔹 Raw Response:', responseText);

        // Try parsing JSON only if the response is valid
        if (response.ok) {
            const result = JSON.parse(responseText);
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


  
  
  
  // Function to play recorded audio
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
      <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={styles.micButton}>
        <FontAwesome name="microphone" size={40} color="white" />
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#007AFF" />}

      {audioUri && (
        <TouchableOpacity onPress={playAudio} style={styles.audioButton}>
          <Text style={styles.audioText}>🎵 Play Recorded Audio (.wav)</Text>
        </TouchableOpacity>
      )}
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
  },
  audioButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  audioText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
