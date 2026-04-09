import { useState } from "react";
import { useDispatch } from "react-redux";
import {uploadNotes} from "../features/session/fileSession";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleFileChange = (e) => {
      setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
     e.preventDefault();
      
     if(!file){
      alert("Please select the file first")
      return;
     }
     console.log("hello from upload")
    dispatch(uploadNotes(file));
    navigate("/chat");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white p-6 sm:p-10">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-black">
          Upload <span className="text-purple-400">Notes</span>
        </h1>
        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Add your PDFs or documents and let AI understand them
        </p>
      </div>

      {/* Upload Card */}
      <div  onSubmit={handleUpload} className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        
        {/* Drag & Drop Area */}
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/10 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="text-lg font-semibold text-purple-300">
              Click to upload or drag & drop
            </p>
            <p className="text-sm text-gray-300 mt-1">
              PDF, DOCX, TXT (Max 10MB)
            </p>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* File List */}
        

        {/* Upload Button */}
        <button
         onClick={handleUpload}
          className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3.5 rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition shadow-lg shadow-purple-900/40 active:scale-[0.98]"
        >
          Upload & Process
        </button>
      </div>

      {/* Info Section */}
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <h2 className="text-xl font-bold mb-2">
          How it works?
        </h2>
        <p className="text-gray-300 text-sm">
          Upload your notes → AI processes content → Ask questions and get answers instantly.
        </p>
      </div>
    </div>
  );
};

export default Upload;