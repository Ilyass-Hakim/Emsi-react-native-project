import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { theme } from './src/theme/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/reporter/HomeScreen';
import MyIncidentsScreen from './src/screens/reporter/MyIncidentsScreen';
import NewIncidentScreen from './src/screens/reporter/NewIncidentScreen';
import IncidentDetailsScreen from './src/screens/reporter/IncidentDetailsScreen';
import IncidentHistoryScreen from './src/screens/reporter/IncidentHistoryScreen';
import ProfileScreen from './src/screens/reporter/ProfileScreen';
import NotificationsScreen from './src/screens/reporter/NotificationsScreen';

import useStore from './src/store/useStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const { user, loading, initializeAuth } = useStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (currentScreen === 'login' || currentScreen === 'register') {
          setCurrentScreen('home');
        }
      } else {
        setCurrentScreen('login');
      }
    }
  }, [user, loading]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onSignUp={() => setCurrentScreen('register')}
            onLoginSuccess={() => setCurrentScreen('home')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onLogin={() => setCurrentScreen('login')}
          />
        );
      case 'home':
        return (
          <HomeScreen
            onNavPress={(screen) => setCurrentScreen(screen)}
            onReportPress={() => setCurrentScreen('new-incident')}
          />
        );
      case 'my-incidents':
        return (
          <MyIncidentsScreen
            onNavPress={(screen) => setCurrentScreen(screen)}
            onIncidentPress={(id) => {
              setSelectedIncidentId(id);
              setCurrentScreen('incident-details');
            }}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            onNavPress={(screen) => setCurrentScreen(screen)}
          />
        );
      case 'new-incident':
        return (
          <NewIncidentScreen
            onCancel={() => setCurrentScreen('home')}
            onSubmit={() => setCurrentScreen('my-incidents')}
          />
        );
      case 'incident-history':
        return (
          <IncidentHistoryScreen
            onBack={() => setCurrentScreen('home')}
            onNavPress={setCurrentScreen}
          />
        );
      case 'incident-details':
        return (
          <IncidentDetailsScreen
            incidentId={selectedIncidentId}
            onBack={() => setCurrentScreen('my-incidents')}
            onNavPress={(screen) => setCurrentScreen(screen)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onNavPress={(screen) => setCurrentScreen(screen)}
            onLogout={() => setCurrentScreen('login')}
            onSave={() => alert('Profile Saved!')}
          />
        );
      default:
        return (
          <LoginScreen
            onSignUp={() => setCurrentScreen('register')}
            onLoginSuccess={() => setCurrentScreen('home')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        renderScreen()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#102216',
  },
});
