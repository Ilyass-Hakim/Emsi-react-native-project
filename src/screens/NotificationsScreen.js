import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const NotificationsScreen = ({ onNavPress }) => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = [
        { id: 'All', icon: 'check_circle', label: 'All' },
        { id: 'Unread', icon: 'circle', label: 'Unread' },
        { id: 'Alerts', icon: 'warning', label: 'Alerts' },
        { id: 'Mentions', icon: 'comment', label: 'Mentions' },
    ];

    const notifications = [
        {
            id: 1,
            title: 'Elevator Malfunction - #429',
            message: 'Technician assigned to your ticket. Estimated arrival time: 10:30 AM.',
            time: '2m ago',
            type: 'build',
            iconColor: '#f87171',
            iconBg: 'rgba(248, 113, 113, 0.15)',
            unread: true,
            group: 'Today'
        },
        {
            id: 2,
            title: 'Workplace Hazard #199',
            message: "Admin added a comment: 'Please attach photos of the exposed wiring so we can assess urgency.'",
            time: '2h ago',
            type: 'chat-bubble',
            iconColor: '#60a5fa',
            iconBg: 'rgba(96, 165, 250, 0.15)',
            unread: true,
            group: 'Today'
        },
        {
            id: 3,
            title: 'Safety Alert: Fire Drill',
            message: 'Scheduled fire drill completed successfully. No further action required.',
            time: 'Yesterday',
            type: 'warning-amber',
            iconColor: '#fbbf24',
            iconBg: 'rgba(251, 191, 36, 0.15)',
            unread: false,
            group: 'Yesterday'
        },
        {
            id: 4,
            title: 'Spill Reported #102',
            message: 'Ticket marked as resolved by cleaning crew.',
            time: 'Yesterday',
            type: 'check-circle',
            iconColor: theme.colors.primary,
            iconBg: 'rgba(19, 236, 91, 0.15)',
            unread: false,
            group: 'Yesterday'
        },
        {
            id: 5,
            title: 'System Maintenance',
            message: 'Scheduled downtime for server upgrades tonight at 2 AM EST.',
            time: 'Yesterday',
            type: 'update',
            iconColor: '#a78bfa',
            iconBg: 'rgba(167, 139, 250, 0.15)',
            unread: false,
            group: 'Yesterday'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <TouchableOpacity>
                        <Text style={styles.markReadText}>Mark all read</Text>
                    </TouchableOpacity>
                </View>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContent}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={[
                                styles.filterChip,
                                activeFilter === filter.id && styles.activeFilterChip
                            ]}
                            onPress={() => setActiveFilter(filter.id)}
                        >
                            <MaterialIcons
                                name={filter.icon}
                                size={18}
                                color={activeFilter === filter.id ? theme.colors.background : theme.colors.textMuted}
                            />
                            <Text style={[
                                styles.filterText,
                                activeFilter === filter.id && styles.activeFilterText
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Group: Today */}
                <Text style={styles.groupLabel}>TODAY</Text>
                {notifications.filter(n => n.group === 'Today').map(item => (
                    <NotificationItem key={item.id} item={item} />
                ))}

                {/* Group: Yesterday */}
                <Text style={[styles.groupLabel, { marginTop: 24 }]}>YESTERDAY</Text>
                {notifications.filter(n => n.group === 'Yesterday').map(item => (
                    <NotificationItem key={item.id} item={item} />
                ))}

                {/* All Caught Up */}
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconBg}>
                        <MaterialIcons name="check" size={24} color={theme.colors.textMuted} />
                    </View>
                    <Text style={styles.emptyText}>You're all caught up!</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <NavButton icon="home" label="Home" onPress={() => onNavPress('home')} />
                <NavButton icon="assignment" label="My Incidents" onPress={() => onNavPress('my-incidents')} />
                <NavButton icon="notifications" label="Notifications" active onPress={() => onNavPress('notifications')} />
                <NavButton icon="person" label="Profile" onPress={() => onNavPress('profile')} />
            </View>
        </SafeAreaView>
    );
};

const NotificationItem = ({ item }) => (
    <TouchableOpacity style={[styles.notiCard, !item.unread && styles.readNotiCard]}>
        <View style={[styles.notiIconWrapper, { backgroundColor: item.iconBg }]}>
            <MaterialIcons name={item.type} size={26} color={item.iconColor} />
        </View>
        <View style={styles.notiContent}>
            <View style={styles.notiTextColumn}>
                <Text style={styles.notiTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.spacing4} />
                <Text style={styles.notiMessage} numberOfLines={3}>{item.message}</Text>
            </View>
        </View>
        <View style={styles.notiRightSide}>
            <Text style={[styles.notiTime, item.unread && styles.unreadTime]}>{item.time}</Text>
            {item.unread && (
                <View style={styles.unreadDot} />
            )}
        </View>
    </TouchableOpacity>
);

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
        backgroundColor: 'rgba(16, 34, 22, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingTop: Platform.OS === 'ios' ? 0 : 40,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: 12,
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    markReadText: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    filterScroll: {
        paddingVertical: 12,
    },
    filterContent: {
        paddingHorizontal: theme.spacing.lg,
        gap: 12,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
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
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 12,
    },
    groupLabel: {
        color: theme.colors.textMuted,
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    notiCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        marginBottom: 16,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    readNotiCard: {
        opacity: 0.7,
        borderColor: 'transparent',
    },
    notiIconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    notiContent: {
        flex: 1,
        paddingTop: 2,
    },
    notiTextColumn: {
        flex: 1,
    },
    notiTitle: {
        color: theme.colors.text,
        fontSize: 17,
        fontWeight: '800',
        lineHeight: 22,
        letterSpacing: 0.3,
    },
    spacing4: {
        height: 6,
    },
    notiMessage: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
    },
    notiRightSide: {
        alignItems: 'flex-end',
        paddingTop: 4,
        paddingLeft: 8,
    },
    notiTime: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: '600',
    },
    unreadTime: {
        color: theme.colors.primary,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
        marginTop: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    emptyIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontSize: 14,
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

export default NotificationsScreen;
