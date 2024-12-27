import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const MainMenu = ({ route, navigation }: any) => {
  const { userId, role } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>

      {/* Tüm kullanıcılar için erişilebilir */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('BookList', { userId, role })}
        style={styles.button}
      >
        View Book List
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddBook', { userId })}
        style={styles.button}
      >
        Add Book
      </Button>

      {/* Admin kullanıcılar için özel erişim */}
      {role === 'admin' && (
        <>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ManageBooks')}
            style={styles.button}
          >
            Manage Books
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ManageUsers')}
            style={styles.button}
          >
            Manage Users
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
