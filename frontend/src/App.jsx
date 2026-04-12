import React from "react";
import { Routes, Route } from "react-router-dom";
// import useSocket from './hooks/useSocket';
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Upload from "./pages/Upload";
import Chat from "./pages/chat";

function App() {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      <main className='container mx-auto p-4'>
        <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/' element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/chat/:fileId" element={<Chat/>} />
          </Route>
        </Routes>
      </main>
       <ToastContainer position='top-right' autoClose={3000}/>
    </div>
  );
}

export default App;
