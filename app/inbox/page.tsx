"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const InboxPage = () => {
    /*const currentUser = useQuery(api.users.getCurrentUser);
    useOnlineStatus(currentUser?._id);*/
    // ✅ Always call the hook, but only use the ID if currentUser exists

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-6 animate-fade-in">
            {/* Empty state illustration */}
            <div className="relative w-[340px] h-[340px] opacity-80">
                <Image
                    src="/empty-inbox.jpg"
                    alt="Empty"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Welcome text with gradient effect */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gradient animate-slide-in">
                    Welcome to inbox!
                </h2>
                <p className="text-muted-foreground text-base">
                    Select a conversation or start a new one!
                </p>
            </div>

            {/* New message button */}
            <Button
                className="instagram-button mt-4 flex items-center gap-2"
                size="lg"
            >
                <PenSquare className="w-4 h-4" />
                Start a new message
            </Button>
        </div>
    );
};

export default InboxPage;