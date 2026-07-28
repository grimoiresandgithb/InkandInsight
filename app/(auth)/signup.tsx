import { useAuth } from "@/context/authcontext";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colours from "../../theme/colours";

export default function Signup() {
  const { signUp, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  return (
    <ImageBackground
      source={require("@/assets/images/parchment.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(60, 45, 35, 0.35)",
          "rgba(60, 45, 35, 0.15)",
          "rgba(60, 45, 35, 0.0)",
        ]}
        style={styles.vignette}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <View style={styles.authContainer}>
            <View style={styles.authCard}>
              <Text style={styles.authTitle}>Create Account</Text>
              {error && <Text style={styles.authError}>{error}</Text>}

              <TextInput
                style={styles.authInput}
                placeholder="Email"
                placeholderTextColor="rgba(247, 241, 227, 0.85)"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.authInput}
                placeholder="Password"
                placeholderTextColor="rgba(247, 241, 227, 0.85)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.authButton}
                onPress={() => signUp(email, password)}
                disabled={loading}
              >
                <Text style={styles.authButtonText}>
                  {loading ? "Loading..." : "Sign Up"}
                </Text>
              </TouchableOpacity>
              <View style={styles.authLink}>
                <Link href="/(auth)/login">
                  <Text style={styles.authLinkText}>
                    Already have an account?
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
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
  authCard: {
    backgroundColor: colours.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.35)",
    shadowColor: "#C8B89A",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  authTitle: {
    fontFamily: "IbarraRealNova",
    fontSize: 32,
    color: colours.textCream,
    marginBottom: 24,
    textAlign: "center",
  },
  authInput: {
    backgroundColor: colours.surfaceDark,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.25)",
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: colours.accentGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#C8B89A",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  authButtonText: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textCream,
  },
  authError: {
    color: colours.accentRed,
    fontFamily: "IbarraRealNova",
    marginBottom: 12,
    textAlign: "center",
  },
  authLink: {
    marginTop: 16,
    alignItems: "center",
  },
  authLinkText: {
    fontFamily: "IbarraRealNova",
    color: colours.accentGreen,
    fontSize: 16,
  },
});
