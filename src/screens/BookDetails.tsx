import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';

const BookDetails = ({ route }: any) => {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={book.title} subtitle={`Author(s): ${book.authors.join(', ')}`} />
        <Card.Content>
          <Text>ISBN: {book.isbn}</Text>
          <Text>Genre: {book.genre}</Text>
        </Card.Content>
        {book.coverUri && (
          <Image source={{ uri: book.coverUri }} style={styles.coverImage} />
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
