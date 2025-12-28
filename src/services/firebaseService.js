import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config';

export const FirebaseService = {
    // User Management
    async getUserProfile(uid) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
    },

    async updateUserProfile(uid, data) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
    },

    // Incident Management
    async createIncident(incidentData) {
        const docRef = await addDoc(collection(db, 'incidents'), {
            ...incidentData,
            images: [], // Images disabled for now
            status: 'Open',
            statusHistory: [{
                status: 'Open',
                timestamp: new Date().toISOString(),
                note: 'Incident reported'
            }],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return docRef.id;
    },

    subscribeToUserIncidents(uid, callback, onError) {
        const q = query(
            collection(db, 'incidents'),
            where('reporterId', '==', uid),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, (snapshot) => {
            const incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(incidents);
        }, onError);
    },

    // Notifications
    subscribeToNotifications(uid, callback, onError) {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', uid),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        return onSnapshot(q, (snapshot) => {
            const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(notifications);
        }, onError);
    },

    async markNotificationRead(id) {
        await updateDoc(doc(db, 'notifications', id), { read: true });
    },

    async addNotification(userId, notification) {
        await addDoc(collection(db, 'notifications'), {
            userId,
            ...notification,
            read: false,
            createdAt: serverTimestamp(),
        });
    },

    async seedTestNotifications(userId) {
        const testNotifications = [
            {
                title: 'Incident Accepted',
                message: 'Your report #INC-823 has been accepted by Facilities.',
                type: 'check-circle',
                iconColor: '#10b981',
                iconBg: 'rgba(16, 185, 129, 0.15)',
            },
            {
                title: 'Safety Alert',
                message: 'New safety protocols have been updated for Zone 4.',
                type: 'warning',
                iconColor: '#f59e0b',
                iconBg: 'rgba(245, 158, 11, 0.15)',
            },
            {
                title: 'Comment on Incident',
                message: 'Mike from Maintenance commented on your report.',
                type: 'comment',
                iconColor: '#3b82f6',
                iconBg: 'rgba(59, 130, 246, 0.15)',
            }
        ];

        for (const noti of testNotifications) {
            await this.addNotification(userId, noti);
        }
    },

    // Activity Log / Comments
    async addIncidentUpdate(incidentId, update) {
        const incidentRef = doc(db, 'incidents', incidentId);
        const incidentSnap = await getDoc(incidentRef);
        if (incidentSnap.exists()) {
            const history = incidentSnap.data().statusHistory || [];
            await updateDoc(incidentRef, {
                statusHistory: [...history, { ...update, timestamp: new Date().toISOString() }],
                updatedAt: serverTimestamp()
            });
        }
    },

    // Push Notifications (Cloud Messaging)
    async savePushToken(uid, token) {
        await updateDoc(doc(db, 'users', uid), {
            pushToken: token,
            updatedAt: serverTimestamp()
        });
    },

    async updateIncidentStatus(incidentId, newStatus, note, user) {
        const incidentRef = doc(db, 'incidents', incidentId);
        const incidentSnap = await getDoc(incidentRef);
        if (incidentSnap.exists()) {
            const history = incidentSnap.data().statusHistory || [];
            await updateDoc(incidentRef, {
                status: newStatus,
                statusHistory: [...history, {
                    status: newStatus,
                    note: note || `Status changed to ${newStatus}`,
                    user: user || 'System',
                    timestamp: new Date().toISOString()
                }],
                updatedAt: serverTimestamp()
            });
        }
    }
};
