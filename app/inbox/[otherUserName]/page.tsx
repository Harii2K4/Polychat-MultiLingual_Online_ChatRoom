"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use, useCallback, useEffect, useState } from "react";

import { Doc } from "@/convex/_generated/dataModel";
import Form from "./components/form";
import Body from "./components/body";
import { Loading } from "@/components/auth/loading";

interface FormProps {
    params: Promise<{ otherUserName: string }>;
}

const ConversationPage = ({ params }: FormProps) => {
    const [error, setError] = useState<string | null>(null);
    const resolvedParams = use(params); // Unwrapping the Promise
    const otherUserName = resolvedParams.otherUserName;
    const [conversation, setConversation] = useState<Doc<"conversations"> | null>(null);

    const get = useMutation(api.conversations.getOrCreateConversation);
    const conv = useQuery(
        api.conversations.getConversation,
        otherUserName ? { username: otherUserName } : "skip"
    );
    const currentUser = useQuery(api.users.getCurrentUser);


    useEffect(() => {
        const callMutation = async () => {
            try {
                const result = await get({ otherUsername: otherUserName });
                setConversation(result.conversation);
                setError(null);
            } catch (error) {
                console.error("Mutation failed:", error);
                setError("Failed to load conversation. Please try again.");
            }
        };

        if (otherUserName) {
            callMutation();
        }
    }, [get, otherUserName, setConversation]);


    if (conversation === null || conv === undefined || currentUser === undefined || currentUser === null) {
        return <Loading />;
    }

    return (
        <div className="h-full">
            <div className="h-full flex flex-col">
                <Body messages={conv.messagesWithUsers} conversationId={conversation._id}  // Pass conversationId
                    currentUserId={currentUser._id} otherUser={otherUserName} />
                <Form userId={currentUser._id} conversationId={conversation._id} otherUser={otherUserName} />
            </div>
        </div>
    );
};

export default ConversationPage;
