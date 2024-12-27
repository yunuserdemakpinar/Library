import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Card } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { db, bookConverter } from '../firebaseConfig';
import { Book } from '../types';

const BookList = ({ navigation }: any) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterBy, setFilterBy] = useState<'title' | 'authors' | 'isbn' | 'genre'>('title');
  const [sortBy, setSortBy] = useState<'title' | 'authors' | 'isbn' | 'genre'>('title');

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'books').withConverter(bookConverter)
      );
      const booksData = querySnapshot.docs.map(doc => doc.data());
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = () => {
    const lowerSearchText = searchText.toLowerCase();
    const filtered = books.filter(book => {
      let target = '';
      if (filterBy === 'authors') {
        target = book.authors.join(' ').toLowerCase();
      } else if (filterBy === 'isbn') {
        target = String(book.isbn).toLowerCase();
      } else if (filterBy === 'title' || filterBy === 'genre') {
        target = book[filterBy]?.toLowerCase() || '';
      }
      return target.includes(lowerSearchText);
    });
    setFilteredBooks(filtered);
  };

  const handleSort = () => {
    const sorted = [...filteredBooks].sort((a, b) => {
      if (sortBy === 'authors') {
        return a.authors[0]?.localeCompare(b.authors[0] || '');
      } else if (sortBy === 'isbn') {
        return String(a.isbn).localeCompare(String(b.isbn));
      } else {
        return a[sortBy]?.localeCompare(b[sortBy] || '') || 0;
      }
    });
    setFilteredBooks(sorted);
  };

  const renderCustomButton = (label: string, isActive: boolean, onPress: () => void) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, isActive && styles.activeButton]}
      >
        <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Search"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />
      <View style={styles.filterButtons}>
        {renderCustomButton('Title', filterBy === 'title', () => setFilterBy('title'))}
        {renderCustomButton('Authors', filterBy === 'authors', () => setFilterBy('authors'))}
        {renderCustomButton('ISBN', filterBy === 'isbn', () => setFilterBy('isbn'))}
        {renderCustomButton('Genre', filterBy === 'genre', () => setFilterBy('genre'))}
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      <View style={styles.sortButtons}>
        {renderCustomButton('Title', sortBy === 'title', () => setSortBy('title'))}
        {renderCustomButton('Authors', sortBy === 'authors', () => setSortBy('authors'))}
        {renderCustomButton('ISBN', sortBy === 'isbn', () => setSortBy('isbn'))}
        {renderCustomButton('Genre', sortBy === 'genre', () => setSortBy('genre'))}
      </View>
      <TouchableOpacity style={styles.sortButtonMain} onPress={handleSort}>
        <Text style={styles.sortButtonText}>Sort</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => navigation.navigate('BookDetails', { book: item })}
          >
            <Card.Title title={item.title} subtitle={`Authors: ${item.authors.join(', ')}`} />
          </Card>
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
  input: {
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'purple',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: 'white',
  },
  searchButton: {
    padding: 10,
    backgroundColor: 'purple',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sortButtonMain: {
    padding: 10,
    backgroundColor: 'purple',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  sortButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    marginVertical: 8,
  },
});

export default BookList;
