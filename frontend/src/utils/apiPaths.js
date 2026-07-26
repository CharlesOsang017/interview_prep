export const BASE_URL = import.meta.env.VITE_BASE_URL;;

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        LOGOUT: "/api/auth/logout",
        GET_PROFILE: "/api/auth/profile",
    },
    AI: {
        GENERATE_QUESTIONS: "/api/ai/generate-questions",
        GENERATE_EXPLANATION: "/api/ai/generate-explanation",
    },
    SESSION: {
        CREATE: "/api/sessions/create",
        GET_ALL: "/api/sessions/my-sessions",
        GET_ONE: (id) => `/api/sessions/${id}`,      
        DELETE: (id) => `/api/sessions/${id}`,
    },
    QUESTION: {
        ADD_TO_SESSION: "/api/questions/add",
        PIN: (id) => `/api/questions/${id}/pin`,
        UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
        EXPLAIN: (id) => `/api/questions/${id}/explain`,
        ANSWER_TIP: (id) => `/api/questions/${id}/answer-tip`,
    },
}
