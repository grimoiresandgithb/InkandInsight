import { useAuth } from "@/context/authcontext";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import colours from "../../../theme/colours";

export default function QuotesScreen() {
  const { addQuote, getQuotes } = useAuth();
  const listRef = useRef<FlatList>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [book, setBook] = useState("");
  const [author, setAuthor] = useState("");

  async function loadQuotes() {
    const data = await getQuotes();
    setQuotes(data);
  }

  async function handleAdd() {
    if (!text.trim()) return;

    await addQuote(text, book, author);

    Toast.show("Quote saved!", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: colours.accentGreen,
      textColor: colours.textCream,
    });

    setText("");
    setBook("");
    setAuthor("");

    await loadQuotes();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  useEffect(() => {
    loadQuotes();
  }, []);

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
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>Your Quotes</Text>
          {/* Quote cards go here */}
          <Text style={styles.label}>Add Quote...</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            placeholder="Write your quote here..."
            placeholderTextColor={colours.textTertiary}
            value={text}
            onChangeText={setText}
          />
          <Text style={styles.label}>Book</Text>
          <TextInput
            style={styles.input}
            placeholder="Book title..."
            placeholderTextColor={colours.textTertiary}
            value={book}
            onChangeText={setBook}
          />

          <Text style={styles.label}>Author</Text>
          <TextInput
            style={styles.input}
            placeholder="Author name..."
            placeholderTextColor={colours.textTertiary}
            value={author}
            onChangeText={setAuthor}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
            <Text style={styles.saveButtonText}>Save Quote</Text>
          </TouchableOpacity>

          <FlatList
            ref={listRef}
            style={{ marginTop: 20 }}
            data={quotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.quoteCard}>
                <Text style={styles.quoteMark}>❝</Text>

                <Text style={styles.quoteText}>{item.text}</Text>

                <Text style={styles.quoteMeta}>
                  — {item.author},{" "}
                  <Text style={styles.bookTitle}>{item.book}</Text>
                </Text>
              </View>
            )}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    color: colours.textPrimary,
    fontSize: 40,
    fontWeight: "600",
    padding: 10,
    fontFamily: "JimNightshade",
  },
  vignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.25)",
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
    marginBottom: 20,
  },
  saveButtonText: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textCream,
  },
  quoteCard: {
    backgroundColor: colours.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.35)",
    position: "relative",
  },

  quoteMark: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 48,
    color: colours.accentGreen,
    opacity: 0.4,
    fontFamily: "JimNightshade",
    marginBottom: 5,
    marginRight: 20,
  },

  quoteText: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 22,
    lineHeight: 30,
    marginBottom: 12,
    marginTop: 35,
    marginRight: 15,
  },

  quoteMeta: {
    fontFamily: "IbarraRealNovaItalic",
    color: colours.textTertiary,
    fontSize: 16,
  },

  bookTitle: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
  },
});
