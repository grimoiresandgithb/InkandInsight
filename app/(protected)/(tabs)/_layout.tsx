import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import colours from "../../../theme/colours";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colours.accentRed,
        tabBarInactiveTintColor: colours.textTertiary,
        tabBarStyle: {
          backgroundColor: "rgba(90, 75, 60, 1)",
          borderTopColor: colours.accentGreen,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookshelf"
        options={{
          title: "Bookshelf",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="quotes"
        options={{
          title: "Quotes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
