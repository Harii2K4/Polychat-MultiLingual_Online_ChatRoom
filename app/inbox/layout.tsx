"use client";

import { Header } from "@/components/header";
import { Sidebar } from "./components/sidebar";
import ConversationList from "./components/sidebar/conversation-list";

export default function ConversationsLayout({
    children
}: {
    children: React.ReactNode,
}) {
    return (
        <div className="flex h-screen bg-background">
            <Header />
            {/* Sidebar wrapper with fixed position and shadow */}
            <div className="fixed inset-y-0 left-0 z-30 w-[300px] border-r border-border bg-card/50 backdrop-blur-sm">
                <div className="flex h-full flex-col">
                    <Sidebar>
                        <div className="flex-1 overflow-y-auto">
                            <ConversationList />
                        </div>
                    </Sidebar>
                </div>
            </div>

            {/* Main content area */}
            <main className="flex-1 ml-[300px] h-full">
                <div className="container mx-auto h-full max-w-6xl px-4 py-6">
                    {children}
                </div>
            </main>
        </div>
    );
}