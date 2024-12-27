import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import bcrypt from 'react-native-bcrypt';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username === 'admin' && password === 'admin123') {
      navigation.navigate('MainMenu', { role: 'admin' });
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'Invalid credentials');
        return;
      }

      let user: any = null;
      querySnapshot.forEach((doc) => {
        user = doc.data() as { password?: string; role?: string };
      });

      if (!user) {
        Alert.alert('Error', 'Invalid credentials');
        return;
      }
      if (user?.password) {
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
          navigation.navigate('MainMenu', { role: user.role || 'user' });
        });
      } else {
        Alert.alert('Error', 'Password field is missing.');
      }
      navigation.navigate('MainMenu', { role: user.role || 'user' });
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