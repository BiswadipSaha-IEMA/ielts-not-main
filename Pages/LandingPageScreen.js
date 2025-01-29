import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

function LandingPageScreen({ auth, setAuth, navigation }) {
  const [orientationIsLandscape, setOrientation] = useState(true);
  async function changeScreenOrientation() {
    if (orientationIsLandscape == true) {
      ScreenOrientation.getOrientationAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else if (orientationIsLandscape == false) {
      ScreenOrientation.getOrientationAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  }

  return (
    <View style={[styles.container, styles.center]}>
      <ScrollView
        showsVerticalScrollIndicator={false} //hides scrollbar vertically
        showsHorizontalScrollIndicator={false} //hides scrollbar horizontally
        style={[{ width: "100%" }]}
      >
        <View style={[styles.hero, styles.center]}>
          <Image
            source={require("../assets/landing_page.png")}
            style={styles.heroImg}
          />
        </View>

        <View style={[styles.content, styles.center]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Kickstart your IELTS preparation{"\n"}with{" "}
              <View style={styles.appName}>
                <Text style={styles.appNameText}>IEM English</Text>
              </View>
            </Text>
            <Text style={styles.message}>
              Prepare for IELTS like never before.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnSignIn}
            onPress={() => {
              navigation.navigate("Login");
              //handle onPress
            }}
          >
            <Text style={styles.btnTextSignIn}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnGS}
            onPress={() => {
              navigation.navigate("Signup");
              //handle onPress
            }}
          >
            <Text style={styles.btnTextGS}>Get Started</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </View>
  );
}

export default LandingPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    margin: "3%",
  },
  heroImg: {
    width: 350,
    height: 350,
  },
  content: {
    backgroundColor: "#fff",
    padding: "3%",
  },
  header: {
    paddingHorizontal: "6%",
  },
  title: {
    fontSize: 28,
    lineHeight: 40,
    fontWeight: "500",
    color: "#281b52",
    textAlign: "center",
    marginBottom: "4%",
  },
  message: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400",
    color: "#9992a7",
    textAlign: "center",
    marginBottom: "4%",
  },
  appName: {
    backgroundColor: "#F1F4FF",
    paddingHorizontal: "1%",
    transform: [
      {
        rotate: "-3.5deg",
      },
    ],
  },
  appNameText: {
    fontSize: 25,
    fontWeight: "700",
    color: "#000000",
  },
  btnSignIn: {
    backgroundColor: "blue",
    paddingVertical: "3%",
    paddingHorizontal: "15%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: 12,
  },
  btnTextSignIn: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  btnGS: {
    borderColor: "blue",
    paddingVertical: "3%",
    paddingHorizontal: "10%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 2,
  },
  btnTextGS: {
    fontSize: 15,
    fontWeight: "500",
    color: "blue",
  },
});
