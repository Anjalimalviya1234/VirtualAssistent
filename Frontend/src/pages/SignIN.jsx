import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function Signin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl } = useContext(userDataContext);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading,setLoading]=useState(false)
  const handleSignIn= async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true)

    if ( !email || !password) {
      setErr("Please fill in all fields");
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {  email, password },
        { withCredentials: true }
      );
      console.log(result.data);
     setLoading(false)
     navigate("/")
    } catch (error) {
        setLoading(false)
      console.error("Signup error:", error);
      setErr(
        error?.response?.data?.message ||
          "Signup failed. Please try again later."
      );
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignIn}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur
        shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] rounded-lg"
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px] text-center">
          sign in to <span className="text-blue-500">Virtual Assistant</span>
        </h1>

        

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
          className="w-full h-[60px] bg-blue-500 hover:bg-blue-600 transition text-white text-[20px] font-semibold rounded-full"
        disabled={loading}>
         {loading?"loading...":"sign In"}
        </button>

        <p className="text-white text-sm">
              Want to create new Account{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signin;
