import React from 'react';
import IncidentHistoryScreen from './IncidentHistoryScreen';

const NotificationsScreen = ({ onNavPress }) => {
  return (
    <IncidentHistoryScreen onBack={() => onNavPress && onNavPress('home')} onNavPress={onNavPress} />
  );
};

export default NotificationsScreen;

