import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { FolderOpen, MessageSquare, Archive, Settings } from 'lucide-react-native';

import AuthScreen from './src/screens/AuthScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import ChatScreen from './src/screens/ChatScreen';
import ArchiveScreen from './src/screens/ArchiveScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { COLORS, initialFolders, generateMockContent } from './src/utils/mockData';

const Tab = createBottomTabNavigator();

const DarkTheme = {
  dark: true,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.primary,
  },
};

function MainTabs({ onLogout }) {
  // Lifted state for folders and archive
  const [folders, setFolders] = useState(initialFolders);
  const [archive, setArchive] = useState([]);

  const handleArchiveItem = (folderId, itemId) => {
    setFolders(prevFolders => {
      const folder = prevFolders.find(f => f.id === folderId);
      const itemToArchive = folder?.content.find(item => item.id === itemId);
      
      if (itemToArchive) {
        setArchive(prev => [{
          ...itemToArchive, 
          originalFolderId: folderId, 
          originalFolderName: folder.name,
          archivedDate: new Date().toLocaleDateString() 
        }, ...prev]);

        return prevFolders.map(f => {
          if (f.id === folderId) {
            const newContent = f.content.filter(i => i.id !== itemId);
            return {
              ...f,
              content: newContent,
              items: newContent.length
            };
          }
          return f;
        });
      }
      return prevFolders;
    });
  };

  const handleRestoreItem = (item) => {
    setArchive(prev => prev.filter(i => i.id !== item.id));
    setFolders(prev => prev.map(f => {
      if (f.id === item.originalFolderId) {
        return {
          ...f,
          content: [item, ...f.content],
          items: f.items + 1
        };
      }
      return f;
    }));
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Library" 
        options={{
          tabBarIcon: ({ color, size }) => <FolderOpen size={size} color={color} />,
        }}
      >
        {(props) => (
          <LibraryScreen 
            {...props} 
            folders={folders} 
            setFolders={setFolders} 
            onArchiveItem={handleArchiveItem} 
          />
        )}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      
      <Tab.Screen 
        name="Archive" 
        options={{
          tabBarIcon: ({ color, size }) => <Archive size={size} color={color} />,
        }}
      >
        {(props) => (
          <ArchiveScreen 
            {...props} 
            archive={archive} 
            onRestore={handleRestoreItem} 
          />
        )}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Settings" 
        options={{
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      >
        {(props) => <SettingsScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={DarkTheme}>
        <StatusBar style="light" />
        {isAuthenticated ? (
          <MainTabs onLogout={() => setIsAuthenticated(false)} />
        ) : (
          <AuthScreen onLogin={() => setIsAuthenticated(true)} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.borderLight,
    borderTopWidth: 1,
    height: 85,
    paddingBottom: 25,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
