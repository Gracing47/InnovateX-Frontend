import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Bot, Send, User, Loader2, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  type: 'bot' | 'user'
  content: string
}

interface Answer {
  question: string
  answer: string | number
  category?: string
}

interface SessionState {
  currentCategory: number
  currentQuestion: number
  answers: Answer[]
  totalScore: number
  isComplete: boolean
  email?: string
  scores?: Array<{ category: string, points: number, maxPoints: number }>
}

interface Choice {
  label: string
  value: string
}

interface QuestionType {
  type: 'choice' | 'rating' | 'final'
  choices?: Choice[]
  showSkip?: boolean
}

interface DigitalFitCheckProps {
  sessionState: any; // Replace 'any' with your actual session state type
  setSessionState: (state: any) => void;
  message: string;
  setMessage: (message: string) => void;
}

export const DigitalFitCheck: React.FC<DigitalFitCheckProps> = ({ 
  sessionState, 
  setSessionState, 
  message, 
  setMessage 
}) => {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [currentView, setCurrentView] = React.useState<'role' | 'rating' | 'email'>('role')
  const [sliderValue, setSliderValue] = React.useState(3)
  const [isLoading, setIsLoading] = React.useState(false)
  const [input, setInput] = React.useState('')

  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // Vereinfachte initiale Nachricht
  React.useEffect(() => {
    setMessages([{
      type: 'bot',
      content: 'Willkommen beim Digital Fit Check! 🎉 Finden Sie heraus, wie digital Ihr Unternehmen bereits aufgestellt ist.'
    }])
  }, [])

  // Füge diese Funktion hinzu
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  // Aktualisiere den useEffect für das Scrolling
  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Vereinfachtes renderCurrentView
  const renderCurrentView = () => {
    if (currentView === 'rating' && sessionState) {
      return renderRatingSection()
    } else if (currentView === 'email') {
      return renderEmailCollection()
    } else {
      return (
        <div className="w-full flex justify-center">
          <Button 
            className="w-full max-w-sm"
            onClick={handleStart}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird geladen...
              </>
            ) : (
              'Digital Fit Check starten'
            )}
          </Button>
        </div>
      )
    }
  }

  // Neue handleStart Funktion
  const handleStart = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/digital-fit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'INIT_QUESTIONS',
          role: 'unternehmer',
          sessionState: null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Network response was not ok')
      }

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.message
      }])
      
      if (data.sessionState) {
        setSessionState(data.sessionState)
      }

      setCurrentView('rating')
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Es tut mir leid, es gab einen Fehler. Bitte versuchen Sie es erneut.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Rating mit Slider
  const renderRatingSection = () => {
    return (
      <div className="space-y-6 w-full">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Analog</span>
              <span className="text-sm text-muted-foreground">Digitalisiert</span>
            </div>
            
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  variant={sliderValue === value ? "default" : "outline"}
                  onClick={() => setSliderValue(value)}
                  className={cn(
                    "flex-1 h-12 font-medium",
                    sliderValue === value && "bg-black hover:bg-black/90 text-white"
                  )}
                >
                  {value}
                </Button>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              {getRatingLabel(sliderValue)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Progress 
            value={calculateProgress()} 
            className="h-2 bg-gray-100"
          />
          <p className="text-xs text-muted-foreground text-right">
            {calculateProgress() === 0 ? "🚀 Los geht's!" : `${calculateProgress()}% geschafft! ${calculateProgress() === 100 ? "🎉" : "💪"}`}
          </p>
        </div>

        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            className="w-full"
          >
            Weiß nicht / Überspringen
          </Button>
          <Button 
            onClick={handleSubmitRating}
            className="w-full bg-black hover:bg-black/90 text-white"
          >
            Bestätigen
          </Button>
        </div>
      </div>
    )
  }

  // Füge diese neue Funktion für die Labels hinzu
  const getRatingLabel = (value: number) => {
    switch(value) {
      case 1: return "Komplett analog"
      case 2: return "Überwiegend analog"
      case 3: return "Teilweise digitalisiert"
      case 4: return "Überwiegend digitalisiert"
      case 5: return "Vollständig digitalisiert"
      default: return ""
    }
  }

  // Email-Sammlung am Ende
  const renderEmailCollection = () => {
    return (
      <div className="space-y-4 w-full">
        <h3 className="text-lg font-medium">Ihre Analyse ist fertig!</h3>
        <p className="text-sm text-muted-foreground">
          Geben Sie Ihre E-Mail-Adresse ein, um Ihre personalisierte Auswertung zu erhalten.
        </p>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="ihre@email.de"
          autoComplete="email"
          onChange={(e) => setSessionState(prev => ({
            ...prev,
            email: e.target.value
          }))}
        />
        <Button 
          onClick={handleEmailSubmit}
          className="w-full bg-black hover:bg-black/90 text-white"
        >
          Auswertung anfordern
        </Button>
      </div>
    )
  }

  // Handler für das Absenden der Email
  const handleEmailSubmit = async () => {
    if (!sessionState?.email?.trim()) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Bitte geben Sie eine gültige E-Mail-Adresse ein."
      }])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionState)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Fehler beim Senden der E-Mail')
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Vielen Dank! Wir haben Ihnen die Auswertung per E-Mail zugesandt. 📧"
      }])
    } catch (error) {
      console.error('Error sending results:', error)
      setMessages(prev => [...prev, {
        type: 'bot',
        content: error instanceof Error ? error.message : 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const calculateProgress = () => {
    if (!sessionState) return 0
    return Math.round((sessionState.currentCategory / 5) * 100)
  }

  const handleSend = async (message?: string) => {
    if (!message?.trim()) return

    const userMessage = { type: 'user' as const, content: message }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/digital-fit-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'SUBMIT_ANSWER',
          answer: sliderValue,
          sessionState: sessionState,
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'API request failed')
      }
      
      if (data.sessionState) {
        setSessionState(data.sessionState)
        // Wenn der Check abgeschlossen ist, zur E-Mail-Ansicht wechseln
        if (data.sessionState.isComplete) {
          setCurrentView('email')
        }
      }
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.message
      }])

      // Reset slider value after successful submission
      setSliderValue(3)
      
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        type: 'bot',
        content: error instanceof Error ? error.message : 'Es tut mir leid, es gab einen Fehler. Bitte versuchen Sie es erneut.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    try {
      await handleSend('0')
    } catch (error) {
      console.error('Skip error:', error)
    }
  }

  const getRatingFeedback = (value: number) => {
    switch(value) {
      case 1: return "🌱 Hier gibt es noch viel Potenzial für Wachstum!"
      case 2: return "🌿 Sie haben erste Schritte gemacht!"
      case 3: return "🌳 Sie sind auf einem guten Weg!"
      case 4: return "⭐ Sie sind schon sehr gut aufgestellt!"
      case 5: return "🌟 Fantastisch! Sie sind ein digitaler Vorreiter!"
      default: return ""
    }
  }

  const handleSubmitRating = async () => {
    try {
      await handleSend(`${sliderValue}`)
    } catch (error) {
      console.error('Rating submission error:', error)
    }
  }

  // Enhance message display with avatars
  const renderMessages = () => (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 ${
            message.type === 'user' ? 'flex-row-reverse' : ''
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              message.type === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            {message.type === 'user' ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </div>
          <div
            className={`rounded-lg p-4 max-w-[80%] ${
              message.type === 'user'
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-muted'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Brain className="w-full h-full text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
          </div>
          <CardTitle>Digital Fit Check</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea 
          className="h-[400px]" 
          ref={scrollAreaRef}
        >
          <div className="pr-4">
            {renderMessages()}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground mt-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                InnovateX analysiert...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        {!isLoading && (!sessionState || !sessionState.isComplete) && renderCurrentView()}
        {isLoading && (
          <div className="flex items-center justify-center w-full gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            InnovateX analysiert...
          </div>
        )}
      </CardFooter>
    </Card>
  )
} 