import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageBooks = ({ navigation }: any) => {
  const [books, setBooks] = useState<any[]>([]);

  const fetchBooks = async () => {
    try {
      const existingBooks = await AsyncStorage.getItem('books');
      const allBooks = existingBooks ? JSON.parse(existingBooks) : [];
      setBooks(allBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      Alert.alert('Error', 'Failed to load books.');
    }
  };

  const handleDeleteBook = async (bookId: number) => {
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
              const existingBooks = await AsyncStorage.getItem('books');
              const books = existingBooks ? JSON.parse(existingBooks) : [];

              const updatedBooks = books.filter((book: any) => book.id !== bookId);
              await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));

              Alert.alert('Success', 'Book deleted successfully!');
              fetchBooks(); // Listeyi yenile
            } catch (error) {
              console.error('Error deleting book:', error);
              Alert.alert('Error', 'Failed to delete book.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>No books available.</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.title} subtitle={`Genre: ${item.genre}`} />
          <Card.Content>
            <Text>Authors: {item.authors.join(', ')}</Text>
            <Text>ISBN: {item.isbn}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={() => navigation.navigate('EditBook', { bookId: item.id })}
            >
              Edit
            </Button>
            <Button
              onPress={() => handleDeleteBook(item.id)}
              color="red"
            >
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
