import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'react-native-bcrypt';
import { v4 as uuidv4 } from 'uuid';

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
      console.log('Existing Users:', existingUsers);
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      const user = users.find((u: any) => u.username === username);
      console.log('Matched User:', user);
      if (!user) {
        Alert.alert('Error', 'Invalid credentials');
        return;
      }
  
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      console.log('Password Validation:', isPasswordValid); // Şifre doğrulama sonucunu kontrol edin
  
      if (!isPasswordValid) {
        Alert.alert('Error', 'Invalid credentials');
        return;
      }
  
      const sessionToken = uuidv4();
      await AsyncStorage.setItem(
        'session',
        JSON.stringify({ userId: user.id, role: user.role, token: sessionToken })
      );
  
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('MainMenu', { role: user.role });
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
