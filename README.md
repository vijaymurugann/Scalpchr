# Structura - Expo React Native App

A premium architectural design library and community app built with Expo and React Native.

## Features

- **Authentication**: Login/Sign-up screens with form validation
- **Design Library**: Browse, create, and manage collections of architectural images
- **Image Viewer**: View images full-screen with point-based commenting system
- **Community Chat**: Real-time-style chat with channel management, member management
- **Archive**: Soft-delete and restore functionality for archived items
- **Settings**: Profile management, notifications, and security settings

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Project Structure

```
/workspace
├── App.js                    # Main app entry with navigation
├── src/
│   ├── components/
│   │   └── ImageViewer.js    # Full-screen image viewer with comments
│   ├── screens/
│   │   ├── AuthScreen.js     # Login/Signup screen
│   │   ├── LibraryScreen.js  # Folder management and image grid
│   │   ├── ChatScreen.js     # Community chat with channels
│   │   ├── ArchiveScreen.js  # Archived items view
│   │   └── SettingsScreen.js # User settings
│   └── utils/
│       └── mockData.js       # Mock data and color constants
├── app.json                  # Expo configuration
└── package.json              # Dependencies
```

## Tech Stack

- **Expo SDK 54**
- **React Native 0.81**
- **React Navigation** - Bottom tab navigation
- **Expo Image** - Optimized image loading
- **Expo Image Picker** - Image upload from device
- **Lucide React Native** - Icon library
- **React Native Safe Area Context** - Safe area handling

## Design System

Colors:
- Primary: `#aebf96` (sage green)
- Background: `#000000` (black)
- Surface: `#0a0a0a` (dark gray)
- Text: `#ffffff` (white)

The app uses a dark theme throughout with the signature sage green accent color.
