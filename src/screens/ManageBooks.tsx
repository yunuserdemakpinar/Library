import React, { useState, useCallback } from 'react';
import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { db, bookConverter } from '../firebaseConfig';
import { Book } from '../types';

const ManageBooks = ({ navigation }: any) => {
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'books').withConverter(bookConverter)
      );
      const booksData = querySnapshot.docs.map(doc => doc.data());
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
      Alert.alert('Error', 'Failed to load books.');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'books', bookId));
              Alert.alert('Success', 'Book deleted successfully!');
              setBooks(books.filter(book => book.id !== bookId));
            } catch (error) {
              console.error('Error deleting book:', error);
              Alert.alert('Error', 'Failed to delete book.');
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  return (
    <FlatList
      data={books}
      keyExtractor={item => item.id}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>No books available.</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.title} subtitle={`Author(s): ${item.authors.join(', ')}`} />
          <Card.Content>
            <Text>ISBN: {item.isbn}</Text>
            <Text>Genre: {item.genre}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('EditBook', { bookId: item.id, existingData: item })}>
              Edit
            </Button>
            <Button onPress={() => handleDeleteBook(item.id)} color="red">
              Delete
            </Button>
          </Card.Actions>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 10,
    padding: 10,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManageBooks;
