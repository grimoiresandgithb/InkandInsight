import { AuthProvider, useAuth } from "@/context/authcontext";
import { useFonts } from "expo-font";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Not logged in → landing page
  if (!user) {
    return <Redirect href="/" />;
  }

  // Logged in → protected tabs
  return <Redirect href="/(protected)/(tabs)/home" />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IbarraRealNova: require("../assets/fonts/IbarraRealNova-VariableFont_wght.ttf"),
    IbarraRealNovaItalic: require("../assets/fonts/IbarraRealNova-Italic-VariableFont_wght.ttf"),
    JimNightshade: require("../assets/fonts/JimNightshade-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AuthGate />
      <Slot />
    </AuthProvider>
  );
}
