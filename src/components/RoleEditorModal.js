import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Switch,
    ActivityIndicator,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#13ec5b', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#64748b'];
const ICONS = ['security', 'admin-panel-settings', 'visibility', 'edit', 'delete', 'add', 'person', 'group', 'assignment', 'analytics', 'settings', 'build', 'warning', 'info'];

const PERMISSIONS_LIST = [
    { id: 'view_incidents', label: 'View Incidents' },
    { id: 'create_incidents', label: 'Create Incidents' },
    { id: 'edit_incidents', label: 'Edit Incidents' },
    { id: 'delete_incidents', label: 'Delete Incidents' },
    { id: 'assign_responders', label: 'Assign Responders' },
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_roles', label: 'Manage Roles' },
    { id: 'view_analytics', label: 'View Analytics' },
    { id: 'export_data', label: 'Export Data' },
];

const RoleEditorModal = ({ visible, onClose, onSave, initialRole }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [icon, setIcon] = useState(ICONS[0]);
    const [permissions, setPermissions] = useState({});
    const [baseRole, setBaseRole] = useState('Responder');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialRole) {
                setName(initialRole.label || '');
                setDescription(initialRole.description || '');
                setColor(initialRole.color || COLORS[0]);
                setIcon(initialRole.icon || ICONS[0]);
                setPermissions(initialRole.permissions || {});
                setBaseRole(initialRole.baseRole || 'Responder');
            } else {
                resetForm();
            }
        }
    }, [visible, initialRole]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setColor(COLORS[0]);
        setIcon(ICONS[0]);
        setPermissions({});
        setBaseRole('Responder');
    };

    const togglePermission = (id) => {
        setPermissions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Role name is required');
            return;
        }

        setLoading(true);
        try {
            const roleData = {
                label: name,
                description,
                color,
                icon,
                permissions,
                baseRole,
                isSystem: false // Custom roles are never system roles
            };
            await onSave(roleData);
            onClose();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{initialRole ? 'Edit Role' : 'New Role'}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <MaterialIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Name & Desc */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Role Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Area Manager"
                                placeholderTextColor="#64748b"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                placeholder="Brief description of responsibilities..."
                                placeholderTextColor="#64748b"
                                multiline
                                numberOfLines={3}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>

                        {/* Base Role Selection */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Base Role Type</Text>
                            <View style={styles.baseRoleContainer}>
                                {['Reporter', 'Responder', 'Reviewer', 'Admin'].map(r => (
                                    <TouchableOpacity
                                        key={r}
                                        style={[
                                            styles.baseRoleChip,
                                            baseRole === r && styles.baseRoleChipActive
                                        ]}
                                        onPress={() => setBaseRole(r)}
                                    >
                                        <Text style={[
                                            styles.baseRoleText,
                                            baseRole === r && styles.baseRoleTextActive
                                        ]}>{r}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.helperText}>This determines where this role appears (e.g. Responder types appear in registration).</Text>
                        </View>

                        {/* Color Picker */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Color Tag</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                                {COLORS.map(c => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: c },
                                            color === c && styles.selectedColor
                                        ]}
                                        onPress={() => setColor(c)}
                                    >
                                        {color === c && <MaterialIcons name="check" size={16} color="#fff" />}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Icon Picker */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Icon</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                                {ICONS.map(i => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[
                                            styles.iconOption,
                                            icon === i && { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary }
                                        ]}
                                        onPress={() => setIcon(i)}
                                    >
                                        <MaterialIcons name={i} size={24} color={icon === i ? theme.colors.primary : '#9ca3af'} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Permissions */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Permissions</Text>
                            <View style={styles.permissionsList}>
                                {PERMISSIONS_LIST.map(perm => (
                                    <TouchableOpacity
                                        key={perm.id}
                                        style={styles.permissionItem}
                                        onPress={() => togglePermission(perm.id)}
                                    >
                                        <Text style={styles.permText}>{perm.label}</Text>
                                        <Switch
                                            value={!!permissions[perm.id]}
                                            onValueChange={() => togglePermission(perm.id)}
                                            trackColor={{ false: '#374151', true: theme.colors.primary + '50' }}
                                            thumbColor={permissions[perm.id] ? theme.colors.primary : '#9ca3af'}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.saveText}>Save Role</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: '#1c2e24',
        borderRadius: 16,
        maxHeight: '90%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    section: {
        marginBottom: 20,
    },
    scrollContent: {
        padding: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#9ca3af',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#102216',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    pickerScroll: {
        flexDirection: 'row',
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    iconOption: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#102216',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    permissionsList: {
        backgroundColor: '#102216',
        borderRadius: 12,
        padding: 8,
    },
    permissionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    permText: {
        color: '#fff',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontWeight: '600',
    },
    saveBtn: {
        flex: 2,
        padding: 14,
        borderRadius: 12,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
    },
    saveText: {
        color: '#102216', // Dark text on green
        fontWeight: 'bold',
    },
    baseRoleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    baseRoleChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#102216',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    baseRoleChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    baseRoleText: {
        color: '#9ca3af',
        fontSize: 12,
        fontWeight: '600',
    },
    baseRoleTextActive: {
        color: '#102216',
    },
    helperText: {
        fontSize: 11,
        color: '#64748b',
        marginTop: 6,
        fontStyle: 'italic',
    },
});

export default RoleEditorModal;
