import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import MainMenu from './src/screens/MainMenu';
import BookList from './src/screens/BookList';
import AddBook from './src/screens/AddBook';
import ManageBooks from './src/screens/ManageBooks';
import BookDetails from './src/screens/BookDetails';
import EditBook from './src/screens/EditBook';
import RegisterScreen from './src/screens/RegisterScreen';
const Stack = createStackNavigator();

export default function App() {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
