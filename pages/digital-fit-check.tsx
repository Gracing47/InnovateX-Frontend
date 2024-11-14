import React, { useState } from 'react'
import Image from 'next/image'
import { SessionState } from 'http2'
import { Message } from 'openai/resources/beta/threads/messages'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DigitalFitCheck() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [numberOfEmployees, setNumberOfEmployees] = useState(0)
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const startFitCheck = async () => {
    try {
      const response = await fetch('/api/digital-fit-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'INIT_QUESTIONS',
          user: {
            name,
            industry,
            numberOfEmployees,
          }
        })
      })

      const data = await response.json()
      setMessages([{
          role: 'assistant', 
          content: data.message,
          id: '',
          assistant_id: '',
          attachments: [],
          completed_at: 0,
          created_at: 0,
          incomplete_at: 0,
          incomplete_details: undefined,
          metadata: undefined,
          object: 'thread.message',
          run_id: '',
          status: 'in_progress',
          thread_id: ''
      }])
      setSessionState(data.sessionState)
    } catch (error) {
      console.error('Failed to start fit check:', error)
    }
  }

  return (
    <div>
      {step === 0 && (
        <div>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleNext}>Next</Button>
        </div>
      )}
      {step === 1 && (
        <div>
          <Input
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <Button onClick={handleNext}>Next</Button>
        </div>
      )}
      {step === 2 && (
        <div>
          <Input
            placeholder="Number of Employees"
            type="number"
            value={numberOfEmployees}
            onChange={(e) => setNumberOfEmployees(Number(e.target.value))}
          />
          <Button onClick={startFitCheck}>Start Fit Check</Button>
        </div>
      )}
      {step === 3 && (
        <div>
          {/* ... existing JSX ... */}
          {messages.map((message, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <Image 
                  src="/bot-avatar.png" 
                  alt="Bot" 
                  width={24} 
                  height={24} 
                />
                <div className="whitespace-pre-wrap">
                  {Array.isArray(message.content) 
                    ? message.content.map((item, index) => (
                        item.type === 'text' ? <React.Fragment key={index}>{item.text.value}</React.Fragment> : null
                      ))
                    : message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 