import React, { useEffect, useState, useRef } from 'react';
import { Alert, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Accelerometer } from 'expo-sensors';
import * as Brightness from 'expo-brightness';
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
import 'react-native-get-random-values';
const Stack = createStackNavigator();

const initializeData = async () => {
  try {
    const users = await AsyncStorage.getItem('users');
    if (!users) {
      console.log('Initializing data...');
      const salt = bcrypt.genSaltSync(10);

      const userData = [
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

      const bookData = [
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

      await AsyncStorage.setItem('users', JSON.stringify(userData));
      await AsyncStorage.setItem('books', JSON.stringify(bookData));
      console.log('Data initialized successfully!');
    } else {
      console.log('Data already initialized!');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  let lastAcceleration = { x: 0, y: 0, z: 0 };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Notifications permission is required for alerts.');
    }
  };

  const increaseBrightness = async () => {
    try {
      const currentBrightness = await Brightness.getBrightnessAsync();
      console.log(`Current Brightness: ${currentBrightness}`);
      if (currentBrightness < 1) {
        console.log('Setting Brightness to Maximum');
        await Brightness.setBrightnessAsync(1);
        Alert.alert('Brightness Increased', 'The screen brightness has been increased.');
      } else {
        console.log('Brightness is already at maximum');
      }
    } catch (error) {
      console.error('Error adjusting brightness:', error);
    }
  };

  const isDeviceStationary = (x: number, y: number, z: number) => {
    const threshold = 0.02;
    const deltaX = Math.abs(x - lastAcceleration.x);
    const deltaY = Math.abs(y - lastAcceleration.y);
    const deltaZ = Math.abs(z - lastAcceleration.z);

    lastAcceleration = { x, y, z };

    console.log(`Delta: X=${deltaX}, Y=${deltaY}, Z=${deltaZ}`);

    return deltaX < threshold && deltaY < threshold && deltaZ < threshold;
  };

  useEffect(() => {
    const initializeAppData = async () => {
      try {
        const users = await AsyncStorage.getItem('users');
        if (!users) {
          console.log('Initializing data...');
          await initializeData();
        } else {
          console.log('Data already initialized!');
        }
      } catch (error) {
        console.error('Error checking initialization:', error);
      }
    };

    initializeAppData();
    requestNotificationPermission();

    let wasConnected: boolean = true;

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const currentConnection = state.isConnected ?? false;
      setIsConnected(currentConnection);

      if (wasConnected && !currentConnection) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'No Internet Connection',
            body: 'You are currently offline.',
          },
          trigger: null,
        });
      }

      wasConnected = currentConnection;
    });

    Accelerometer.setUpdateInterval(500);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const isStationary = isDeviceStationary(x, y, z);

      console.log(`Stationary Check: ${isStationary}`);

      if (isStationary) {
        if (!timerRef.current) {
          console.log('Starting brightness timer...');
          timerRef.current = setTimeout(() => {
            console.log('Increasing brightness due to stationary state...');
            increaseBrightness();
          }, 5000); // 5 saniye sabit kaldıysa parlaklığı artır
        }
      } else {
        console.log('Device is moving...');
        if (timerRef.current) {
          console.log('Clearing brightness timer...');
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    });

    return () => {
      subscription.remove();
      unsubscribeNetInfo();
      if (timerRef.current) clearTimeout(timerRef.current);
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
