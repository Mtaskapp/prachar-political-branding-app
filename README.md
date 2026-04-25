# Prachar - Political Branding App

A cross-platform mobile application for creating and sharing political campaign materials with built-in design templates, offline-first functionality, and social media integration.

## Features

- **Authentication**: Mobile number + OTP verification
- **User Profile**: Name, State, Constituency, and Party selection
- **Campaign Material Creation**: Create posters and videos
- **Offline-First**: All editing and storage works offline
- **Template System**: Party templates, logos, and slogans
- **Image Editing**: Crop photos without background (background removal)
- **Social Sharing**: WhatsApp, Facebook, X, and other platforms
- **Official Party Portal**: Verify and manage official party members
- **Subscription Model**: Premium features for app users

## Tech Stack

- **Framework**: React Native with TypeScript
- **State Management**: Redux Toolkit
- **Local Database**: SQLite / Realm
- **Authentication**: Custom OTP Service
- **Image Processing**: react-native-image-crop-picker
- **Social Sharing**: react-native-share

## Project Structure

```
prachar-political-branding-app/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   ├── Profile/
│   │   ├── Home/
│   │   ├── Editor/
│   │   └── Settings/
│   ├── components/
│   ├── services/
│   ├── redux/
│   ├── utils/
│   ├── assets/
│   ├── navigation/
│   └── App.tsx
├── package.json
├── app.json
└── README.md
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npm start`
4. Run on Android: `npm run android`
5. Run on iOS: `npm run ios`
