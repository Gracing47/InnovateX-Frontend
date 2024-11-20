export interface Industry {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  weight: 'high' | 'medium' | 'low';
  type: 'choice';
  choices: {
    text: string;
    points: number;
  }[];
}

export const industries: Industry[] = [
  {
    id: 'retail',
    name: 'Einzelhandel',
    questions: [
      {
        id: 'q1',
        text: 'Wie stark nutzen Sie digitale Verkaufskanäle (z.B. Online-Shop, Social Media)?',
        weight: 'high',
        type: 'choice',
        choices: [
          { text: 'Gar nicht', points: 0 },
          { text: 'Gelegentlich', points: 2 },
          { text: 'Regelmäßig', points: 3 },
          { text: 'Hauptsächlich', points: 5 }
        ]
      },
      {
        id: 'q2',
        text: 'Setzen Sie ein digitales Warenwirtschaftssystem ein?',
        weight: 'high',
        type: 'choice',
        choices: [
          { text: 'Nein', points: 0 },
          { text: 'In Planung', points: 2 },
          { text: 'Teilweise', points: 3 },
          { text: 'Vollständig', points: 5 }
        ]
      },
      {
        id: 'q3',
        text: 'Wie erfassen Sie Kundendaten und -präferenzen?',
        weight: 'medium',
        type: 'choice',
        choices: [
          { text: 'Gar nicht', points: 0 },
          { text: 'Manuell auf Papier', points: 1 },
          { text: 'Digital, aber unstrukturiert', points: 3 },
          { text: 'Strukturiert in CRM-System', points: 5 }
        ]
      },
      {
        id: 'q4',
        text: 'Nutzen Sie digitale Marketingkanäle?',
        weight: 'medium',
        type: 'choice',
        choices: [
          { text: 'Nein', points: 0 },
          { text: 'Nur soziale Medien', points: 2 },
          { text: 'Mehrere Kanäle', points: 4 },
          { text: 'Umfassende digitale Marketingstrategie', points: 5 }
        ]
      },
      {
        id: 'q5',
        text: 'Wie digital ist Ihre Lagerverwaltung?',
        weight: 'low',
        type: 'choice',
        choices: [
          { text: 'Manuell', points: 0 },
          { text: 'Teilweise digital', points: 3 },
          { text: 'Vollständig digital', points: 5 }
        ]
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Gesundheitswesen',
    questions: [
      {
        id: 'q1',
        text: 'Nutzen Sie eine digitale Patientenakte?',
        weight: 'high',
        type: 'choice',
        choices: [
          { text: 'Nein', points: 0 },
          { text: 'In Planung', points: 2 },
          { text: 'Teilweise', points: 3 },
          { text: 'Vollständig', points: 5 }
        ]
      },
      {
        id: 'q2',
        text: 'Bieten Sie Telemedizin/Videosprechstunden an?',
        weight: 'high',
        type: 'choice',
        choices: [
          { text: 'Nein', points: 0 },
          { text: 'In Planung', points: 2 },
          { text: 'Gelegentlich', points: 3 },
          { text: 'Regelmäßig', points: 5 }
        ]
      },
      {
        id: 'q3',
        text: 'Wie digital ist Ihre Terminvergabe?',
        weight: 'medium',
        type: 'choice',
        choices: [
          { text: 'Nur telefonisch', points: 0 },
          { text: 'E-Mail möglich', points: 2 },
          { text: 'Online-Buchungssystem', points: 5 }
        ]
      },
      {
        id: 'q4',
        text: 'Nutzen Sie digitale Diagnostik-Tools?',
        weight: 'medium',
        type: 'choice',
        choices: [
          { text: 'Nein', points: 0 },
          { text: 'Vereinzelt', points: 2 },
          { text: 'Regelmäßig', points: 4 },
          { text: 'Umfassend', points: 5 }
        ]
      },
      {
        id: 'q5',
        text: 'Wie erfolgt der Datenaustausch mit anderen Gesundheitseinrichtungen?',
        weight: 'low',
        type: 'choice',
        choices: [
          { text: 'Papierbasiert', points: 0 },
          { text: 'Teilweise digital', points: 3 },
          { text: 'Vollständig digital', points: 5 }
        ]
      }
    ]
  }
];
