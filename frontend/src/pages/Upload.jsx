import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadNotes } from "../features/session/fileSession";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";

const Upload = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const { isLoading } = useSelector((state) => state.fileSession);
  const [isProcessing, setIsProcessing] = useState(false);

  // Combined — true during upload OR during AI processing
  const showSpinner = isLoading || isProcessing;

  useEffect(() => {
    if (!user?._id) {
      console.warn("No user ID found, skipping socket connection");
      return; // ✅ Fix 2: Early return BEFORE socket is created — no cleanup needed
    }

    const socket = io("http://localhost:5000", {
      query: { userId: user._id },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      // ✅ Fix 3: Add error handler so failures aren't silent
      console.error("Socket connection error:", err.message);
    });

    socket.on("file:update", (data) => {
      console.log("FILE UPDATE:", data);


       if (data.status === "PROCESSING") {
    setIsProcessing(true);   // 👈 keep spinner on during AI processing
  }

      if (data.status === "READY") {
         setIsProcessing(false);
        navigate(`/chat/${data.fileId}`);
      }

      if (data.status === "FAILED") {
        setIsProcessing(false); 
        alert("File processing failed");
      }
    });

    // ✅ Cleanup only runs when socket was actually created
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, [user?._id, navigate]); // ✅ Fix 4: depend on the primitive _id, not the object

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select the file first");
      return;
    }

    dispatch(uploadNotes(file));
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
      <div
        onSubmit={handleUpload}
        className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
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
          disabled={showSpinner}
          className={`w-full mt-6 text-white p-3.5 rounded-xl font-bold transition shadow-lg shadow-purple-900/40 active:scale-[0.98]
    ${
      showSpinner
        ? "bg-slate-500 opacity-60 cursor-not-allowed"
        : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
    }`}
        >
          {showSpinner ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            <span>Upload</span>
          )}
        </button>
      </div>

      {/* Info Section */}
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <h2 className="text-xl font-bold mb-2">How it works?</h2>
        <p className="text-gray-300 text-sm">
          Upload your notes → AI processes content → Ask questions and get
          answers instantly.
        </p>
      </div>
    </div>
  );
};

export default Upload;
