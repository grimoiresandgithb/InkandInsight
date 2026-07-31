import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "../../../../src/context/authcontext";
import colours from "../../../../theme/colours";
import ParchmentBackground from "../../../components/ParchmentBackground";

export default function SettingsScreen() {
  const { changePassword, logout, error } = useAuth();
  const [newPassword, setNewPassword] = useState("");

  async function handlePasswordChange() {
    if (newPassword.trim().length < 6) return;
    await changePassword(newPassword);
    setNewPassword("");
  }

  return (
    <ParchmentBackground>
      <SafeAreaProvider style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        <Text style={styles.label}>Change Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          placeholderTextColor="rgba(247, 241, 227, 0.85)"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handlePasswordChange}
        >
          <Text style={styles.saveButtonText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <ScrollView></ScrollView>
      </SafeAreaProvider>
    </ParchmentBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  header: {
    fontFamily: "JimNightshade",
    fontSize: 40,
    color: colours.textCream,
    marginBottom: 20,
  },
  label: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colours.surfaceDark,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,245,230,0.25)",
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 16,
  },
  error: {
    color: colours.accentRed,
    fontFamily: "IbarraRealNova",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: colours.accentGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  saveButtonText: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textCream,
  },
  logoutButton: {
    backgroundColor: colours.surfaceDark,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colours.textCream,
  },
  logoutText: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textCream,
  },
});
