import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const checkSession = async (navigation: any) => {
  const session = await AsyncStorage.getItem('session');
  if (!session) {
    Alert.alert('Error', 'Session expired. Please log in again.');
    navigation.navigate('Login');
  }
};
