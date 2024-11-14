import { useState, useCallback } from 'react';
import { 
  Step, 
  UserProfile, 
  SessionState, 
  Message,
  AssessmentType 
} from '../types/digitalFitCheck';
import { STEPS, MESSAGES } from '../constants/digitalFitCheck';
import { DigitalFitCheckService } from '../services/digitalFitCheck';

export const useDigitalFitCheck = () => {
  const [currentStep, setCurrentStep] = useState<Step>(STEPS.WELCOME);
  const [messages, setMessages] = useState<Message[]>([{
    type: 'bot',
    content: MESSAGES.WELCOME.TITLE + '\\n\\n' + MESSAGES.WELCOME.DESCRIPTION
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    industry: '',
    numberOfEmployees: 0,
    assessmentType: 'quick' as AssessmentType,
    role: 'unternehmer'
  });

  const handleNextStep = useCallback(() => {
    const steps = Object.values(STEPS);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1] as Step);
    }
  }, [currentStep]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const initializeCheck = useCallback(async (assessmentType: AssessmentType) => {
    try {
      setIsLoading(true);
      const updatedProfile = {
        ...userProfile,
        assessmentType
      };

      // Validate user profile before sending
      if (!updatedProfile.name || !updatedProfile.industry || updatedProfile.numberOfEmployees <= 0) {
        throw new Error('Bitte füllen Sie alle Felder korrekt aus.');
      }

      const response = await DigitalFitCheckService.initializeCheck(updatedProfile);
      
      setSessionState(response.sessionState);
      setMessages(prev => [...prev,
        { 
          type: 'user', 
          content: assessmentType === 'quick' ? 'Express Check' : 'Detaillierte Analyse' 
        },
        { 
          type: 'bot', 
          content: response.message 
        }
      ]);
      
      handleNextStep();
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: error instanceof Error ? error.message : MESSAGES.ERROR.SERVER_ERROR
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, handleNextStep]);

  const submitAnswer = useCallback(async (rating: number) => {
    if (!sessionState?.questions) return;

    try {
      setIsLoading(true);
      
      // Check if session state is valid
      if (!sessionState) {
        throw new Error('Ungültiger Sitzungsstatus.');
      }

      const updatedSessionState: SessionState = {
        ...sessionState,
        answers: [...sessionState.answers, {
          category: sessionState.questions[sessionState.currentQuestion].category,
          questionIndex: sessionState.currentQuestion,
          rating,
          question: sessionState.questions[sessionState.currentQuestion].question // Added question property
        }],
        currentQuestion: sessionState.currentQuestion + 1,
        isComplete: sessionState.currentQuestion + 1 >= sessionState.questions.length
      };

      const response = await DigitalFitCheckService.submitAnswer(updatedSessionState);
      
      setSessionState(response.sessionState);
      setMessages(prev => [...prev,
        { type: 'user', content: `${rating} Sterne` },
        { type: 'bot', content: response.message }
      ]);

      if (updatedSessionState.isComplete) {
        const result = await DigitalFitCheckService.completeAssessment(updatedSessionState);
        setMessages(prev => [...prev, {
          type: 'bot',
          content: MESSAGES.SUCCESS.ASSESSMENT_COMPLETE
        }]);
        handleNextStep();
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: error instanceof Error ? error.message : MESSAGES.ERROR.SERVER_ERROR
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionState, handleNextStep]);

  return {
    currentStep,
    messages,
    isLoading,
    sessionState,
    userProfile,
    handleNextStep,
    updateProfile,
    initializeCheck,
    submitAnswer
  };
};
