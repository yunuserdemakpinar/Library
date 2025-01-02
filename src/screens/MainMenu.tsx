import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkSession } from '../utils/session';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const MainMenu = ({ route, navigation }: any) => {
  const { userId, role } = route.params;
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    checkSession(navigation);

    const requestMediaLibraryPermission = async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    };

    requestMediaLibraryPermission();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('session');
    Alert.alert('Success', 'Logged out successfully!');
    navigation.navigate('Login');
  };

  const handleScanBookCover = async () => {
    Alert.alert(
      'Select Option',
      'Choose an option to proceed',
      [
        { text: 'Use Camera', onPress: handleTakePhoto },
        { text: 'Pick from Gallery', onPress: handlePickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleTakePhoto = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Error', 'Camera permission is not granted.');
        return;
      }
    }
  
    const photo = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
  
    if (!photo.canceled) {
      try {
        if (mediaLibraryPermission) {
          Alert.alert('Info', 'Saving photo to gallery...');
          await MediaLibrary.saveToLibraryAsync(photo.assets[0].uri);
          Alert.alert('Success', 'Photo saved to gallery successfully!');
        } else {
          Alert.alert('Error', 'Media library permission is not granted.');
        }
      } catch (error) {
        console.error('Error saving photo to gallery:', error);
        Alert.alert('Error', `Failed to save photo to gallery. Details: ${error.message}`);
      }

      processImage(photo.assets[0].uri);
    }
  };
  
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      try {
        if (mediaLibraryPermission) {
          Alert.alert('Info', 'Saving photo to gallery...');
          await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
          Alert.alert('Success', 'Photo saved to gallery successfully!');
        } else {
          Alert.alert('Error', 'Media library permission is not granted.');
        }
      } catch (error) {
        console.error('Error saving photo to gallery:', error);
        Alert.alert('Error', `Failed to save photo to gallery. Details: ${error.message}`);
      }
  
      processImage(result.assets[0].uri);
    }
  };
  

  const processImage = async (uri: string) => {
    try {
      const fileName = uri.split('/').pop() || 'default-image.jpg';

      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        name: fileName,
        type: 'image/jpeg',
      });

      const apiResponse = await fetch('https://a233-159-146-29-49.ngrok-free.app/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const json = await apiResponse.json();

      if (json.text) {
        Alert.alert('Success', `Text found: ${json.text}`);
        navigation.navigate('BookList', { searchText: json.text });
      } else {
        Alert.alert('Error', 'No text found on the book cover.');
      }
    } catch (error) {
      console.error('Error scanning book cover:', error);
      Alert.alert('Error', `Failed to process the book cover. Details: ${error.message || error}`);
    }
  };

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

      <Button
        mode="contained"
        onPress={handleScanBookCover}
        style={styles.button}
      >
        Scan Book Cover
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
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
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
  button: {
    marginVertical: 10,
  },
});

export default MainMenu;
