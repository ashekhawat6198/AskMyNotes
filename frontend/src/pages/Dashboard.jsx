import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const {user} = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white p-6 sm:p-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-black">
          Welcome <span className="text-purple-400">{user.name.split(" ")[0]}</span>
        </h1>

        <button className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition">
          Logout
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Upload Notes */}
        <Link to="/upload">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition cursor-pointer">
            <h2 className="text-xl font-bold mb-2 text-purple-300">
              Upload Notes
            </h2>
            <p className="text-gray-300 text-sm">
              Add PDFs or documents and let AI process them for Q&A.
            </p>
          </div>
        </Link>

        {/* Ask Question */}
        <Link to="/ask">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition cursor-pointer">
            <h2 className="text-xl font-bold mb-2 text-purple-300">
              Ask Questions
            </h2>
            <p className="text-gray-300 text-sm">
              Ask anything from your uploaded notes and get instant answers.
            </p>
          </div>
        </Link>

        {/* Previous Chats */}
        <Link to="/history">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition cursor-pointer">
            <h2 className="text-xl font-bold mb-2 text-purple-300">
              Previous Chats
            </h2>
            <p className="text-gray-300 text-sm">
              Revisit your past questions and continue learning.
            </p>
          </div>
        </Link>
      </div>

      {/* Stats Section (Optional but premium feel) */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
          <h3 className="text-2xl font-bold text-purple-400">12</h3>
          <p className="text-gray-300 text-sm mt-1">Uploaded Files</p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
          <h3 className="text-2xl font-bold text-purple-400">48</h3>
          <p className="text-gray-300 text-sm mt-1">Questions Asked</p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
          <h3 className="text-2xl font-bold text-purple-400">7</h3>
          <p className="text-gray-300 text-sm mt-1">Active Sessions</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-14 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Ready to explore your notes?
        </h2>
        <p className="text-gray-300 mb-6">
          Upload your notes and start asking questions instantly.
        </p>

        <Link to="/upload">
          <button className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition shadow-lg shadow-purple-900/40">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;