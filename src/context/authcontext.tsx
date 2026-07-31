import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

type AuthContextType = {
  user: any;
  profile: any;
  loading: boolean;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileInfo: (data: any) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;

  addBook: (
    title: string,
    author: string,
    finished: boolean,
    rating: number | null,
    emotions: string[],
    totalPages: number | null,
    pagesRead: number | null,
    coverPhoto: string | null,
  ) => Promise<void>;
  getBooks: () => Promise<any[]>;
  updateBook: (bookId: string, data: any) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;

  addQuote: (text: string, book: string, author: string) => Promise<void>;
  getQuotes: () => Promise<any[]>;
  deleteQuote: (quoteId: string) => Promise<void>;

  getAllEmotionWords: () => Promise<any[]>;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: "",
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  changePassword: async () => {},
  updateProfileInfo: async () => {},

  addBook: async () => {},
  getBooks: async () => [],
  updateBook: async () => {},
  deleteBook: async () => {},

  addQuote: async () => {},
  getQuotes: async () => [],
  deleteQuote: async () => {},

  getAllEmotionWords: async () => [],
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create user profile in Firestore
  async function createUserProfile(uid: string, email: string) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      email,
      createdAt: Date.now(),
      displayName: "",
      bio: "",
      readingStreak: 0,
      lastReadDate: null,
    });
  }

  // Fetch user profile
  async function getUserProfile(uid: string) {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  }

  // Sign Up
  async function signUp(email: string, password: string) {
    try {
      setError("");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(res.user.uid, email);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Sign In
  async function signIn(email: string, password: string) {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // update profile info
  async function updateProfileInfo(data: {
    displayName?: string;
    bio?: string;
  }) {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, data);

    const updated = await getUserProfile(user.uid);
    setProfile(updated);
  }

  // change user password
  async function changePassword(newPassword: string) {
    if (!user) return;
    try {
      await updatePassword(user, newPassword);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Sign Out
  async function logout() {
    await signOut(auth);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // ⭐ Fix: wait for Firestore network to initialize in Expo Go
        await new Promise((resolve) => setTimeout(resolve, 250));

        let userProfile: DocumentData | null = null;

        try {
          userProfile = await getUserProfile(firebaseUser.uid);
        } catch (err) {
          console.log("Firestore offline, retrying…");

          // ⭐ Retry once after a short delay
          await new Promise((resolve) => setTimeout(resolve, 300));
          userProfile = await getUserProfile(firebaseUser.uid);
        }

        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // add a book
  async function addBook(
    title: string,
    author: string,
    finished: boolean,
    rating: number | null,
    emotions: string[],
    totalPages: number | null,
    pagesRead: number | null,
    coverPhoto: string | null,
  ) {
    if (!user) return;

    const booksRef = collection(db, "users", user.uid, "books");
    await addDoc(booksRef, {
      title,
      author,
      finished,
      rating,
      emotions,
      totalPages,
      pagesRead,
      coverPhoto,
      createdAt: Date.now(),
    });
  } // end addBook

  // get all books
  async function getBooks() {
    if (!user) return [];

    const booksRef = collection(db, "users", user.uid, "books");
    const snap = await getDocs(booksRef);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } // end getBooks

  // update a book
  async function updateBook(bookId: string, data: any) {
    if (!user) return;

    const bookRef = doc(db, "users", user.uid, "books", bookId);
    await updateDoc(bookRef, data);
  } // end updateBook

  // delete book
  async function deleteBook(bookId: string) {
    if (!user) return;

    const bookRef = doc(db, "users", user.uid, "books", bookId);
    await deleteDoc(bookRef);
  }

  // add quote
  async function addQuote(text: string, book: string, author: string) {
    if (!user) return;

    const quotesRef = collection(db, "users", user.uid, "quotes");
    await addDoc(quotesRef, { text, book, author, createdAt: Date.now() });
  } // end addQuote

  // get quotes
  async function getQuotes() {
    if (!user) return [];

    const quoteRef = collection(db, "users", user.uid, "quotes");
    const snap = await getDocs(quoteRef);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } //end getQuotes

  // delete quote
  async function deleteQuote(quoteId: string) {
    if (!user) return;

    const quoteRef = doc(db, "users", user.uid, "quotes", quoteId);
    await deleteDoc(quoteRef);
  } // end deleteQuote

  // get all of the emotion words used
  async function getAllEmotionWords() {
    if (!user) return [];

    const booksRef = collection(db, "users", user.uid, "books");
    const booksSnap = await getDocs(booksRef);

    let words: string[] = [];

    for (const bookDoc of booksSnap.docs) {
      const book = bookDoc.data();

      if (book.emotions) {
        words.push(...book.emotions);
      }

      const sessionsRef = collection(
        db,
        "users",
        user.uid,
        "books",
        bookDoc.id,
        "sessions",
      );

      const sessionsSnap = await getDocs(sessionsRef);

      sessionsSnap.forEach((sessionDoc) => {
        const session = sessionDoc.data();
        if (session.feelings) {
          words.push(...session.feelings);
        }
      });
    }

    return words;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signIn,
        signUp,
        logout,
        addBook,
        getBooks,
        updateBook,
        deleteBook,
        addQuote,
        getQuotes,
        deleteQuote,
        getAllEmotionWords,
        updateProfileInfo,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} // end authProvider

export const useAuth = () => useContext(AuthContext);
