import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  View,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useLogin } from "../context/LoginProvider";

function Layout({ children, title }) {
  const navigation = useNavigation();
  const { setIsLoggedIn } = useLogin();

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/appBg.png")}
        style={{
          flex: 1,
          backgroundColor: "rgba(245,255,255, 0.6)",
          paddingHorizontal: "2%",
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Icon
              name="bars"
              size={24}
              color="#858585"
              onPress={() => navigation.toggleDrawer()}
            />
          </TouchableOpacity>
          {/* <View>{children}</View> */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              jutifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{title}</Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Icon
              name="sign-out"
              size={24}
              color="#858585"
              onPress={(prev) => {
                setIsLoggedIn(!prev);
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </ImageBackground>
    </View>
  );
}

export default Layout;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
    // paddingHorizontal: "2%",
    marginTop: StatusBar.currentHeight,
    // marginTop: Platform.OS === "ios" && StatusBar.currentHeight,
    paddingBottom: "5%",
  },
  header: {
    flexDirection: "row",
    height: "max-content",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "red",
  },
  iconButton: {
    position: "absolute",
    // paddingLeft: 20,
    left: 50,
    top: 20,
    backgroundColor: "blue",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1, // Ensure the button is above the content
  },
  menuButton: {
    padding: "2%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginVertical: "2%",
  },
});
