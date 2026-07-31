import { Link } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colours from "../theme/colours";
import ParchmentBackground from "./components/ParchmentBackground";

export default function Landing() {
  return (
    <ParchmentBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <Image
            source={require("../assets/images/IIlogo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to Ink & Insight</Text>
          <Text style={styles.subtitle}>
            Track your reads, moods, quotes, and literary adventures
          </Text>

          <View style={styles.buttonGroup}>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity style={styles.buttonSecondary}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ParchmentBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 80,
  },
  scrollContainer: {
    paddingHorizontal: 2,
    paddingBottom: 20,
  },
  vignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontFamily: "IbarraRealNova",
    fontSize: 42,
    color: colours.textCream,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textTertiary,
    textAlign: "center",
    marginBottom: 40,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 16,
  },
  button: {
    backgroundColor: colours.accentGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: colours.surfaceDark,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colours.textCream,
  },
  buttonText: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textCream,
  },
});
