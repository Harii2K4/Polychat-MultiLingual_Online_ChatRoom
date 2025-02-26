"use client";

import { Loading } from "@/components/auth/loading";
import { useAuth, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { Authenticated, ConvexReactClient, Unauthenticated, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";

interface ConvexClientProviderProps {
    children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

// Separate component to handle user storage
const UserInitializer = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const storeUser = useMutation(api.users.store);
    useEffect(() => {
        const initializeUser = async () => {

            try {
                await storeUser(user ? { profileImageUrl: user.imageUrl } : { profileImageUrl: "" },);
                console.log("User stored successfully");
            } catch (error) {
                console.error("Error storing user:", error);
            }
        };

        initializeUser();
    }, [user, storeUser]); // Dependencies ensure it runs when `user` updates


    return <>{children}</>;
};

export const ConvexClientProvider: React.FC<ConvexClientProviderProps> = ({ children }) => {
    const { isLoaded, isSignedIn } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

    if (loading) {
        return <Loading />;
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return (
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
            <Unauthenticated>
                <div>You are not logged in</div>
            </Unauthenticated>
            <Authenticated>
                <UserInitializer>
                    {children}
                </UserInitializer>
            </Authenticated>
        </ConvexProviderWithClerk>
    );
};