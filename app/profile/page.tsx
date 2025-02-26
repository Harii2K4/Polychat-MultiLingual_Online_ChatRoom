"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
    Settings,
    MessageCircle,
    Bell,
    Clock,
    Moon,
    User,
    Shield
} from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { Switch } from '@/components/ui/switch';
import AboutSection from '@/components/profile/profile_about';
import PasswordChangeDialog from './components/changepassword';
import AccountDeletion from './components/deleteaccount';
import { Loading } from '@/components/auth/loading';


export default function ProfilePage() {
    const { user } = useUser();
    const userData = useQuery(api.users.getCurrentUser);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [showOnlineStatus, setShowOnlineStatus] = useState(true);
    const unreadCount = useQuery(api.user_preference.getUnreadMessagesCount) ?? 0;
    /*const updateActivity = useMutation(api.user_preference.updateUserActivity);*/


    // Convex mutations and queries
    const updatePreferences = useMutation(api.user_preference.updateUserPreferences);

    const userStatus = useQuery(api.user_preference.getUserStatus, {
        userId: userData?._id,

    });

    // Add an effect to update activity status
    /*useEffect(() => {
        const updateActivityStatus = async () => {
            await updateActivity();
        };

        // Update when component mounts
        updateActivityStatus();

        // Set up interval to update status
        const interval = setInterval(updateActivityStatus, 60000); // Every minute

        return () => clearInterval(interval);
    }, [updateActivity])*/


    // Initialize states from user data
    useEffect(() => {
        if (userData) {
            setNotificationsEnabled(userData.notificationsEnabled ?? true);
            setDarkMode(userData.darkMode ?? false);
            setShowOnlineStatus(userData.showOnlineStatus ?? true);
        }
    }, [userData]);

    // Updated handlers with Convex mutations
    const handleNotificationsChange = async (enabled: boolean) => {
        setNotificationsEnabled(enabled);
        await updatePreferences({ notificationsEnabled: enabled });
    };

    const handleDarkModeChange = async (enabled: boolean) => {
        setDarkMode(enabled);
        await updatePreferences({ darkMode: enabled });
    };

    const handleOnlineStatusChange = async (enabled: boolean) => {
        setShowOnlineStatus(enabled);
        await updatePreferences({ showOnlineStatus: enabled });
    };

    if (!user || !userData) return null;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto max-w-4xl px-4 pt-20">
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-gradient">Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Profile Header */}
                        <div className="flex items-start gap-8 mb-8">
                            <div className="relative">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage
                                        src={user.imageUrl}
                                        alt={user.fullName || "Profile"}
                                    />
                                    <AvatarFallback>
                                        {user.firstName?.charAt(0) || user.username?.charAt(0) || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                {showOnlineStatus && (
                                    <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <h1 className="text-xl font-semibold">{user.fullName}</h1>
                                    {userStatus?.isOnline ? (
                                        <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                                            Online
                                        </div>
                                    ) : (
                                        <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                                            Offline
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-8 mb-4">
                                    <span className="font-medium flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        {unreadCount} unread messages
                                    </span>
                                    {!userStatus?.isOnline && userStatus?.lastActive && (
                                        <span className="font-medium flex items-center gap-2">
                                            Last active: {new Date(userStatus.lastActive).toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <p className="text-muted-foreground">
                                        {user.emailAddresses[0].emailAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <AboutSection
                            initialAbout={userData?.about}
                            userId={userData._id}
                        />
                        {/* Settings Tabs */}
                        <Tabs defaultValue="preferences" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8">
                                <TabsTrigger value="preferences" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Preferences
                                </TabsTrigger>
                                <TabsTrigger value="privacy" className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Privacy
                                </TabsTrigger>
                                <TabsTrigger value="account" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Account
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="preferences">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h3 className="font-medium">Chat Notifications</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Receive notifications for new messages
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notificationsEnabled}
                                            onCheckedChange={handleNotificationsChange}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h3 className="font-medium">Dark Mode</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Toggle dark mode appearance
                                            </p>
                                        </div>
                                        <Switch
                                            checked={darkMode}
                                            onCheckedChange={handleDarkModeChange}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h3 className="font-medium">Sound Effects</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Play sounds for new messages
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="privacy">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h3 className="font-medium">Show Online Status</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Let others see when you're online
                                            </p>
                                        </div>
                                        <Switch
                                            checked={showOnlineStatus}
                                            onCheckedChange={handleOnlineStatusChange}
                                        />
                                    </div>

                                    <div className="space-y-0.5">
                                        <h3 className="font-medium">Blocked Users</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Manage your blocked users list
                                        </p>
                                        <Button variant="outline" className="mt-2">
                                            Manage Blocked Users
                                        </Button>
                                    </div>

                                    <div className="space-y-0.5">
                                        <h3 className="font-medium">Chat History</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Clear your chat history
                                        </p>
                                        <Button variant="destructive" className="mt-2">
                                            Clear History
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="account">
                                <div className="space-y-6">
                                    <div className="space-y-0.5">
                                        <h3 className="font-medium">Account Information</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Update your account details
                                        </p>
                                        <Button variant="outline" className="mt-2">
                                            Edit Profile
                                        </Button>
                                    </div>

                                    <div className="space-y-0.5">
                                        <h3 className="font-medium">Change Password</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Update your password
                                        </p>
                                        <div className="mt-2">
                                            <PasswordChangeDialog />
                                        </div>
                                    </div>

                                    <div className="space-y-0.5">
                                        <h3 className="font-medium text-red-600">Danger Zone</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Delete your account and all data
                                        </p>
                                        <div className="mt-2">
                                            <AccountDeletion userId={userData._id} />

                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}