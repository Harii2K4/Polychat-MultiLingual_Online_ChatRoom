import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from "next/navigation";
interface ProfileUser {
    username: string;
    fullName: string;
    _id: string;
    isOnline?: boolean;
    lastOnline?: number;
    profileImageUrl?: string;
    title?: string;
    about?: string;
}

interface CurrentUser {
    id: string;
}

interface ProfileInfoProps {
    profileUser: ProfileUser;
    currentUserId: Id<"users">;
    onMessageClick: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileUser, currentUserId, onMessageClick }) => {
    const [timeAgo, setTimeAgo] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (currentUserId === profileUser._id) {
            router.push(`/profile`);
        }
    }, [currentUserId, profileUser._id, router]);
    if (currentUserId === profileUser._id) {
        return null; // Return nothing to avoid rendering issues
    }

    useEffect(() => {
        if (!profileUser.isOnline && profileUser.lastOnline !== undefined) {
            const updateTimeAgo = () => {
                const now = Date.now();
                const diff = now - (profileUser.lastOnline ?? 0);

                if (diff < 60000) return 'Just now';
                if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
                if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
                return `${Math.floor(diff / 86400000)}d ago`;
            };

            setTimeAgo(updateTimeAgo());
            const interval = setInterval(() => setTimeAgo(updateTimeAgo()), 60000);
            return () => clearInterval(interval);
        }
    }, [profileUser.lastOnline, profileUser.isOnline]);

    return (
        <div className="flex items-start gap-8 mb-8">
            <Avatar className="h-32 w-32">
                <AvatarImage src={profileUser.profileImageUrl} alt={profileUser.fullName || profileUser.username} />
                <AvatarFallback>
                    {profileUser.fullName?.charAt(0) || profileUser.username?.charAt(0) || "?"}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{profileUser.fullName}</h1>
                    <div className="flex items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mr-2 ${profileUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm text-muted-foreground">
                            {profileUser.isOnline ? 'Online' : timeAgo ? `Last seen ${timeAgo}` : 'Offline'}
                        </span>
                    </div>
                </div>

                <p className="text-muted-foreground mb-4">@{profileUser.username}</p>

                {profileUser.title && (
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                        {profileUser.title}
                    </p>
                )}

                {profileUser.about && (
                    <div className="mb-4">
                        <div className="prose dark:prose-invert">
                            <p className="text-muted-foreground whitespace-pre-wrap">{profileUser.about}</p>
                        </div>
                    </div>
                )}

                {currentUserId !== profileUser._id && (
                    <Button onClick={onMessageClick} className="mt-2">Send Message</Button>
                )}
            </div>
        </div>
    );
};

export default ProfileInfo;
