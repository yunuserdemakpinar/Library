import React, { useEffect } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkSession } from '../utils/session';
import * as ImagePicker from 'expo-image-picker';

const MainMenu = ({ route, navigation }: any) => {
  const { userId, role } = route.params;

  useEffect(() => {
    checkSession(navigation);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('session');
    Alert.alert('Success', 'Logged out successfully!');
    navigation.navigate('Login');
  };

  const handleScanBookCover = async () => {
    try {
      //Alert.alert('Info', 'Opening image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        //Alert.alert('Info', 'Image selected successfully.');
        const { uri } = result.assets[0];
  
        //Alert.alert('Info', `Image URI: ${uri}`);
        
        // Resmi Blob'a dönüştür
        const response = await fetch(uri);
        //const blob = await response.blob();

        const fileName = uri.split('/').pop() || 'default-image.jpg';

        const formData = new FormData();
        formData.append('image', {
          uri: uri,
          name: fileName, // Dinamik dosya adı
          type: 'image/jpeg', // MIME türü
        });

        //Alert.alert('Info', 'FormData created.');
        console.log(formData);
        // API'ye gönder
        //Alert.alert('Info', 'Sending image to API...');
        const apiResponse = await fetch('https://a233-159-146-29-49.ngrok-free.app/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
  
        Alert.alert('Info', 'API response received.');
  
        const json = await apiResponse.json();
        Alert.alert('API Response', JSON.stringify(json));
  
        if (json.text) {
          Alert.alert('Success', `Text found: ${json.text}`);
          navigation.navigate('BookList', { searchText: json.text });
        } else {
          Alert.alert('Error', 'No text found on the book cover.');
        }
      } else {
        Alert.alert('Info', 'Image selection canceled.');
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