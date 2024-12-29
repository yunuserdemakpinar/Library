import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkSession } from '../utils/session';
const BookList = ({ route, navigation }: any) => {
  const { userId, role } = route.params;
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    checkSession(navigation);
    const fetchBooks = async () => {
      try {
        const existingBooks = await AsyncStorage.getItem('books');
        const allBooks = existingBooks ? JSON.parse(existingBooks) : [];

        const filteredBooks =
          role === 'admin' ? allBooks : allBooks.filter((book: any) => book.userId === userId);

        setBooks(filteredBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
        Alert.alert('Error', 'Failed to load books.');
      }
    };

    fetchBooks();
  }, [userId, role]);

  const handleBookPress = (bookId: number) => {
    navigation.navigate('BookDetails', { bookId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No books available.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBookPress(item.id)}>
            <Card style={styles.card}>
              <Card.Title title={item.title} subtitle={`Genre: ${item.genre}`} />
              <Card.Content>
                <Text>Authors: {item.authors.join(', ')}</Text>
                <Text>ISBN: {item.isbn}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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

export default BookList;
