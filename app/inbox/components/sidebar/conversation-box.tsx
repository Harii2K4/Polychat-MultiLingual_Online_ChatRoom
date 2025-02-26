'use client';
import { MoreVertical, Trash, Circle } from 'lucide-react';
import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversationBoxProps {
    conversation: Doc<"conversations">;
    currentUser: Doc<"users">;
    onRemove: () => void;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    conversation,
    currentUser,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const router = useRouter();
    const otherUserId = conversation.participantOneId === currentUser._id ? conversation.participantTwoId : conversation.participantOneId;
    const otherUser = useQuery(api.users.get, { id: otherUserId });
    const params = useParams();
    const isSelected = false;
    const handleClick = useCallback(() => {
        if (otherUser) {
            router.push(`/inbox/${otherUser.username}`);
        }
    }, [router, otherUser?.username]);

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        setShowMenu(false);
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    if (!isVisible) {
        return null;
    }

    if (!otherUser) {
        return (
            <div className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg group relative">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="/usernotfound.webp" alt="PolyChat User" />
                        <AvatarFallback className="text-primary-foreground">
                            {'U'}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className="text-sm font-medium text-foreground">
                            {'Polychat User'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Click to view conversation
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMenu}
                        className="ml-2 invisible group-hover:visible"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </Button>

                    {showMenu && (
                        <div
                            className="fixed transform -translate-x-full mt-2 w-48 bg-background rounded-md shadow-lg border z-[9999]"
                            style={{ top: 'auto' }}
                        >
                            <Button
                                variant="ghost"
                                onClick={handleRemove}
                                className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-secondary"
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Remove from list
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className={cn(`
                w-full 
                relative 
                flex 
                items-center 
                justify-between
                p-3 
                hover:bg-secondary
                rounded-lg
                transition
                cursor-pointer
                group
            `, isSelected && 'bg-secondary')}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser.profileImageUrl} alt={otherUser.fullName || 'User'} />
                        <AvatarFallback className="text-primary-foreground">
                            {otherUser.fullName?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>

                    {otherUser.showOnlineStatus && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                            <div
                                className={`w-2.5 h-2.5 rounded-full
                    ${otherUser.isOnline ? "bg-green-500" : "bg-red-500"}`}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-sm font-medium text-foreground">
                        {otherUser.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Click to view conversation
                    </p>
                </div>
            </div>


            <div className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    className="ml-2 invisible group-hover:visible"
                >
                    <MoreVertical className="h-5 w-5" />
                </Button>

                {showMenu && (
                    <div
                        className="fixed transform -translate-x-full mt-2 w-48 bg-background rounded-md shadow-lg border z-[9999]"
                        style={{ top: 'auto' }}
                    >
                        <Button
                            variant="ghost"
                            onClick={handleRemove}
                            className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-secondary"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove from list
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConversationBox;