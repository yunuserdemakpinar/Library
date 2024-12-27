import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const EditBook = ({ route, navigation }: any) => {
  const { bookId } = route.params; // Düzenlenecek kitabın ID'si
  const [title, setTitle] = useState<string>('');
  const [isbn, setIsbn] = useState<string>('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [genre, setGenre] = useState<string>('');
  const [coverUri, setCoverUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const existingBooks = await AsyncStorage.getItem('books');
        const books = existingBooks ? JSON.parse(existingBooks) : [];
        const book = books.find((b: any) => b.id === bookId);

        if (book) {
          setTitle(book.title);
          setIsbn(book.isbn);
          setAuthors(book.authors);
          setGenre(book.genre);
          setCoverUri(book.coverUri);
        } else {
          Alert.alert('Error', 'Book not found.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        Alert.alert('Error', 'Failed to load book details.');
      }
    };

    fetchBook();
  }, [bookId, navigation]);

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

  const handleUpdateBook = async () => {
    if (!title || !isbn || authors.length === 0 || !genre) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      const existingBooks = await AsyncStorage.getItem('books');
      const books = existingBooks ? JSON.parse(existingBooks) : [];

      const updatedBooks = books.map((book: any) =>
        book.id === bookId
          ? { ...book, title, isbn, authors, genre, coverUri }
          : book
      );

      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));

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
          value=""
          onSubmitEditing={(event) => {
            setAuthors([...authors, event.nativeEvent.text.trim()]);
          }}
          style={[styles.input, { flex: 1 }]}
        />
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
        onChangeText={(text) => setGenre(text)}
        style={styles.input}
      />
      <Button mode="outlined" onPress={pickImage}>
        {coverUri ? 'Change Cover Image' : 'Pick Cover Image'}
      </Button>
      {coverUri && (
        <Image source={{ uri: coverUri }} style={styles.coverImage} />
      )}
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
  coverImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default EditBook;
