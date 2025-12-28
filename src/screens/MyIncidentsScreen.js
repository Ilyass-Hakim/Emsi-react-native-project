import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const MyIncidentsScreen = ({ onNavPress, onIncidentPress }) => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Open', 'In Progress', 'Resolved'];

    const incidents = [
        {
            id: '4501',
            title: 'Fire Alarm Malfunction',
            time: 'Today, 11:45 AM',
            location: 'Main Building, Floor 2',
            status: 'Open',
            icon: 'warning',
            iconBg: 'rgba(245, 101, 101, 0.1)',
            iconColor: theme.colors.error,
            statusColor: theme.colors.blue,
        },
        {
            id: '4489',
            title: 'Broken Elevator',
            time: 'Yesterday, 4:15 PM',
            location: 'West Wing, Lobby',
            status: 'In Progress',
            icon: 'elevator',
            iconBg: 'rgba(246, 173, 85, 0.1)',
            iconColor: theme.colors.orange,
            statusColor: theme.colors.orange,
        },
        {
            id: '4492',
            title: 'Water Leak in Lobby',
            time: 'Oct 14, 10:30 AM',
            location: 'Entrance Hall',
            status: 'Resolved',
            icon: 'water-drop',
            iconBg: 'rgba(99, 179, 237, 0.1)',
            iconColor: theme.colors.blue,
            statusColor: theme.colors.primary,
        },
        {
            id: '4471',
            title: 'Wi-Fi Connection Issues',
            time: 'Oct 12, 9:00 AM',
            location: 'Conference Room B',
            status: 'Resolved',
            icon: 'wifi-off',
            iconBg: 'rgba(159, 122, 234, 0.1)',
            iconColor: '#9f7aea',
            statusColor: theme.colors.primary,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>My Incidents</Text>
                    <TouchableOpacity style={styles.filterMenuBtn}>
                        <MaterialIcons name="filter-list" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContent}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            style={[
                                styles.filterChip,
                                activeFilter === filter && styles.activeFilterChip
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilter === filter && styles.activeFilterText
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Incident List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {incidents.map((incident) => (
                    <TouchableOpacity
                        key={incident.id}
                        style={styles.incidentCard}
                        onPress={() => onIncidentPress(incident.id)}
                    >
                        <View style={styles.cardTop}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconWrapper, { backgroundColor: incident.iconBg }]}>
                                    <MaterialIcons name={incident.icon} size={24} color={incident.iconColor} />
                                </View>
                                <View style={styles.titleInfo}>
                                    <Text style={styles.incidentTitle}>{incident.title}</Text>
                                    <Text style={styles.incidentMeta}>ID: #{incident.id} • {incident.time}</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textMuted} />
                        </View>

                        <View style={styles.cardBottom}>
                            <View style={styles.locationRow}>
                                <MaterialIcons name="location-on" size={14} color={theme.colors.textMuted} />
                                <Text style={styles.locationText}>{incident.location}</Text>
                            </View>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: incident.statusColor + '15' }
                            ]}>
                                {incident.status === 'Resolved' && (
                                    <MaterialIcons name="check" size={12} color={incident.statusColor} style={{ marginRight: 4 }} />
                                )}
                                <Text style={[styles.statusText, { color: incident.statusColor }]}>
                                    {incident.status.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                {/* Spacer for FAB */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => onNavPress('new-incident')}
            >
                <MaterialIcons name="add" size={32} color={theme.colors.background} />
            </TouchableOpacity>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <NavButton
                    icon="home"
                    label="Home"
                    onPress={() => onNavPress('home')}
                />
                <NavButton
                    icon="assignment"
                    label="My Incidents"
                    active
                    onPress={() => onNavPress('my-incidents')}
                />
                <NavButton
                    icon="notifications"
                    label="Notifications"
                    onPress={() => onNavPress('notifications')}
                />
                <NavButton
                    icon="person"
                    label="Profile"
                    onPress={() => onNavPress('profile')}
                />
            </View>
        </SafeAreaView>
    );
};

const NavButton = ({ icon, label, active, onPress }) => (
    <TouchableOpacity style={styles.navBtn} onPress={onPress}>
        {active && <View style={styles.activeDot} />}
        <MaterialIcons
            name={icon}
            size={26}
            color={active ? theme.colors.primary : theme.colors.textMuted}
        />
        <Text style={[
            styles.navLabel,
            { color: active ? theme.colors.primary : theme.colors.textMuted, fontWeight: active ? 'bold' : '500' }
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        backgroundColor: theme.colors.background,
        paddingTop: theme.spacing.sm,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    filterMenuBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterScroll: {
        paddingLeft: theme.spacing.lg,
    },
    filterContent: {
        paddingRight: theme.spacing.xl,
        paddingBottom: theme.spacing.md,
        gap: 12,
    },
    filterChip: {
        height: 36,
        paddingHorizontal: 20,
        borderRadius: 18,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeFilterChip: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    activeFilterText: {
        color: theme.colors.background,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
    },
    incidentCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.xl,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleInfo: {
        flex: 1,
    },
    incidentTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    incidentMeta: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        height: 84,
        backgroundColor: '#0c1a11',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingBottom: 20,
    },
    navBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
    },
    navLabel: {
        fontSize: 10,
        marginTop: 4,
    },
    activeDot: {
        position: 'absolute',
        top: 0,
        width: 32,
        height: 2,
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
});

export default MyIncidentsScreen;
