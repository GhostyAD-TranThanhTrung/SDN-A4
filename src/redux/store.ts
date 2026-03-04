import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginSlide'
import quizReducer from './quizSlice'
// ...

export const store = configureStore({
    reducer: {
        login: loginReducer,
        quiz: quizReducer
    }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store