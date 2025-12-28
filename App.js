import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from './src/theme/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyIncidentsScreen from './src/screens/MyIncidentsScreen';
import NewIncidentScreen from './src/screens/NewIncidentScreen';
import IncidentDetailsScreen from './src/screens/IncidentDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

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
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
});
