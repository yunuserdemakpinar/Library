import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Text, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookDetails = ({ route }: any) => {
  const { bookId } = route.params; // Görüntülenecek kitabın ID'si
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const existingBooks = await AsyncStorage.getItem('books');
        const books = existingBooks ? JSON.parse(existingBooks) : [];
        const bookDetails = books.find((b: any) => b.id === bookId);

        if (bookDetails) {
          setBook(bookDetails);
        } else {
          Alert.alert('Error', 'Book not found.');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [bookId]);

  if (!book) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={book.title} subtitle={`Genre: ${book.genre}`} />
        <Card.Content>
          <Text>Authors: {book.authors.join(', ')}</Text>
          <Text>ISBN: {book.isbn}</Text>
        </Card.Content>
        {book.coverUri ? (
          <Image source={{ uri: book.coverUri }} style={styles.coverImage} />
        ) : (
          <Text>No cover image available</Text>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default BookDetails;
