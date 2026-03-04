export interface Question {
    _id?: string;
    text: string;
    options: string[];
    keywords: string[];
    correctAnswerIndex: number;
    author: string | User;
}

export interface QuestionRecord {
    _id?: string;
    text: string;
    options: string[];
    keywords: string[];
    correctAnswerIndex: number;
    author: string | User;
    answeredPickedIndex: number | null;
}

export interface CreateQuestionDto {
    text: string;
    options: string[];
    keywords: string[];
    correctAnswerIndex: number;
}

import type { User } from './userType';
