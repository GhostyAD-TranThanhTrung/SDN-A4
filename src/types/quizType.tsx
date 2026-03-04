export interface Quiz {
  _id?: string;
  title: string;
  description: string;
  questions?: string[];
}

export interface FullQuiz {
  _id?: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface CreateQuizDto {
  title: string;
  description: string;
}

import type { Question } from "./questionType";
