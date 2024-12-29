import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkSession } from '../utils/session';
const AddBook = ({ navigation, route }: any) => {
  useEffect(() => {
    checkSession(navigation);
  }, []);
  const { userId } = route.params;
  const [title, setTitle] = useState<string>('');
  const [isbn, setIsbn] = useState<string>('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Media library access is required to pick an image.');
      return;
    }

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

  const handleAddAuthor = () => {
    if (authorInput.trim() === '') {
      Alert.alert('Validation Error', 'Author name cannot be empty.');
      return;
    }
    setAuthors([...authors, authorInput.trim()]);
    setAuthorInput('');
  };

  const handleRemoveAuthor = (authorToRemove: string) => {
    setAuthors(authors.filter((author) => author !== authorToRemove));
  };

  const handleAddBook = async () => {
    if (!title || !isbn || authors.length === 0 || !genre) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      const existingBooks = await AsyncStorage.getItem('books');
      const books = existingBooks ? JSON.parse(existingBooks) : [];

      const newBook = {
        id: books.length + 1,
        title,
        isbn,
        authors,
        genre,
        coverUri,
        userId,
      };

      await AsyncStorage.setItem('books', JSON.stringify([...books, newBook]));

      Alert.alert('Success', 'Book added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert('Error', 'Failed to add book.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />
      <TextInput
        label="ISBN"
        value={isbn}
        onChangeText={(text) => setIsbn(text)}
        style={styles.input}
      />
      <View style={styles.authorContainer}>
        <TextInput
          label="Add Author"
          value={authorInput}
          onChangeText={(text) => setAuthorInput(text)}
          onSubmitEditing={handleAddAuthor}
          style={[styles.input, { flex: 1 }]}
        />
        <Button onPress={handleAddAuthor} style={styles.addButton}>
          Add
        </Button>
      </View>
      <View style={styles.chipContainer}>
        {authors.map((author, index) => (
          <Chip key={index} onClose={() => handleRemoveAuthor(author)}>
            {author}
          </Chip>
        ))}
      </View>
      <TextInput
        label="Genre"
        value={genre}
        onChangeText={(text) => setGenre(text)}
        style={styles.input}
      />
      <Button mode="outlined" onPress={pickImage}>
        {coverUri ? 'Change Cover Image' : 'Pick Cover Image'}
      </Button>
      {coverUri && (
        <Image source={{ uri: coverUri }} style={styles.coverImage} />
      )}
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
  addButton: {
    marginLeft: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  coverImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default AddBook;
