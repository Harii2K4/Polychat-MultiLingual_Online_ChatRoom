"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
    const currentUser = useQuery(api.users.getCurrentUserOnlineStatus);
    useOnlineStatus(currentUser?._id);
    return <>{children}</>;
}