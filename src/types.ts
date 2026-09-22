/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuestionOption {
  id: string;
  text: string;
  isCompliment: boolean; // complimentary or positive choice
  reactionSubtitle?: string; // playful custom hint or remark
}

export interface SurpriseGift {
  name: string;
  symbol: string;
  description: string;
  tag: string;
}

export interface StageTheme {
  name: string;
  primaryColor: string;
  accentColor: string;
  envelopeColor: string;
  envelopeFlapColor: string;
  innerLiningColor: string;
  textColor: string;
  ambientGlow: string;
  backgroundGradient: string;
  flowerType: 'tulip' | 'lotus' | 'rose' | 'jasmine' | 'marigold' | 'orchid';
  environmentName: string;
}

export interface PhotoReward {
  filename: string;
  caption: string;
  memoryTitle: string;
}

export interface ConfessionData {
  title: string;
  subtitle: string;
  letter: string[];
  proposalQuestion: string;
  yesText: string;
  noText: string;
}

export interface QuestionStage {
  id: number;
  stageNumber: string; // e.g., "01"
  themeTitle: string; // e.g., "Birthday Princess"
  question: string;
  shayariOrQuote?: string;
  options: QuestionOption[];
  complimentResponse: {
    title: string;
    message: string;
    shayari?: string;
    royalTitleAwarded?: string;
  };
  playfulResponse: {
    title: string;
    message: string;
    hint: string;
    shayari?: string;
  };
  surprise: SurpriseGift;
  theme: StageTheme;
  photoReward?: PhotoReward;
  isConfession?: boolean;
  confessionData?: ConfessionData;
}

export interface UserAnswerHistory {
  stageId: number;
  selectedOptionId: string;
  isCompliment: boolean;
  timestamp: number;
}
