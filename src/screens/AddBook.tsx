import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddBook = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [genre, setGenre] = useState('');
  const [coverUri, setCoverUri] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };


  const resetForm = () => {
    setTitle('');
    setIsbn('');
    setAuthors([]);
    setAuthorInput('');
    setGenre('');
    setCoverUri('');
  };


  const handleAddBook = async () => {

    if (!title || !isbn || authors.length === 0 || !genre || !coverUri) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (!/^\d+$/.test(isbn)) {
      Alert.alert('Validation Error', 'ISBN must be a valid number.');
      return;
    }

    try {
      await addDoc(collection(db, 'books'), {
        title,
        isbn,
        authors,
        genre,
        coverUri,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Book added successfully!');
    } catch (error: any) {
      console.error('Error adding book:', error.message);
      Alert.alert('Error', `Failed to add book: ${error.message}`);
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
      <Button mode="outlined" onPress={pickImage}>
        {coverUri ? 'Change Cover Image' : 'Pick Cover Image'}
      </Button>
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.coverImage} />
      ) : null}
      <Button mode="contained" onPress={handleAddBook} style={styles.button}>
        Add Book
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
  coverImage: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
});

export default AddBook;
