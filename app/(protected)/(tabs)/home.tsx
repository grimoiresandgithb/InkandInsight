import { useAuth } from "@/context/authcontext";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../../src/firebase";
import colours from "../../../theme/colours";

const SESSION_EMOTIONS = [
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

export default function HomeScreen() {
  const {
    user,
    getBooks,
    profile,
    updateBook,
    addBook,
    addQuote,
    getAllEmotionWords,
  } = useAuth();

  const [books, setBooks] = useState<any[]>([]);
  const [currentRead, setCurrentRead] = useState<any | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [feelings, setFeelings] = useState("");
  const [sessionEmotions, setSessionEmotions] = useState<string[]>([]);

  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookPages, setNewBookPages] = useState<number>(0);
  const [totalPagesInput, setTotalPagesInput] = useState<number>(0);

  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteBook, setNewQuoteBook] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");

  const [emotionWords, setEmotionWords] = useState<string[]>([]);

  async function loadBooks() {
    const data = await getBooks();
    setBooks(data);

    const reading = data.find((b) => !b.finished);
    setCurrentRead(reading || null);
  }

  async function loadWordCloud() {
    const words = await getAllEmotionWords();
    setEmotionWords(words);
  }

  useEffect(() => {
    loadBooks();
    loadWordCloud();
  }, []);

  function getWordFrequency(words: string[]) {
    const freq: Record<string, number> = {};

    words.forEach((w) => {
      const key = w.toLowerCase().trim();
      freq[key] = (freq[key] || 0) + 1;
    });
    return freq;
  }

  function toggleSessionEmotion(word: string) {
    setSessionEmotions((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word],
    );
  }

  async function handleSaveProgress() {
    if (!currentRead) return;

    const bookId = currentRead.id;

    // Retroactive total pages
    if (!currentRead.totalPages && totalPagesInput > 0) {
      await updateBook(bookId, {
        totalPages: totalPagesInput,
      });
    }

    // Update pagesRead
    await updateBook(bookId, {
      pagesRead: page,
    });

    // Save quote
    if (quoteText.trim().length > 0) {
      await addQuote(quoteText.trim(), currentRead.title, currentRead.author);
    }

    // Save session
    await saveReadingSession(bookId);

    // Update streak
    await updateReadingStreak();

    // Reset
    setShowModal(false);
    setPage(0);
    setFeelings("");
    setQuoteText("");
    setSessionEmotions([]);
    setTotalPagesInput(0);

    loadBooks();
    loadWordCloud();
  }

  async function saveReadingSession(bookId: string) {
    const sessionRef = collection(
      db,
      "users",
      user.uid,
      "books",
      bookId,
      "sessions",
    );

    const combinedFeelings = [
      ...sessionEmotions,
      ...(feelings.trim() ? [feelings.trim()] : []),
    ];

    await addDoc(sessionRef, {
      page,
      feelings: combinedFeelings,
      quotes: quoteText.trim() ? [quoteText.trim()] : [],
      createdAt: Date.now(),
    });
  }

  async function updateReadingStreak() {
    const userRef = doc(db, "users", user.uid);

    const today = new Date().setHours(0, 0, 0, 0);
    const lastRead = profile?.lastReadDate;
    const streak = profile?.readingStreak || 0;

    if (!lastRead) {
      await updateDoc(userRef, {
        readingStreak: 1,
        lastReadDate: today,
      });
      return;
    }

    const yesterday = today - 86400000;

    if (lastRead === yesterday) {
      await updateDoc(userRef, {
        readingStreak: streak + 1,
        lastReadDate: today,
      });
    } else {
      await updateDoc(userRef, {
        readingStreak: 1,
        lastReadDate: today,
      });
    }
  }

  function getProgress() {
    if (!currentRead || !currentRead.totalPages) return 0;
    return (currentRead.pagesRead / currentRead.totalPages) * 100;
  }

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
          <Text style={styles.header}>Ink & Insight</Text>

          {currentRead ? (
            <View style={styles.card}>
              <Text style={styles.bookTitle}>{currentRead.title}</Text>
              <Text style={styles.bookAuthor}>{currentRead.author}</Text>

              {currentRead.totalPages ? (
                <>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${getProgress()}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {currentRead.pagesRead} / {currentRead.totalPages} pages (
                    {Math.round(getProgress())}% )
                  </Text>
                </>
              ) : (
                <Text style={styles.noPagesText}>
                  No page count set for this book
                </Text>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowModal(true)}
              >
                <Text style={styles.buttonText}>
                  {currentRead.pagesRead === 0
                    ? "Start Reading"
                    : "Continue Reading"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.streakText}>
                Reading streak: {profile?.readingStreak || 0} days
              </Text>
            </View>
          ) : (
            <Text style={styles.noCurrentRead}>
              You’re not currently reading anything.
            </Text>
          )}
          {currentRead && (
            <Modal
              visible={showModal}
              animationType="slide"
              transparent={false}
            >
              <View style={styles.modalWrapper}>
                <ScrollView
                  contentContainerStyle={styles.modalScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.modalHeading}>
                    {currentRead.pagesRead === 0
                      ? "Start Reading"
                      : "Continue Reading"}
                  </Text>

                  {/* Retroactive page count */}
                  {!currentRead.totalPages && (
                    <>
                      <Text style={styles.label}>Add Total Pages</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={totalPagesInput.toString()}
                        onChangeText={(v) => setTotalPagesInput(Number(v))}
                        placeholder="e.g. 350"
                        placeholderTextColor={colours.textTertiary}
                      />
                    </>
                  )}

                  <Text style={styles.label}>What page are you on now?</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={page.toString()}
                    onChangeText={(v) => setPage(Number(v))}
                  />

                  <Text style={styles.label}>Session Feelings</Text>
                  <View style={styles.pillContainer}>
                    {SESSION_EMOTIONS.map((word) => {
                      const active = sessionEmotions.includes(word);
                      return (
                        <TouchableOpacity
                          key={word}
                          style={[styles.pill, active && styles.pillActive]}
                          onPress={() => toggleSessionEmotion(word)}
                        >
                          <Text style={styles.pillText}>{word}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    multiline
                    value={feelings}
                    onChangeText={setFeelings}
                    placeholder="Add your own feeling..."
                    placeholderTextColor={colours.textTertiary}
                  />

                  <Text style={styles.label}>Quotes (optional)</Text>
                  <TextInput
                    style={[styles.input, { height: 120 }]}
                    multiline
                    value={quoteText}
                    onChangeText={setQuoteText}
                    placeholder="Add any quotes you found meaningful..."
                    placeholderTextColor={colours.textTertiary}
                  />

                  {/* SAVE BUTTON */}
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProgress}
                  >
                    <Text style={styles.saveButtonText}>
                      {currentRead.pagesRead === 0
                        ? "Start Reading"
                        : "Save Progress"}
                    </Text>
                  </TouchableOpacity>

                  {/* CANCEL BUTTON */}
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </Modal>
          )}

          <View style={styles.quickActionsContainer}>
            <View style={styles.quickActionsRow}>
              <QuickAction label="Add Book" />
              <QuickAction label="Add Quote" />
            </View>

            <Text style={styles.noCurrentRead}>
              Emotions you've felt whilst reading
            </Text>
            <View style={styles.wordCloudContainer}>
              {Object.entries(getWordFrequency(emotionWords)).map(
                ([word, count]) => (
                  <Text
                    key={word}
                    style={[styles.wordCloudWord, { fontSize: 14 + count * 4 }]}
                  >
                    {word}
                  </Text>
                ),
              )}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
}

// quick action component
function QuickAction({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.quickAction}>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
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
    fontFamily: "JimNightshade",
    color: colours.textPrimary,
    fontSize: 40,
    fontWeight: "600",
    padding: 10,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 16,
  },
  streakTitle: {
    fontFamily: "IbarraRealNovaBold",
    color: colours.textCream,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  progressLabel: {
    fontFamily: "IbarraRealNovaBold",
    color: colours.textCream,
    fontSize: 14,
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colours.surfaceDark,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: colours.accentRed,
  },
  rightPlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: colours.surfaceDark,
    borderRadius: 12,
  },
  quickActionsContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colours.surfaceDark,
    paddingVertical: 14,
    borderRadius: 30,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.35)",
    shadowColor: "#C8B89A",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  quickActionLabel: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 16,
    textAlign: "center",
  },
  vignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: colours.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.35)",
    marginBottom: 20,
  },
  bookTitle: {
    fontFamily: "IbarraRealNova",
    fontSize: 26,
    color: colours.textCream,
  },
  bookAuthor: {
    fontFamily: "IbarraRealNovaItalic",
    fontSize: 18,
    color: colours.textTertiary,
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: colours.surfaceDark,
    borderRadius: 6,
    overflow: "hidden",
    marginVertical: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colours.accentGreen,
  },
  progressText: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 16,
    marginBottom: 12,
  },
  noPagesText: {
    fontFamily: "IbarraRealNovaItalic",
    color: colours.textTertiary,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colours.accentGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontFamily: "IbarraRealNova",
    fontSize: 18,
    color: colours.textCream,
  },
  streakText: {
    marginTop: 12,
    fontFamily: "IbarraRealNovaItalic",
    color: colours.textCream,
    fontSize: 16,
  },
  noCurrentRead: {
    fontFamily: "IbarraRealNovaItalic",
    color: colours.textTertiary,
    fontSize: 18,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: colours.background,
    paddingTop: 40,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colours.background,
  },
  modalHeading: {
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.25)",
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 16,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.25)",
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
  cancelButton: {
    marginTop: 20,
    alignItems: "center",
  },
  cancelText: {
    fontFamily: "IbarraRealNovaItalic",
    color: colours.textTertiary,
    fontSize: 16,
  },
  analyticsCard: {
    backgroundColor: colours.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.35)",
    shadowColor: "#C8B89A",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  graphCell: {
    width: "48%",
    height: 140,
    backgroundColor: colours.surfaceDark,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.25)",
    shadowColor: "#C8B89A",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  graphLabel: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
    fontSize: 14,
  },
  scrollContainer: {
    paddingHorizontal: 2,
    paddingBottom: 20,
  },
  wordCloudContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 30,
    backgroundColor: colours.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 230, 0.35)",
  },
  wordCloudWord: {
    fontFamily: "IbarraRealNova",
    color: colours.textCream,
  },
});
