import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { FirebaseService } from '../services/firebaseService';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// We need the config to create a secondary app
const firebaseConfig = {
    apiKey: "AIzaSyB0rw_vlwzPDs9Td28_xaGp4xdOg1Amw8k",
    authDomain: "internal-issue-reporting-ead17.firebaseapp.com",
    projectId: "internal-issue-reporting-ead17",
    storageBucket: "internal-issue-reporting-ead17.firebasestorage.app",
    messagingSenderId: "495021351206",
    appId: "1:495021351206:web:ffad200afb3651ab9b61e7",
    measurementId: "G-NX5530VB9G"
};

const RegisterScreen = ({ onLogin, onBack }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [role, setRole] = useState('Reporter');
    const [customRoles, setCustomRoles] = useState([]);
    const [selectedSubRole, setSelectedSubRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = FirebaseService.subscribeToRoles(
            (data) => setCustomRoles(data),
            (err) => console.error("Error fetching roles:", err)
        );
        return () => unsubscribe();
    }, []);

    const responderTypes = customRoles.filter(r => r.baseRole === 'Responder');

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        let secondaryApp = null;
        try {
            // 1. Create a secondary app instance to avoid signing out the current user (Admin)
            const appName = 'secondaryApp-' + new Date().getTime();
            secondaryApp = initializeApp(firebaseConfig, appName);
            const secondaryAuth = getAuth(secondaryApp);

            // 2. Create user on the secondary app
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const user = userCredential.user;

            // 3. Save additional user info to Firestore (using MAIN DB is fine)
            await setDoc(doc(db, 'users', user.uid), {
                fullName,
                email,
                role,
                responderType: role === 'Responder' ? (selectedSubRole?.label || 'General') : null,
                department: 'Not assigned',
                createdAt: new Date().toISOString(),
            });

            // 4. Sign out the *secondary* user immediately
            await signOut(secondaryAuth);

            Alert.alert(
                'Success',
                'User account created successfully!',
                [
                    {
                        text: 'Add Another',
                        onPress: () => {
                            setFullName('');
                            setEmail('');
                            setPassword('');
                            setConfirmPassword('');
                            setRole('Reporter');
                            setSelectedSubRole(null);
                        }
                    },
                    {
                        text: 'Done',
                        onPress: () => {
                            if (onBack) onBack();
                            else onLogin();
                        }
                    }
                ]
            );

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            // 5. Cleanup the secondary app
            if (secondaryApp) {
                try {
                    await deleteApp(secondaryApp);
                } catch (e) {
                    console.warn("Error deleting secondary app:", e);
                }
            }
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.headerNav}>
                <TouchableOpacity style={styles.backButton} onPress={onBack || onLogin}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headline}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join to report and manage incidents effectively.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter full name"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                                <View style={[styles.inputIconWrapper, styles.rightIconBorder]}>
                                    <MaterialIcons name="person" size={24} color={theme.colors.textSecondary} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter email"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <View style={[styles.inputIconWrapper, styles.rightIconBorder]}>
                                    <MaterialIcons name="mail" size={24} color={theme.colors.textSecondary} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Create a password"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    style={[styles.inputIconWrapper, styles.rightIconBorder]}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <MaterialIcons
                                        name={showPassword ? "visibility" : "visibility-off"}
                                        size={24}
                                        color={theme.colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Repeat password"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    style={[styles.inputIconWrapper, styles.rightIconBorder]}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <MaterialIcons
                                        name={showConfirmPassword ? "visibility" : "visibility-off"}
                                        size={24}
                                        color={theme.colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Register as</Text>
                            <View style={styles.roleSelectionRow}>
                                {['Reporter', 'Reviewer', 'Responder', 'Admin'].map(r => (
                                    <TouchableOpacity
                                        key={r}
                                        style={[
                                            styles.roleChip,
                                            role === r && styles.roleChipActive
                                        ]}
                                        onPress={() => setRole(r)}
                                    >
                                        <MaterialIcons
                                            name={r === 'Reporter' ? 'person' : r === 'Reviewer' ? 'verified-user' : r === 'Responder' ? 'medical-services' : 'admin-panel-settings'}
                                            size={18}
                                            color={role === r ? theme.colors.background : theme.colors.textSecondary}
                                        />
                                        <Text style={[
                                            styles.roleChipText,
                                            role === r && styles.roleChipTextActive
                                        ]}>{r}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Specialized Responder Dropdown - Always show if role is Responder */}
                            {role === 'Responder' && (
                                <View style={styles.subRoleSection}>
                                    <View style={styles.subRoleHeader}>
                                        <Text style={styles.subLabel}>Specialization Type</Text>
                                        {responderTypes.length === 0 && (
                                            <Text style={styles.noSubRolesText}>(No custom types found)</Text>
                                        )}
                                    </View>
                                    <View style={styles.subRoleGrid}>
                                        {responderTypes.map(r => (
                                            <TouchableOpacity
                                                key={r.id}
                                                style={[
                                                    styles.subRoleChip,
                                                    selectedSubRole?.id === r.id && styles.subRoleChipActive
                                                ]}
                                                onPress={() => setSelectedSubRole(r)}
                                            >
                                                <MaterialIcons
                                                    name={r.icon || 'build'}
                                                    size={16}
                                                    color={selectedSubRole?.id === r.id ? theme.colors.background : r.color || theme.colors.primary}
                                                />
                                                <Text style={[
                                                    styles.subRoleText,
                                                    selectedSubRole?.id === r.id && styles.subRoleTextActive
                                                ]}>{r.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                        <TouchableOpacity
                                            style={[
                                                styles.subRoleChip,
                                                !selectedSubRole && styles.subRoleChipActive
                                            ]}
                                            onPress={() => setSelectedSubRole(null)}
                                        >
                                            <MaterialIcons
                                                name="medical-services"
                                                size={16}
                                                color={!selectedSubRole ? theme.colors.background : theme.colors.textSecondary}
                                            />
                                            <Text style={[
                                                styles.subRoleText,
                                                !selectedSubRole && styles.subRoleTextActive
                                            ]}>General</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>

                        {error ? (
                            <View style={styles.errorWrapper}>
                                <MaterialIcons name="error" size={16} color="#ef4444" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.registerButton, loading && { opacity: 0.7 }]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={theme.colors.background} />
                            ) : (
                                <Text style={styles.registerButtonText}>Register</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerNav: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        height: 60,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    headline: {
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'left',
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    label: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: theme.spacing.sm,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.roundness.lg,
        height: 56,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 16,
        paddingHorizontal: theme.spacing.md,
        height: '100%',
    },
    inputIconWrapper: {
        paddingHorizontal: theme.spacing.md,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
    },
    rightIconBorder: {
        borderLeftWidth: 1,
        borderLeftColor: theme.colors.border,
    },
    registerButton: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: theme.roundness.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        elevation: 5,
    },
    registerButtonText: {
        color: theme.colors.background,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    errorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '500',
    },
    roleSelectionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 4,
    },
    roleChip: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.roundness.lg,
        height: 48,
        gap: 8,
    },
    roleChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    roleChipText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    roleChipTextActive: {
        color: theme.colors.background,
        fontWeight: 'bold',
    },
    subRoleSection: {
        marginTop: 16,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    subRoleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    subLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    noSubRolesText: {
        fontSize: 10,
        color: '#64748b',
        fontStyle: 'italic',
    },
    subRoleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    subRoleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        gap: 6,
    },
    subRoleChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    subRoleText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    subRoleTextActive: {
        color: theme.colors.background,
    },
});

export default RegisterScreen;
