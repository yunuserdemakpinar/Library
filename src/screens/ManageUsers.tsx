import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const allUsers = existingUsers ? JSON.parse(existingUsers) : [];

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const existingUsers = await AsyncStorage.getItem('users');
              const users = existingUsers ? JSON.parse(existingUsers) : [];

              const updatedUsers = users.filter((user: any) => user.id !== userId);
              await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

              Alert.alert('Success', 'User deleted successfully!');
              fetchUsers(); // Listeyi yenile
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>No users available.</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.username} subtitle={`Role: ${item.role}`} />
          <Card.Actions>
            <Button
              onPress={() => handleDeleteUser(item.id)}
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

export default ManageUsers;
