"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const ProfileButton = () => {
    const { user } = useUser();
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
            onClick={() => router.push("/profile")}
        >
            <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} alt="Profile" />
                <AvatarFallback>
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "?"}
                </AvatarFallback>
            </Avatar>
        </Button>
    );
};