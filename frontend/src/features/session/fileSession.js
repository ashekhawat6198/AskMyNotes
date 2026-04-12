import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {useNavigate} from "react-router-dom";



const API_URL = "http://localhost:5000/api/file";

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((request) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    request.headers.Authorization = `Bearer ${user.token}`;
  }
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

const initialState = {
  
  isError: false,
  isLoading: false,
  message: "",
};

export const uploadNotes = createAsyncThunk(
  "/uploadFile",
  async (file, thunkAPI) => {
    
    try {
     
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/upload", formData);
     
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);


export const sessionSlice = createSlice({
  name: "fileSession",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.message = "";
      state.isLoading = false;
    },
  },                              // 👈 reducers closes here
  extraReducers: (builder) => {   // 👈 extraReducers is outside reducers
    builder
      .addCase(uploadNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadNotes.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});


export const { reset} = sessionSlice.actions;
export default sessionSlice.reducer;