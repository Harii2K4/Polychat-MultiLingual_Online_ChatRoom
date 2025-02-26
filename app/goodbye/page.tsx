"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Loading } from "@/components/auth/loading";
import { motion } from "framer-motion";

export default function Goodbye() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const [isDeleting, setIsDeleting] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const deleteUser = async () => {
            try {
                setIsDeleting(false);

                const timer = setInterval(() => {
                    setCountdown((prev) => prev - 1);
                }, 1000);

                setTimeout(() => {
                    router.push("/");
                }, 5000);

                return () => clearInterval(timer);
            } catch (err) {
                setError("Failed to delete account. Please try again later.");
                setIsDeleting(false);
            }
        };

        deleteUser();
    }, [router]);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-[400px] shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent text-center">
                            Goodbye from PolyChat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        {isDeleting ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce" />
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-.3s]" />
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-.5s]" />
                            </div>
                        ) : error ? (
                            <motion.p
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-red-500"
                            >
                                {error}
                            </motion.p>
                        ) : (
                            <>
                                <motion.p
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="text-gray-700"
                                >
                                    Your account has been successfully deleted.
                                </motion.p>
                                <motion.p
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="text-gray-600"
                                >
                                    Redirecting you to the homepage in{" "}
                                    <strong className="text-red-500">{countdown}</strong> seconds...
                                </motion.p>
                            </>
                        )}
                        <Button
                            onClick={() => router.push("/")}
                            variant="destructive"
                            className="w-full transform hover:scale-105 transition-transform duration-300"
                            disabled={isDeleting}
                        >
                            Go to Home Now
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}