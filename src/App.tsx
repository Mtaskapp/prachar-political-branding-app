import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from '@redux/store';
import RootNavigator from '@navigation/RootNavigator';
import databaseService from '@services/databaseService';

const App = () => {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize local database
        await databaseService.initDatabase();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setDbInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!dbInitialized) {
    return null; // Or show a splash screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
