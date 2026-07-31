import { useAuth } from "@/context/authcontext";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import colours from "../../../../theme/colours";
import ParchmentBackground from "../../../components/ParchmentBackground";

export default function ProfileScreen() {
  const { profile, user } = useAuth();
  return (
    <ParchmentBackground>
      <SafeAreaProvider style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>Your Profile</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>

            <Text style={styles.label}>Display Name</Text>
            <Text style={styles.value}>
              {profile?.displayName || "Not Set"}
            </Text>

            <Text style={styles.label}>Bio</Text>
            <Text style={styles.value}>{profile?.bio || "No bio yet"}</Text>

            <Text style={styles.label}>Reading Streak</Text>
            <Text style={styles.value}>{profile?.readingStreak || 0} days</Text>
          </View>

          <View style={styles.buttonGroup}>
            <Link href="/(protected)/(tabs)/profile/edit-profile" asChild>
              <TouchableOpacity style={styles.buttonSecondary}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/(protected)/(tabs)/profile/settings" asChild>
              <TouchableOpacity style={styles.buttonSecondary}>
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaProvider>
    </ParchmentBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    fontFamily: "JimNightshade",
    fontSize: 40,
    color: colours.textCream,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colours.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.35)",
    marginBottom: 30,
  },
  label: {
    fontFamily: "IbarraRealNova",
    color: colours.textTertiary,
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 18,
  },
  buttonGroup: {
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
