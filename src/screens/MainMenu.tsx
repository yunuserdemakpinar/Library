import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const MainMenu = ({ route, navigation }: any) => {
  const { role } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('BookList')}
        style={styles.button}
      >
        View Book List
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddBook')}
        style={styles.button}
      >
        Add Book
      </Button>
      {role === 'admin' && (
        <>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ManageBooks')}
            style={styles.button}
          >
            Manage Books
          </Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
});

export default MainMenu;
