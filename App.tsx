import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import LoginScreen from './src/screens/LoginScreen';
import MainMenu from './src/screens/MainMenu';
import BookList from './src/screens/BookList';
import AddBook from './src/screens/AddBook';
import ManageBooks from './src/screens/ManageBooks';
import BookDetails from './src/screens/BookDetails';
import EditBook from './src/screens/EditBook';
import RegisterScreen from './src/screens/RegisterScreen';
import ManageUsers from './src/screens/ManageUsers';
import bcrypt from 'react-native-bcrypt';

const Stack = createStackNavigator();

const initializeData = async () => {
  try {
    const salt = bcrypt.genSaltSync(10);

    const users = [
      {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('admin', salt),
        role: 'admin',
      },
      {
        id: 2,
        username: 'user1',
        password: bcrypt.hashSync('user1', salt), 
        role: 'user',
      },
    ];

    const books = [
      {
        id: 1,
        title: 'Book 1',
        isbn: '123456789',
        authors: ['Author 1'],
        genre: 'Fiction',
        userId: 2,
      },
      {
        id: 2,
        title: 'Book 2',
        isbn: '987654321',
        authors: ['Author 2'],
        genre: 'Fantasy',
        userId: 1,
      },
    ];

    await AsyncStorage.setItem('users', JSON.stringify(users));
    await AsyncStorage.setItem('books', JSON.stringify(books));

    console.log('Data initialized successfully!');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Notifications permission is required for alerts.');
    }
  };


  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'No Internet Connection', 
        body: 'You are currently offline.', 
        sound: true,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    initializeData(); 
    requestNotificationPermission();

    let wasConnected: boolean = true;

    const unsubscribe = NetInfo.addEventListener((state) => {
      const currentConnection = state.isConnected ?? false;
      setIsConnected(currentConnection);


      if (wasConnected && !currentConnection) {
        sendNotification();
      }


      if (!wasConnected && currentConnection) {
        console.log('Internet is back online!');
      }


      wasConnected = currentConnection;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="BookList" component={BookList} />
        <Stack.Screen name="EditBook" component={EditBook} />
        <Stack.Screen name="AddBook" component={AddBook} />
        <Stack.Screen name="ManageBooks" component={ManageBooks} />
        <Stack.Screen name="BookDetails" component={BookDetails} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ManageUsers" component={ManageUsers} />
      </Stack.Navigator>
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline</Text>
        </View>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

