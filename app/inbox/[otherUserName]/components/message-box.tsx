'use client';

import clsx from "clsx";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageWithUserType } from "@/types";
import { Loading } from "@/components/auth/loading";

interface MessageBoxProps {
    message: MessageWithUserType;
    isLast?: boolean;
    selectedLang: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({
    message,
    isLast,
    selectedLang
}) => {
    const currentUser = useQuery(api.users.getCurrentUser);

    if (currentUser === undefined) {
        return <Loading />
    }

    if (currentUser === null) return null;




    const isOwn = message.userId === currentUser._id;



    const container = clsx(
        'flex gap-3 p-2 items-end hover:bg-gray-50 transition',
        isOwn && 'justify-end'
    );

    const avatar = clsx(
        isOwn ? 'order-2 invisible' : 'order-1',
        'flex-shrink-0'
    );

    const body = clsx(
        'flex flex-col gap-1',
        isOwn ? 'items-end order-1' : 'items-start order-2',
        'max-w-[65%]'
    );

    const messageStyle = clsx(
        'text-sm w-fit overflow-hidden',
        'px-4 py-2',
        isOwn ? [
            'bg-[#3797F0]',
            'text-white',
            'rounded-[22px] rounded-br-[8px]',
        ] : [
            'bg-gray-100',
            'text-gray-900',
            'rounded-[22px] rounded-bl-[8px]',
        ]
    );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar className="h-8 w-8 ring-2 ring-gray-100">
                    <AvatarImage
                        src={message.user.profileImageUrl}
                        alt={message.user.username}
                        className="object-cover"
                    />
                    <AvatarFallback delayMs={600} className="text-xs bg-gray-200 text-gray-600">
                        {message.user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className={body}>
                {!isOwn && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                            {message.user.username}
                        </span>
                    </div>
                )}

                <div className="group relative">
                    <div className={messageStyle}>
                        {selectedLang === "English" ? message.Engtext : message.Frenchtext}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-light text-gray-500 ${isOwn ? 'pr-1' : 'pl-1'}`}>
                        {format(new Date(message._creationTime), 'p')}
                    </span>
                    {isLast && isOwn && message.seen && (
                        <span className="text-[11px] text-[#3797F0]">
                            • Seen
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessageBox;