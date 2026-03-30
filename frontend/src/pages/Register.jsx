import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success("User Registered Successfully");
      navigate("/");
      dispatch(reset());
    }
    if (user && !isSuccess) {
      navigate("/");
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name,
        email,
        password,
      };
      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 sm:px-6 py-10">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-6 sm:p-10 border border-white/20 rounded-2xl shadow-2xl">
        <div className="text-center mb-8 ">
          <h2 className="text-xs font-black  tracking-[0.3m] text-purple-300 mb-2">
          AskMyNotes
          </h2>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Get <span className="text-purple-400">Started</span>
          </h1>
          <p className="text-gray-300 mt-3 text-sm sm:text-base px-2">
            Create an account to start asking your notes and get instant answers
          </p>
        </div>

        <form onSubmit={onSubmit} action="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-300 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
              placeholder="Aman Singh"
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-300 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
              placeholder="aman@gmail.com"
              onChange={onChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-300 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                placeholder="********"
                onChange={onChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-300 ml-1">
                Confirm
              </label>
              <input
                type="password"
                name="password2"
                value={password2}
                className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                placeholder="********"
                onChange={onChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3.5 rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg shadow-purple-900/40 mt-4 active:scale-[0.98]"
          >
            Create My Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-300 ">
          Already have an account ?
          <Link to="/login" className="text-purple-400 font-bold hover:underline ml-1">
            Login
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Register;