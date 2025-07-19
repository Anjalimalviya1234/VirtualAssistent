import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext); // ✅ include setUserData

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false); // ✅ optional

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name || !email || !password) {
      setErr("Please fill in all fields");
      return;
    }

    try {
      setLoading(true); 
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      navigate("/customize");
    } catch (error) {
      console.error("Signup error:", error);
      setErr(
        error?.response?.data?.message ||
          "Signup failed. Please try again later."
      );
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignup}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur
        shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] rounded-lg"
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px] text-center">
          Register to <span className="text-blue-500">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent
          text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent
          text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[20px]"
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full outline-none bg-transparent
            text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[20px] pr-[50px]"
          />
          <div
            className="absolute right-[20px] cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <IoIosEyeOff className="w-[25px] h-[25px] text-white" />
            ) : (
              <IoIosEye className="w-[25px] h-[25px] text-white" />
            )}
          </div>
        </div>

        {err.length > 0 && (
          <p className="text-red-500 text-sm text-center">* {err}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-[60px] ${
            loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          } transition text-white text-[20px] font-semibold rounded-full`}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        <p className="text-white text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
