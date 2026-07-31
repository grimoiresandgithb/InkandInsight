import { useAuth } from "@/context/authcontext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import colours from "../../../../theme/colours";
import ParchmentBackground from "../../../components/ParchmentBackground";

export default function EditProfileScreen() {
  const { profile, updateProfileInfo } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [bio, setBio] = useState(profile?.bio || "");

  async function handleSave() {
    await updateProfileInfo({ displayName, bio });
    router.back();
  }

  return (
    <ParchmentBackground>
      <SafeAreaProvider style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>Edit Profile</Text>

          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="your display name"
            placeholderTextColor="rgba(247, 241, 227, 0.85)"
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 120 }]}
            value={bio}
            onChangeText={setBio}
            multiline
            placeholder="Tell us your story..."
            placeholderTextColor="rgba(247, 241, 227, 0.85)"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
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
  saveButton: {
    backgroundColor: colours.accentGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textCream,
  },
});
