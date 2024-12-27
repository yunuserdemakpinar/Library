import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Book } from '../types';

const EditBook = ({ route, navigation }: any) => {
  const { bookId, existingData }: { bookId: string; existingData: Book } = route.params;


  const [title, setTitle] = useState(existingData.title);
  const [isbn, setIsbn] = useState(String(existingData.isbn));
  const [authors, setAuthors] = useState<string[]>(existingData.authors);
  const [authorInput, setAuthorInput] = useState('');
  const [genre, setGenre] = useState(existingData.genre);
  const [coverUri, setCoverUri] = useState(existingData.coverUri || '');

  const handleUpdateBook = async () => {
    if (!title || !isbn || authors.length === 0 || !genre) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (!/^\d+$/.test(isbn)) {
      Alert.alert('Validation Error', 'ISBN must be a valid number.');
      return;
    }

    try {
      await updateDoc(doc(db, 'books', bookId), {
        title,
        isbn: Number(isbn),
        authors,
        genre,
        coverUri: coverUri || null,
      });
      Alert.alert('Success', 'Book updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating book:', error);
      Alert.alert('Error', 'Failed to update book.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="ISBN"
        value={isbn}
        onChangeText={setIsbn}
        style={styles.input}
        keyboardType="numeric"
      />
      <View style={styles.authorContainer}>
        <TextInput
          label="Add Author"
          value={authorInput}
          onChangeText={setAuthorInput}
          style={[styles.input, { flex: 1 }]}
        />
        <Button
          mode="contained"
          onPress={() => {
            if (authorInput.trim()) {
              setAuthors([...authors, authorInput.trim()]);
              setAuthorInput('');
            }
          }}
          style={{ marginLeft: 10 }}
        >
          Add
        </Button>
      </View>
      <View style={styles.chipContainer}>
        {authors.map((author, index) => (
          <Chip key={index} onClose={() => setAuthors(authors.filter((a) => a !== author))}>
            {author}
          </Chip>
        ))}
      </View>
      <TextInput
        label="Genre"
        value={genre}
        onChangeText={setGenre}
        style={styles.input}
      />
      <TextInput
        label="Cover URI"
        value={coverUri}
        onChangeText={setCoverUri}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleUpdateBook} style={styles.button}>
        Update Book
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
});

export default EditBook;
