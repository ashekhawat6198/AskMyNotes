import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import fileReducer from '../features/session/fileSession';
import chatReducer from '../features/chat/chatSlice';
const store=configureStore({
    reducer: {
       auth: authReducer,
       fileSession:fileReducer,
       chat:chatReducer
    },
    devTools:true,
});

export default store