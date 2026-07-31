import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../src/context/authcontext";
import colours from "../../../theme/colours";
import ParchmentBackground from "../../components/ParchmentBackground";

const EMOTION_OPTIONS = [
  "cozy",
  "melancholic",
  "hopeful",
  "scared",
  "schocked",
  "comforted",
  "tickled",
  "whimsical",
  "dark",
  "amused",
  "inspired",
  "uplifted",
  "curious",
  "tense",
  "surprised",
  "hot",
];

export default function BookshelfScreen() {
  const { getBooks, addBook } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [customEmotion, setCustomEmotion] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  async function loadBooks() {
    const data = await getBooks();
    setBooks(data);
  }

  async function pickCoverPhoto() {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setCoverPhoto(result.assets[0].uri);
    }
  }

  function toggleEmotion(word: string) {
    setSelectedEmotions((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word],
    );
  }

  async function handleAdd() {
    if (!title.trim()) return;

    const emotionList = [...selectedEmotions];

    if (customEmotion.trim().length > 0) {
      emotionList.push(customEmotion.trim());
    }

    await addBook(
      title,
      author,
      finished,
      rating,
      emotionList,
      totalPages || null,
      0,
      coverPhoto,
    );

    Toast.show("Book saved!", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: colours.accentGreen,
      textColor: colours.textCream,
      shadow: true,
      animation: true,
    });

    // reset form
    setTitle("");
    setAuthor("");
    setFinished(false);
    setRating(null);
    setSelectedEmotions([]);
    setCustomEmotion("");
    setTotalPages(null);
    setCoverPhoto(null);

    await loadBooks();

    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <ParchmentBackground>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <Text style={styles.header}>Your Bookshelf</Text>

          <View style={styles.form}>
            <Text style={styles.formHeader}>Add a book</Text>
            <TextInput
              style={styles.input}
              placeholder="Book Title"
              placeholderTextColor="rgba(247, 241, 227, 0.85)"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Author"
              placeholderTextColor="rgba(247, 241, 227, 0.85)"
              value={author}
              onChangeText={setAuthor}
            />

            <Text style={styles.label}>Total Pages (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="eg. 350"
              placeholderTextColor="rgba(247, 241, 227, 0.85)"
              keyboardType="numeric"
              value={totalPages?.toString() || ""}
              onChangeText={(v) => setTotalPages(Number(v))}
            />

            <TouchableOpacity style={styles.button} onPress={pickCoverPhoto}>
              <Text style={styles.buttonText}>Take Cover Photo</Text>
            </TouchableOpacity>

            {coverPhoto && (
              <Image
                source={{ uri: coverPhoto }}
                style={{
                  width: 120,
                  height: 180,
                  borderRadius: 12,
                  marginTop: 10,
                }}
              />
            )}

            <Text style={styles.label}>Have you finished this book?</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  finished && styles.toggleButtonActive,
                ]}
                onPress={() => setFinished(true)}
              >
                <Text style={styles.toggleText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !finished && styles.toggleButtonActive,
                ]}
                onPress={() => setFinished(false)}
              >
                <Text style={styles.toggleText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {finished && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.label}>Rating (1-5)</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={5}
                step={0.5}
                value={rating ?? 3}
                minimumTrackTintColor={colours.accentGreen}
                maximumTrackTintColor="rgba(255, 245, 230, 0.25)"
                thumbTintColor={colours.accentGreen}
                onValueChange={(value) => setRating(value)}
              />

              <Text style={styles.ratingText}>
                {rating ? `Your rating: ${rating}/5` : "Slide to rate"}
              </Text>
            </View>
          )}

          {finished && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.label}>Emotions</Text>

              <View style={styles.pillContainer}>
                {EMOTION_OPTIONS.map((word) => {
                  const active = selectedEmotions.includes(word);
                  return (
                    <TouchableOpacity
                      key={word}
                      style={[styles.pill, active && styles.pillActive]}
                      onPress={() => toggleEmotion(word)}
                    >
                      <Text style={styles.pillText}>{word}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Add your own word..."
                placeholderTextColor="rgba(247, 241, 227, 0.85)"
                value={customEmotion}
                onChangeText={setCustomEmotion}
                onSubmitEditing={() => {
                  if (customEmotion.trim().length > 0) {
                    setSelectedEmotions((prev) => [
                      ...prev,
                      customEmotion.trim(),
                    ]);
                    setCustomEmotion("");
                  }
                }}
              />
            </View>
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
            <Text style={styles.saveButtonText}>Save Book</Text>
          </TouchableOpacity>

          {/* Book cards go here */}
          <Text style={[styles.label, { marginTop: 10 }]}>On your shelf</Text>
          <FlatList
            ref={listRef}
            style={{ marginTop: 20 }}
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookCard}>
                {item.coverPhoto && (
                  <Image
                    source={{ uri: item.coverPhoto }}
                    style={{
                      width: 90,
                      height: 120,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                )}
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>

                {item.finished && (
                  <Text style={styles.bookMeta}>
                    ⭐ {item.rating} — {item.emotions.join(", ")}
                  </Text>
                )}
              </View>
            )}
          />
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
    color: colours.textPrimary,
    fontSize: 18,
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
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
  toggleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colours.surfaceDark,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.25)",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: colours.accentGreen,
    borderColor: colours.accentGreen,
  },
  toggleText: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 16,
  },
  ratingText: {
    marginTop: 8,
    fontFamily: "IbarraRealNova",
    color: colours.textPrimary,
    fontSize: 16,
    textAlign: "center",
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colours.surfaceDark,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "Rgba(255, 245, 230, 0.25)",
  },
  pillActive: {
    backgroundColor: colours.accentGreen,
    borderColor: colours.accentGreen,
  },
  pillText: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 14,
  },
  button: {
    backgroundColor: colours.accentGreen,
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textCream,
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
  formHeader: {
    fontFamily: "IbarraRealNova",
    fontSize: 14,
    padding: 5,
  },
  bookCard: {
    backgroundColor: colours.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.35)",
  },

  bookTitle: {
    fontFamily: "IbarraRealNova",
    fontSize: 20,
    color: colours.textCream,
  },

  bookAuthor: {
    fontFamily: "IbarraRealNovaItalic",
    fontSize: 16,
    color: colours.textTertiary,
  },

  bookMeta: {
    marginTop: 6,
    fontFamily: "IbarraRealNovaItalic",
    color: colours.textCream,
    fontSize: 14,
  },
});
