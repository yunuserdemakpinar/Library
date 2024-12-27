import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'react-native-bcrypt';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
  
      const user = users.find((u: any) => u.username === username);
  
      if (!user) {
        Alert.alert('Error', 'Invalid credentials');
        return;
      }
  
      bcrypt.compare(password, user.password, (err, isPasswordValid) => {
        if (err) {
          Alert.alert('Error', 'An error occurred while verifying the password.');
          return;
        }
  
        if (!isPasswordValid) {
          Alert.alert('Error', 'Invalid credentials');
          return;
        }
  
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('MainMenu', { userId: user.id, role: user.role });
      });
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to log in');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('RegisterScreen')}
        style={styles.registerButton}
      >
        Register
      </Button>
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
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  registerButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default LoginScreen;
