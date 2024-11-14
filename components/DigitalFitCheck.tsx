import * as React from "react"
import { Button } from "components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import { Input } from "components/ui/input"
import { ScrollArea } from "components/ui/scroll-area"
import { Progress } from "components/ui/progress"
import { Slider } from "components/ui/slider"
import { Bot, Send, User, Loader2, Brain } from "lucide-react"
import { cn } from "lib/utils"

interface Message {
  type: 'bot' | 'user'
  content: string
}

interface Answer {
  category: string
  questionIndex: number
  rating: number
  question: string
}

interface UserProfile {
  name: string
  industry: string
  numberOfEmployees: number
  assessmentType?: 'quick' | 'detailed'
  role?: string
}

interface SessionState {
  currentCategory: number
  currentQuestion: number
  answers: Answer[]
  totalScore: number
  isComplete: boolean
  userProfile?: UserProfile
  questions?: {
    question: string
    category: string
  }[]
}

interface DigitalFitCheckProps {
  sessionState: SessionState
  setSessionState: (state: SessionState) => void
  message: string
  setMessage: (message: string) => void
}

export const DigitalFitCheck: React.FC<DigitalFitCheckProps> = ({
  sessionState,
  setSessionState,
  message,
  setMessage
}) => {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState<'welcome' | 'name' | 'industry' | 'employees' | 'assessment-type' | 'questions' | 'complete'>('welcome')
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null)
  const [userProfile, setUserProfile] = React.useState<UserProfile>({
    name: '',
    industry: '',
    numberOfEmployees: 0
  })

  // Speichere die Fragen im State
  const [questions, setQuestions] = React.useState<SessionState['questions']>([])

  // Initiale Willkommensnachricht
  React.useEffect(() => {
    setMessages([{
      type: 'bot',
      content: 'Willkommen beim Digital Fit Check! 👋\n\nIch führe Sie durch eine kurze Analyse Ihres Digitalisierungsgrads. Dafür brauche ich zunächst ein paar Informationen von Ihnen.\n\nWie ist Ihr Name?'
    }])
  }, [])

  const handleStart = async () => {
    setCurrentStep('name')
    setMessages(prev => [...prev, {
      type: 'bot',
      content: 'Wie ist Ihr Name? 😊'
    }])
  }

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;
    
    setIsLoading(true)
    try {
      switch (currentStep) {
        case 'name':
          setUserProfile(prev => ({ ...prev, name: input }))
          setCurrentStep('industry')
          setMessages(prev => [...prev,
            { type: 'user', content: input },
            { type: 'bot', content: `Hallo ${input}! 👋 In welcher Branche sind Sie tätig? 🏢` }
          ])
          break

        case 'industry':
          setUserProfile(prev => ({ ...prev, industry: input }))
          setCurrentStep('employees')
          setMessages(prev => [...prev,
            { type: 'user', content: input },
            { type: 'bot', content: `${input}, spannend! 🎯 Wie viele Mitarbeiter hat Ihr Unternehmen? 👥` }
          ])
          break

        case 'employees':
          const employees = parseInt(input)
          if (isNaN(employees)) {
            setMessages(prev => [...prev,
              { type: 'user', content: input },
              { type: 'bot', content: 'Ups! Bitte geben Sie eine gültige Zahl ein. 🔢' }
            ])
            break
          }

          setUserProfile(prev => ({ ...prev, numberOfEmployees: employees }))
          setCurrentStep('assessment-type')
          setMessages(prev => [...prev,
            { type: 'user', content: input },
            { type: 'bot', content: 'Super, danke! 🌟 Wählen Sie bitte die gewünschte Analyse-Tiefe:\n\n' +
              '⚡ **Express-Analyse (ca. 5 Minuten)**\n' +
              '- 🎯 Schnelle Einschätzung Ihres Digitalisierungsgrads\n' +
              '- 🔍 Fokus auf die wichtigsten Kernbereiche\n\n' +
              '🔮 **Detail-Analyse (10-15 Minuten)**\n' +
              '- 📊 Umfassende Bewertung aller Digitalisierungsbereiche\n' +
              '- 💡 Ausführliche Handlungsempfehlungen\n\n' +
              '✨ In beiden Fällen erhalten Sie:\n' +
              '📈 Ihren Digitalisierungsgrad im Branchenvergleich\n' +
              '💪 Eine übersichtliche SWOT-Analyse\n' +
              '🎯 Konkrete Handlungsempfehlungen\n' +
              '🚀 Entwicklungspotenziale für Ihr Unternehmen' }
          ])
          break

        case 'assessment-type':
          if (!['express', 'detail'].includes(input.toLowerCase())) {
            setMessages(prev => [...prev,
              { type: 'user', content: input },
              { type: 'bot', content: 'Hoppla! 😅 Bitte wählen Sie "Express" für die Express-Analyse oder "Detail" für die Detail-Analyse.' }
            ])
            break
          }

          const assessmentType = input.toLowerCase() === 'express' ? 'quick' : 'detailed' as const
          
          const updatedProfile: UserProfile = {
            name: userProfile.name.trim(),
            industry: userProfile.industry.trim(),
            numberOfEmployees: Number(userProfile.numberOfEmployees),
            assessmentType: assessmentType as 'quick' | 'detailed',
            role: 'unternehmer'
          };

          if (!updatedProfile.name || !updatedProfile.industry || isNaN(updatedProfile.numberOfEmployees)) {
            throw new Error('Bitte füllen Sie alle Felder korrekt aus.');
          }

          const requestData = {
            type: 'INIT_QUESTIONS',
            userProfile: updatedProfile
          };

          const response = await fetch('/api/digital-fit-check', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(requestData)
          });

          const data = await response.json();

          if (!data.success || !data.session) {
            throw new Error('Fehler beim Laden der Fragen.');
          }

          const newSessionState: SessionState = {
            ...data.session,
            currentCategory: 0,
            currentQuestion: 0,
            answers: [],
            totalScore: 0,
            isComplete: false,
            questions: data.session.questions || []
          };

          setSessionState(newSessionState);

          // Zeige die erste Frage an
          if (data.session.questions && data.session.questions.length > 0) {
            setMessages(prev => [...prev, 
              { type: 'user', content: input },
              { type: 'bot', content: data.session.questions[0].question }
            ]);
            setQuestions(data.session.questions);
          }

          setCurrentStep('questions');
          break;
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        type: 'bot',
        content: `❌ ${error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten.'}` 
      }]);
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingSelect = async (rating: number) => {
    console.log('Rating selected:', rating);
    
    if (!sessionState?.questions) {
      console.error('No questions available');
      return;
    }

    const currentQuestion = sessionState.questions[sessionState.currentQuestion];
    if (!currentQuestion) {
      console.error('Invalid question index');
      return;
    } 

    setSelectedRating(rating);

    const currentAnswer: Answer = {
      category: currentQuestion.category,
      questionIndex: sessionState.currentQuestion,
      rating: rating,
      question: currentQuestion.question
    };

    // Update session state with new answer
    const updatedAnswers = [...sessionState.answers, currentAnswer];
    const nextQuestionIndex = sessionState.currentQuestion + 1;
    const isComplete = nextQuestionIndex >= (sessionState.questions?.length || 0);

    const newSessionState: SessionState = {
      ...sessionState,
      answers: updatedAnswers,
      currentQuestion: nextQuestionIndex,
      isComplete: isComplete
    };

    // Use Promise to ensure state is updated before submitting
    await new Promise<void>(resolve => {
      setSessionState(newSessionState);
      // Wait for next render cycle
      setTimeout(resolve, 0);
    });

    // Now safely submit after state update
    if (isComplete) {
      await handleSubmit(rating);
    }
  };

  const handleSubmit = async (rating: number) => {
    console.log('Submit clicked');
    
    try {
      setIsLoading(true);

      if (sessionState.isComplete) {
        // Sende finale Auswertung
        const response = await fetch('/api/digital-fit-check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'COMPLETE',
            sessionState: sessionState
          })
        });

        if (!response.ok) {
          throw new Error('Fehler beim Abschließen der Bewertung');
        }

        const result = await response.json();
        
        setMessages(prev => [...prev,
          { type: 'user', content: `${rating} Sterne` },
          { type: 'bot', content: '🎉 Vielen Dank für Ihre Teilnahme! Ihre Ergebnisse werden jetzt ausgewertet...' }
        ]);

        setCurrentStep('complete');
      } else {
        // Show next question
        const nextQuestion = sessionState.questions?.[sessionState.currentQuestion];
        if (nextQuestion) {
          setMessages(prev => [...prev,
            { type: 'user', content: `${rating} Sterne` },
            { type: 'bot', content: nextQuestion.question }
          ]);
        }
      }

      // Reset rating selection
      setSelectedRating(null);
    } catch (error) {
      console.error('Error during submission:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: `❌ ${error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten.'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAssessmentTypeButtons = () => {
    if (currentStep !== 'assessment-type') return null;

    return (
      <div className="space-y-4">
        <Button 
          className="w-full"
          onClick={() => handleUserInput('express')}
        >
          ⚡ Express-Analyse (5 Min.)
        </Button>
        <Button 
          className="w-full"
          onClick={() => handleUserInput('detail')}
        >
          🔮 Detail-Analyse (10-15 Min.)
        </Button>
      </div>
    );
  }

  const renderCurrentView = () => {
    if (currentStep === 'welcome') {
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
                Wird geladen... ⌛
              </>
            ) : (
              '🚀 Digital Fit Check starten'
            )}
          </Button>
        </div>
      )
    }

    if (currentStep === 'assessment-type') {
      return renderAssessmentTypeButtons()
    }

    if (currentStep === 'questions') {
      const progress = sessionState.questions 
        ? (sessionState.currentQuestion / sessionState.questions.length) * 100 
        : 0;

      return (
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-right">
            {Math.round(progress)}% abgeschlossen
          </p>
          
          {sessionState.questions && sessionState.questions[sessionState.currentQuestion] && (
            <>
              <div className="text-lg font-medium">
                {sessionState.questions[sessionState.currentQuestion].question}
              </div>
              <div className="flex justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    onClick={() => handleRatingSelect(rating)}
                    className={cn(
                      "w-12 h-12",
                      selectedRating === rating ? "bg-primary text-white" : "bg-secondary"
                    )}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <Input
          className="w-full"
          placeholder={
            currentStep === 'name' ? 'Ihren Namen eingeben...' :
            currentStep === 'industry' ? 'Ihre Branche eingeben...' :
            'Anzahl der Mitarbeiter eingeben...'
          }
          type={currentStep === 'employees' ? 'number' : 'text'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              handleUserInput(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
        />
        <Button 
          className="w-full"
          onClick={(e) => {
            const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
            if (input && input.value.trim()) {
              handleUserInput(input.value)
              input.value = ''
            }
          }}
        >
          Weiter
        </Button>
      </div>
    )
  }

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
        <ScrollArea className="h-[400px]">
          <div className="pr-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 mb-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
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
            ))}
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
        {!isLoading && renderCurrentView()}
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
