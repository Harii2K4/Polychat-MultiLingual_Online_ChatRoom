// app/profile/changepassword.tsx
"use client";

import React, { useState } from 'react';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const PasswordChangeDialog = () => {
    const { user } = useUser();
    if (!user) {
        throw new Error("No user found");
    }
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);
        try {
            await user.updatePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                signOutOfOtherSessions: true,
            });

            setIsOpen(false);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            err instanceof Error ? setError(err.message) : setError("Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };
    const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const passwordsMatch = formData.newPassword && formData.confirmPassword &&
        formData.newPassword === formData.confirmPassword;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">Change Password</Button>
            </SheetTrigger>
            <SheetContent className="w-[400px]">
                <SheetHeader>
                    <SheetTitle>Change Password</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2 relative">
                        <Input
                            type={showPasswords.currentPassword ? "text" : "password"}
                            name="currentPassword"
                            placeholder="Current Password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => togglePasswordVisibility('currentPassword')}
                        >
                            {showPasswords.currentPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>

                    </div>

                    <div className="space-y-2 relative">
                        <Input
                            type={showPasswords.currentPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className={formData.newPassword.length >= 8 ? "border-green-500" : ""}
                            disabled={isLoading}
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => togglePasswordVisibility('newPassword')}
                        >
                            {showPasswords.newPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <div className="space-y-2 relative">
                        <Input
                            type={showPasswords.currentPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={passwordsMatch ? "border-green-500" :
                                formData.confirmPassword ? "border-red-500" : ""}
                            disabled={isLoading}
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                            {showPasswords.confirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !passwordsMatch}
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default PasswordChangeDialog;