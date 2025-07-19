import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { BiMenuAltRight } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";

function Home() {
  const { userData, serverUrl, setUserData, getGemini } = useContext(userDataContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const lastHeardRef = useRef("");
  const synth = window.speechSynthesis;
  const [aitext, setAitext] = useState("");
  const [usertext, setUsertext] = useState("");

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setUserData(null);
      navigate("/signin");
    }
  };

  
  const speak = useCallback((text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice =
        voices.find((v) => v.name.includes("Google")) ||
        voices.find((v) => v.lang === "en-US") ||
        voices[0];
    }

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setTimeout(() => {
        if (!isRecognizingRef.current) {
          try {
            recognitionRef.current?.start();
          } catch (error) {
            console.log(error);
          }
        }
      }, 1000);
    };

    if (!voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        utterance.voice =
          updatedVoices.find((v) => v.name.includes("Google")) ||
          updatedVoices.find((v) => v.lang === "en-US") ||
          updatedVoices[0];
        synth.speak(utterance);
      };
    } else {
      synth.speak(utterance);
    }
  }, []);

  const handleCommand = useCallback(({ type, userInput, response }) => {
    speak(response);
    const query = encodeURIComponent(userInput);

    switch (type) {
      case "google-search":
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        break;
      case "youtube-search":
      case "youtube-play":
        window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        break;
      case "calculate-open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;
      case "facebook-open":
        window.open("https://www.facebook.com", "_blank");
        break;
      case "instagram-open":
        window.open("https://www.instagram.com", "_blank");
        break;
      case "weather-show":
        window.open("https://www.google.com/search?q=weather", "_blank");
        break;
      case "get-time": {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        speak(`The current time is ${timeString}`);
        break;
      }
      case "general":
    
      break;
      default:
        console.warn("Unknown or unrecognized command:", type);
    }
  }, [speak]);

  useEffect(() => {
    if (!userData?.assistantName) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      console.warn("SpeechRecognition not supported.");
      return;
    }

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.lang = "en-US";

    const safeStart = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (err) {
          if (err.name !== "InvalidStateError") console.error(err);
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      setAitext("");
      isRecognizingRef.current = false;
      setListening(false);
      setTimeout(safeStart, 1000);
    };

    recognition.onerror = (e) => {
      isRecognizingRef.current = false;
      setListening(false);
      if (e.error !== "aborted") setTimeout(safeStart, 800);
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript === lastHeardRef.current) return;
      lastHeardRef.current = transcript;

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAitext("");
        setUsertext(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        try {
          const data = await getGemini(transcript);
          if (data) {
            handleCommand(data);
            setAitext(data.response);
            setUsertext("");
          }
        } catch (err) {
          console.error("Gemini error:", err);
          speak("Sorry, something went wrong.");
        }
      }
    };

    safeStart();
    const keepAlive = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) safeStart();
    }, 1000);

    return () => {
      clearInterval(keepAlive);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
    };
  }, [userData, getGemini, handleCommand, speak]);

  const MenuButton = ({ text, onClick }) => (
    <button
      className="min-w-[150px] h-[60px] bg-white text-black rounded-full font-semibold hover:bg-gray-200"
      onClick={onClick}
    >
      {text}
    </button>
  );

  if (!userData?.assistantName) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>Loading your assistant...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col justify-center items-center gap-4 relative">
      <div className="absolute top-5 right-5 z-50">
        <BiMenuAltRight
          aria-label="Open menu"
          className="text-white w-[30px] h-[30px] cursor-pointer"
          onClick={() => setMenuOpen(true)}
        />
      </div>

    
      <div
        className={`fixed inset-0 bg-[#000000cc] backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-50 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <RxCross1
          aria-label="Close menu"
          className="text-white absolute top-5 right-5 w-[25px] h-[25px] cursor-pointer"
          onClick={() => setMenuOpen(false)}
        />
        <MenuButton text="Logout" onClick={handleLogOut} />
        <MenuButton text="Customize your assistant" onClick={() => {
          setMenuOpen(false);
          navigate("/customize");
        }} />
        <div className="w-full h-[2px] bg-gray-400 my-2" />
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div className="w-full max-w-md h-[400px] overflow-y-auto flex flex-col space-y-4 px-4">
          {userData?.history?.map((his, index) => (
            <span key={index} className="text-gray-400 text-[18px]">{his}</span>
          ))}
        </div>
      </div>

      <div className="w-72 h-96 overflow-hidden rounded-2xl shadow-lg flex justify-center items-center">
        <img
          src={userData?.assistantImage}
          alt={`Assistant ${userData?.assistantName}`}
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-white text-lg font-semibold">
        I am {userData?.assistantName}
      </h1>

      {!aitext && <img src={userImg} alt="User speaking" className="w-[200px]" />}
      {aitext && <img src={aiImg} alt="Assistant responding" className="w-[200px]" />}

      <h1 className="text-white text-[18px] font-semibold text-center px-4">
        {usertext || aitext}
      </h1>
    </div>
  );
}

export default Home;
