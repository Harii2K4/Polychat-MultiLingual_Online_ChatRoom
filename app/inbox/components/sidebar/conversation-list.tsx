'use client';



import ConversationBox from "./conversation-box";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenericId } from "convex/values";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const LoadingState = () => (
    <div className="px-4 space-y-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 py-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[30%]" />
                    <Skeleton className="h-4 w-[60%]" />
                </div>
            </div>
        ))}
    </div>
);


const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-[200px] px-4">
        <p className="text-muted-foreground text-sm text-center">
            Unable to load conversations
        </p>
    </div>
);
const ConversationList = () => {
    const conversations = useQuery(api.conversations.getByUser);
    const currentUser = useQuery(api.users.getCurrentUser);
    const [visibleConversations, setVisibleConversations] = useState<string[]>([]);
    if (conversations === undefined || currentUser === undefined) {
        return <LoadingState />
    }

    if (currentUser === null) {
        return <ErrorState />
    }

    const userConversations = conversations.filter((conversation: { participantOneId: GenericId<"users">; participantTwoId: GenericId<"users">; }) => {
        return conversation.participantOneId === currentUser._id || conversation.participantTwoId === currentUser._id;
    });
    const handleRemoveConversation = (conversationId: string) => {
        setVisibleConversations(prev => prev.filter(id => id !== conversationId));
    };
    const visibleCount = visibleConversations.length;

    return (
        <div className="flex-1">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                <h2 className="text-sm font-medium text-foreground">All conversations</h2>
                <span className="text-xs text-muted-foreground">
                    {visibleCount} {visibleCount === 1 ? 'message' : 'messages'}
                </span>
            </div>

            {/* Conversations */}
            <div className="pt-2">
                {conversations.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            No conversations yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {userConversations.map((conversation: { _id: GenericId<"conversations">; _creationTime: number; participantOneId: GenericId<"users">; participantTwoId: GenericId<"users">; }) => (
                            <ConversationBox
                                key={conversation._id}
                                conversation={conversation}
                                currentUser={currentUser}
                                onRemove={() => handleRemoveConversation(conversation._id)}
                            />
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
}

export default ConversationList;