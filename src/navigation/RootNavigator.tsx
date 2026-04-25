import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Auth Screens
import PhoneLoginScreen from '@screens/Auth/PhoneLoginScreen';
import OTPVerificationScreen from '@screens/Auth/OTPVerificationScreen';
import UserProfileScreen from '@screens/Auth/UserProfileScreen';

// Home Screens
import HomeScreen from '@screens/Home/HomeScreen';
import SubscriptionScreen from '@screens/Home/SubscriptionScreen';

// Editor Screens
import PosterEditorScreen from '@screens/Editor/PosterEditorScreen';
import ShareOptionsScreen from '@screens/Editor/ShareOptionsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
};

const EditorStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PosterEditor" component={PosterEditorScreen} />
      <Stack.Screen name="VideoEditor" component={PosterEditorScreen} />
      <Stack.Screen name="ShareOptions" component={ShareOptionsScreen} />
      <Stack.Screen name="Settings" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const isAuthenticated = false; // TODO: Get from Redux state

  return (
    <NavigationContainer>
      {isAuthenticated ? <EditorStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
