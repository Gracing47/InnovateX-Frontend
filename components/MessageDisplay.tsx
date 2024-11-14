import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  type: 'bot' | 'user';
  content: string;
}

const MessageDisplay: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={`flex items-start gap-3 mb-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        {message.type === 'user' ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div className={`rounded-lg p-4 max-w-[80%] ${message.type === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
        {message.content}
      </div>
    </div>
  );
};

export default MessageDisplay;
