import React from 'react';
import { User, Bot } from 'lucide-react';

interface ChatBubbleProps {
    message: string;
    isUser: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
    return (
        <div className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`p-2 rounded-full ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {isUser ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl ${isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
            </div>
        </div>
    );
};
