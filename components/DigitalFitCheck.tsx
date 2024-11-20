import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Bot, Send, User, Loader2, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { industries, Industry, Question } from "@/lib/questions"
import { analyzeDigitalFitness } from "@/lib/ai-service"

interface Message {
  type: 'bot' | 'user'
  content: string
}

interface Answer {
  questionId: string
  points: number
  weight: string
}

interface SessionState {
  selectedIndustry?: Industry
  currentQuestionIndex: number
  answers: Answer[]
  messages: Message[]
  score?: number
  isComplete: boolean
}

interface DigitalFitCheckProps {
  sessionState: {
    isComplete: boolean;
    currentCategory: number;
    currentQuestion: number;
    answers: any[];
    totalScore: number;
    scores: any[];
  };
  setSessionState: React.Dispatch<React.SetStateAction<{
    isComplete: boolean;
    currentCategory: number;
    currentQuestion: number;
    answers: any[];
    totalScore: number;
    scores: any[];
  }>>;
  message: string;
  setMessage: (message: string) => void;
}

export function DigitalFitCheck({ 
  sessionState,
  setSessionState,
  message,
  setMessage
}: DigitalFitCheckProps) {
  const [state, setState] = React.useState<SessionState>({
    currentQuestionIndex: -1,
    answers: [],
    messages: [
      {
        type: 'bot',
        content: 'Willkommen beim Digitalisierungs-Check! Bitte wählen Sie Ihre Branche aus:'
      }
    ],
    isComplete: false
  })
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  const calculateScore = (answers: Answer[]): number => {
    if (answers.length === 0) return 0;
    
    let totalWeightedPoints = 0;
    let maxWeightedPoints = 0;
    
    answers.forEach(answer => {
      const weightFactor = answer.weight === 'high' ? 1.5 : answer.weight === 'medium' ? 1.0 : 0.5;
      totalWeightedPoints += answer.points * weightFactor;
      maxWeightedPoints += 5 * weightFactor; // 5 ist die maximale Punktzahl
    });
    
    return (totalWeightedPoints / maxWeightedPoints) * 100;
  };

  const handleIndustrySelect = (industry: Industry) => {
    setState(prev => ({
      ...prev,
      selectedIndustry: industry,
      currentQuestionIndex: 0,
      messages: [
        ...prev.messages,
        { type: 'user', content: `Branche: ${industry.name}` },
        { type: 'bot', content: industry.questions[0].text }
      ]
    }));
  };

  const handleAnswer = async (points: number) => {
    if (!state.selectedIndustry) return;

    const currentQuestion = state.selectedIndustry.questions[state.currentQuestionIndex];
    const answer: Answer = {
      questionId: currentQuestion.id,
      points,
      weight: currentQuestion.weight
    };

    const newAnswers = [...state.answers, answer];
    const isLastQuestion = state.currentQuestionIndex === state.selectedIndustry.questions.length - 1;

    if (isLastQuestion) {
      const finalScore = calculateScore(newAnswers);
      
      setState(prev => ({
        ...prev,
        answers: newAnswers,
        score: finalScore,
        messages: [
          ...prev.messages,
          { type: 'user', content: currentQuestion.choices.find(c => c.points === points)?.text || '' },
          { 
            type: 'bot', 
            content: `Basierend auf Ihren Antworten beträgt Ihr Digitalisierungsgrad ${finalScore.toFixed(1)}%.`
          }
        ]
      }));
    } else {
      setState(prev => ({
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        messages: [
          ...prev.messages,
          { type: 'user', content: currentQuestion.choices.find(c => c.points === points)?.text || '' },
          { type: 'bot', content: prev.selectedIndustry!.questions[prev.currentQuestionIndex + 1].text }
        ]
      }));
    }
  };

  const handleComplete = async () => {
    setIsAnalyzing(true)
    try {
      const currentIndustry = state.selectedIndustry
      if (!currentIndustry) return

      const answersWithDetails = state.answers.map(answer => {
        const question = currentIndustry.questions.find(q => q.id === answer.questionId)
        return {
          question: question?.text || '',
          answer: question?.choices.find(c => c.points === answer.points)?.text || '',
          points: answer.points
        }
      })

      const aiResponse = await analyzeDigitalFitness({
        industry: currentIndustry.name,
        answers: answersWithDetails,
        score: state.score || 0
      })

      if (aiResponse.error) {
        setMessage('Es gab ein Problem bei der KI-Analyse. ' + aiResponse.error)
      } else {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, {
            type: 'bot',
            content: aiResponse.response
          }],
          isComplete: true
        }))
      }
    } catch (error) {
      console.error('Error during analysis:', error)
      setMessage('Es gab ein Problem bei der Analyse Ihrer Antworten.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Digitalisierungs-Check
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {state.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 p-4 rounded-lg",
                  message.type === 'user' ? 'bg-primary/10 ml-auto' : 'bg-muted'
                )}
              >
                {message.type === 'bot' ? (
                  <Bot className="w-6 h-6 mt-1" />
                ) : (
                  <User className="w-6 h-6 mt-1" />
                )}
                <div className="flex-1">{message.content}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {state.currentQuestionIndex === -1 && (
          <div className="grid grid-cols-2 gap-2 w-full">
            {industries.map((industry) => (
              <Button
                key={industry.id}
                onClick={() => handleIndustrySelect(industry)}
                variant="outline"
                className="w-full"
              >
                {industry.name}
              </Button>
            ))}
          </div>
        )}
        {state.selectedIndustry && !state.isComplete && state.currentQuestionIndex >= 0 && (
          <div className="grid grid-cols-2 gap-2 w-full">
            {state.selectedIndustry.questions[state.currentQuestionIndex].choices.map((choice) => (
              <Button
                key={choice.text}
                onClick={() => handleAnswer(choice.points)}
                variant="outline"
                className="w-full"
              >
                {choice.text}
              </Button>
            ))}
          </div>
        )}
        {state.score !== undefined && !state.isComplete && (
          <Button
            onClick={handleComplete}
            variant="outline"
            className="w-full"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyse läuft...' : 'Analyse starten'}
          </Button>
        )}
        {state.score !== undefined && state.isComplete && (
          <div className="w-full space-y-2">
            <Progress value={state.score} className="w-full" />
            <p className="text-center">Digitalisierungsgrad: {state.score.toFixed(1)}%</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}