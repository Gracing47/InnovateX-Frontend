import { UserProfile, SessionState, AssessmentResult } from '../types/digitalFitCheck';
import { MESSAGES } from '../constants/digitalFitCheck';

export class DigitalFitCheckService {
  private static async fetchWithError(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || MESSAGES.ERROR.SERVER_ERROR);
    }

    return data;
  }

  static async initializeCheck(userProfile: UserProfile) {
    return this.fetchWithError('/api/digital-fit-check', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        type: 'INIT_QUESTIONS',
        userProfile
      })
    });
  }

  static async submitAnswer(sessionState: SessionState) {
    return this.fetchWithError('/api/digital-fit-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'SUBMIT_ANSWER',
        sessionState
      })
    });
  }

  static async completeAssessment(sessionState: SessionState): Promise<AssessmentResult> {
    return this.fetchWithError('/api/digital-fit-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'COMPLETE',
        sessionState
      })
    });
  }
}
