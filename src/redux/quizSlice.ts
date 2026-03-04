import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FullQuiz } from '../types/quizType';
import type { Question, QuestionRecord } from '../types/questionType';
import { getQuizByIdPopulated } from './axios';

interface QuizState {
    quiz: FullQuiz | null;
    questions: Question[] | null;
    currentQuestionIndex: number | null;
    scoreFinal: number | null;
    questionRecord: QuestionRecord[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: QuizState = {
    quiz: null,
    questions: null,
    currentQuestionIndex: null,
    scoreFinal: null,
    questionRecord: null,
    loading: false,
    error: null,
};

export const fetchQuizWithQuestions = createAsyncThunk(
    'quiz/fetchQuizWithQuestions',
    async (quizId: string) => {
        const response = await getQuizByIdPopulated(quizId);
        return response;
    }
);

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setQuiz: (state, action) => {
            const { quiz, questions } = action.payload;
            state.quiz = quiz;
            state.questions = questions;
            state.currentQuestionIndex = 0;
            state.scoreFinal = 0;
            state.questionRecord = questions ? questions.map((q: Question) => ({
                _id: q._id,
                text: q.text,
                options: q.options,
                keywords: q.keywords,
                correctAnswerIndex: q.correctAnswerIndex,
                author: q.author,
                answeredPickedIndex: null,
            })) : null;
            state.error = null;
        },
        getNextQuestion: (state) => {
            if (state.currentQuestionIndex !== null && state.questions && state.currentQuestionIndex < state.questions.length - 1) {
                state.currentQuestionIndex += 1;
            }
        },
        getPreviousQuestion: (state) => {

            if (state.currentQuestionIndex !== null && state.currentQuestionIndex > 0) {
                state.currentQuestionIndex -= 1;
            }
        },
        recordAnswer: (state, action) => {
            const { questionIndex, pickedIndex } = action.payload;
            if (state.questionRecord && state.questions && questionIndex < state.questions.length) {
                const wasAlreadyAnswered = state.questionRecord[questionIndex].answeredPickedIndex !== null;
                const wasCorrect = state.questionRecord[questionIndex].answeredPickedIndex === state.questions[questionIndex].correctAnswerIndex;

                state.questionRecord[questionIndex].answeredPickedIndex = pickedIndex;

                const isCorrect = pickedIndex === state.questions[questionIndex].correctAnswerIndex;

                if (wasAlreadyAnswered) {
                    if (wasCorrect && !isCorrect) {
                        state.scoreFinal = (state.scoreFinal || 0) - 1;
                    } else if (!wasCorrect && isCorrect) {
                        state.scoreFinal = (state.scoreFinal || 0) + 1;
                    }
                } else {
                    if (isCorrect) {
                        state.scoreFinal = (state.scoreFinal || 0) + 1;
                    }
                }
            }
        },
        resetQuiz: (state) => {
            state.quiz = null;
            state.questions = null;
            state.currentQuestionIndex = null;
            state.scoreFinal = null;
            state.questionRecord = null;
            state.error = null;
        },
        getFinalScore: (state) => {
            if (state.questionRecord) {
                state.scoreFinal = state.questionRecord.reduce((score, record) => {
                    if (record.answeredPickedIndex === record.correctAnswerIndex) {
                        return score + 1;
                    }
                    return score;
                }, 0);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizWithQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizWithQuestions.fulfilled, (state, action) => {
                state.loading = false;
                const quizData = action.payload;
                state.quiz = quizData;
                state.questions = quizData.questions as Question[];
                state.currentQuestionIndex = 0;
                state.scoreFinal = 0;
                state.questionRecord = quizData.questions ? (quizData.questions as Question[]).map((q: Question) => ({
                    _id: q._id,
                    text: q.text,
                    options: q.options,
                    keywords: q.keywords,
                    correctAnswerIndex: q.correctAnswerIndex,
                    author: q.author,
                    answeredPickedIndex: null,
                })) : null;
            })
            .addCase(fetchQuizWithQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch quiz';
            });
    },
});

export const {
    setQuiz,
    getNextQuestion,
    getPreviousQuestion,
    recordAnswer,
    resetQuiz,
    getFinalScore,
} = quizSlice.actions;

export default quizSlice.reducer;