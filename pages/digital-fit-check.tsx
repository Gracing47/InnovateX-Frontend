import React, { useState } from 'react';
import { DigitalFitCheck } from '../components/DigitalFitCheck';
import { SessionState, Message } from '../types/digitalFitCheck';

const initialSessionState: SessionState = {
  currentCategory: 0,
  currentQuestion: 0,
  answers: [],
  totalScore: 0,
  isComplete: false,
  userProfile: undefined,
  questions: undefined,
};

export default function DigitalFitCheckPage() {
  const [sessionState, setSessionState] = useState<SessionState>(initialSessionState);
  const [messages, setMessages] = useState<Message[]>([]); // Keep as Message array

  return (
    <DigitalFitCheck 
      sessionState={sessionState} 
      setSessionState={setSessionState} 
      message={messages} // Pass messages directly
      setMessage={(msg) => setMessages([...messages, msg])} // Update to append new messages
    />
  );
}
