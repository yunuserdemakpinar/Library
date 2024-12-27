// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, FirestoreDataConverter } from 'firebase/firestore';
import { Book } from './types';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYtVYLd6-IuSr1ncnaGsdZrbjXjurpG7o",
  authDomain: "library-c8630.firebaseapp.com",
  projectId: "library-c8630",
  storageBucket: "library-c8630.firebasestorage.app",
  messagingSenderId: "726854290555",
  appId: "1:726854290555:web:7c0fc5be0c8317f44fa6de",
  measurementId: "G-VCT4TRRQQ7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const bookConverter: FirestoreDataConverter<Book> = {
  toFirestore(book: Book) {
    return book;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      authors: data.authors,
      isbn: data.isbn,
      genre: data.genre,
      coverUri: data.coverUri,
      createdAt: data.createdAt,
    };
  },
};