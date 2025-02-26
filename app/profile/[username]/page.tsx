"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import ProfileInfo from "@/components/profile/profile_info";
import { Loading } from "@/components/auth/loading";




export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const router = useRouter();
    const currentUser = useQuery(api.users.getCurrentUser);

    const resolvedParams = use(params);
    const username = resolvedParams.username;


    const profileUser = useQuery(api.users.getUserByUsername, {
        username,
    });


    const handleMessageClick = async () => {
        if (!currentUser || !profileUser?.username) return;
        router.push(`/inbox/${profileUser.username}`);
    };

    if (!profileUser || !currentUser) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto max-w-4xl px-4 pt-20">
                <ProfileInfo
                    profileUser={profileUser}
                    currentUserId={currentUser?._id}
                    onMessageClick={handleMessageClick}
                />
            </main>
        </div>
    );
}