import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './src/store';
import TodoScreen from './src/TodoScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
          headerStyle: { backgroundColor: '#F5F5F5', elevation: 0, shadowOpacity: 0 },
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
          tabBarLabelStyle: { fontSize: 14, paddingBottom: 5 },
          tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
          tabBarIconStyle: { display: 'none' },
        }}
      >
        <Tab.Screen
          name="All"
          component={TodoScreen}
          options={{ title: 'All Todos' }}
        />
        <Tab.Screen
          name="Pending"
          component={TodoScreen}
          options={{ title: 'Pending' }}
        />
        <Tab.Screen
          name="Completed"
          component={TodoScreen}
          options={{ title: 'Completed' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <AppNavigator />
    </Provider>
  );
};

export default App;