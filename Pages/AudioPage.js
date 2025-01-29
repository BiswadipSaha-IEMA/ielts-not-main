import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import FunctionalAudioPlayer from "./FunctionalAudioPlayer";

const AudioPage = () => {
  const [activePlayer, setActivePlayer] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [isInitiallyLoading, setIsInitiallyLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsInitiallyLoading(false);
    }, 3500);

    return async () => {
      clearInterval(interval);
    };
  }, []);

  const togglePlay = (id) => {
    setActivePlayer(activePlayer === id ? null : id);
  };

  const stopCurrentSound = async (sound) => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  if (isInitiallyLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {[1, 2, 3, 4, 5].map((id, index) => (
        <FunctionalAudioPlayer
          key={index}
          uri="https://ielts-iema.iemamerica.com/uploads/m4_l1_q3.mp3"
          isActive={activePlayer === id}
          onTogglePlay={() => togglePlay(id)}
          stopCurrentSound={stopCurrentSound}
        />
      ))}
    </View>
  );
};

export default AudioPage;
