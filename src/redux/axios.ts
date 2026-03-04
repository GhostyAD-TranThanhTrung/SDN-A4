import axios from "axios";
import type { LoginDto, CreateUserDto, User } from "../types/userType";
import type { CreateQuizDto } from "../types/quizType";
import type {  CreateQuestionDto } from "../types/questionType";



const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

const attachToken = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const login = async (credentials: LoginDto) => {
    try {
        const response = await api.post('/users', credentials);
        console.log('Login response:', response.data);

        // Store token and admin status in localStorage
        const { token, admin = false, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', admin.toString());
        localStorage.setItem('user', JSON.stringify(user));

        // Attach token to future requests
        attachToken(token);

        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

const loadTokenFromStorage = () => {
    const token = localStorage.getItem('token');
    if (token) {
        attachToken(token);
    }
    return token;
}

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
}

// Helper to get user admin status
const getIsAdmin = (): boolean => {
    return localStorage.getItem('isAdmin') === 'true';
}

// Helper to get current user
const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

const register = async (userData: CreateUserDto) => {
    try {
        console.log('Registering user with data:', userData);
        const response = await api.post('/users/create', userData);
        console.log('Register response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

const getQuizzes = async () => {
    try {
        const response = await api.get('/quizzes');
        console.log('Get quizzes response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        throw error;
    }
}

const getQuizzesPopulated = async () => {
    try {
        const response = await api.get('/quizzes/populate');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch populated quizzes:', error);
        throw error;
    }
}

const getQuizById = async (id: string) => {
    try {
        const response = await api.get(`/quizzes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch quiz with id ${id}:`, error);
        throw error;
    }
}

const getQuizByIdPopulated = async (id: string) => {
    try {
        const response = await api.get(`/quizzes/${id}/populate`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch populated quiz with id ${id}:`, error);
        throw error;
    }
}

const updateQuiz = async (id: string, quizData: Partial<CreateQuizDto>) => {
    try {
        // Ensure token is attached before request (admin only)
        const token = localStorage.getItem('token');
        if (token) {
            attachToken(token);
        }
        const response = await api.put(`/quizzes/${id}`, quizData);
        return response.data;
    } catch (error) {
        console.error(`Failed to update quiz with id ${id}:`, error);
        throw error;
    }
}

const deleteQuiz = async (id: string) => {
    try {
        // Ensure token is attached before request (admin only)
        const token = localStorage.getItem('token');
        if (token) {
            attachToken(token);
        }
        const response = await api.delete(`/quizzes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete quiz with id ${id}:`, error);
        throw error;
    }
}

const getAllUsers = async () => {
    try {
        // Ensure token is attached before request (admin only)
        const token = localStorage.getItem('token');
        if (token) {
            attachToken(token);
        }
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
    }
}

const getAllQuestionsOfQuiz = async (quizId: string) => {
    try {
        const response = await api.get(`/quizzes/${quizId}/question`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch questions for quiz ${quizId}:`, error);
        throw error;
    }
}

const createQuestion = async (quizId: string, questionData: CreateQuestionDto | CreateQuestionDto[]) => {
    try {
        // Ensure token is attached before request (verified user)
        const token = localStorage.getItem('token');
        if (token) {
            attachToken(token);
        }
        const response = await api.post(`/quizzes/${quizId}/question`, questionData);
        return response.data;
    } catch (error) {
        console.error(`Failed to create question for quiz ${quizId}:`, error);
        throw error;
    }
}

const getQuestionById = async (quizId: string, questionId: string) => {
    try {
        const response = await api.get(`/quizzes/${quizId}/question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch question ${questionId} from quiz ${quizId}:`, error);
        throw error;
    }
}

const updateQuestion = async (quizId: string, questionId: string, questionData: Partial<CreateQuestionDto>) => {
    try {
        // Ensure token is attached before request (verified user)
        const token = localStorage.getItem('token');
        if (token) {
            attachToken(token);
        }
        const response = await api.put(`/quizzes/${quizId}/question/${questionId}`, questionData);
        return response.data;
    } catch (error) {
        console.error(`Failed to update question ${questionId} in quiz ${quizId}:`, error);
        throw error;
    }
}

const deleteQuestion = async (quizId: string, questionId: string) => {
    try {
        // Ensure token is attached before request (verified user)
        const token = localStorage.getItem('token');
        if (token) {
            attachToken(token);
        }
        const response = await api.delete(`/quizzes/${quizId}/question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete question ${questionId} from quiz ${quizId}:`, error);
        throw error;
    }
}

const createQuiz = async (quizData: CreateQuizDto) => {
    try {
        // Ensure token is attached before request
        const token = localStorage.getItem('token');
        if (token) {
            attachToken(token);
        }
        const response = await api.post('/quizzes', quizData);
        console.log('Create quiz response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create quiz:', error);
        throw error;
    }
}


export {
    login,
    register,
    attachToken,
    loadTokenFromStorage,
    logout,
    getIsAdmin,
    getCurrentUser,
    getAllUsers,
    getQuizzes,
    getQuizzesPopulated,
    getQuizById,
    getQuizByIdPopulated,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getAllQuestionsOfQuiz,
    createQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};