"use client";
import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export function useOnlineStatus(userId?: Id<"users">) { // ✅ userId is now optional
    const updateOnlineStatus = useMutation(api.users.updateOnlineStatus);

    useEffect(() => {
        if (!userId) return; // ✅ Prevent running effect if userId is undefined

        // Set online when component mounts
        updateOnlineStatus({
            userId,
            isOnline: true,
            lastOnline: Date.now(),
        });

        // Handle window/tab close or browser close
        const handleOffline = async () => {
            await updateOnlineStatus({
                userId,
                isOnline: false,
                lastOnline: Date.now(), // Update lastOnline when user goes offline
            });
        };

        // Handle page visibility change
        const handleVisibilityChange = () => {
            const timestamp = Date.now();
            updateOnlineStatus({
                userId,
                isOnline: !document.hidden,
                lastOnline: document.hidden ? timestamp : undefined, // Only update lastOnline when going offline
            });
        };

        // Handle disconnection events
        const handleDisconnect = () => {
            const timestamp = Date.now();
            updateOnlineStatus({
                userId,
                isOnline: false,
                lastOnline: timestamp,
            });
        };

        // Add event listeners
        window.addEventListener('beforeunload', handleOffline);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('offline', handleDisconnect);
        window.addEventListener('pagehide', handleDisconnect);

        // Cleanup function
        return () => {
            handleOffline();
            window.removeEventListener('beforeunload', handleOffline);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('offline', handleDisconnect);
            window.removeEventListener('pagehide', handleDisconnect);
        };
    }, [userId, updateOnlineStatus]); // ✅ Effect only runs if userId exists
}
