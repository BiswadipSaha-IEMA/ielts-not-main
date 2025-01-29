import { Text, StyleSheet, View } from "react-native";

export default function Time({ time }) {
  const transformMinutes = () => {
    const convertedValue = Math.floor((time / 60000) % 60);
    const formattedValue = ("0" + convertedValue).slice(-2);
    return formattedValue;
  };

  const transformSeconds = () => {
    const convertedValue = Math.floor((time / 1000) % 60);
    const formattedValue = ("0" + convertedValue).slice(-2);
    return formattedValue;
  };

  return (
    <View style={styles.row}>
      <Text style={styles.time}>
        {transformMinutes()} : {transformSeconds()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
  },
  time: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0e0e0e",
  },
});
