
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";


export const userDataContext = createContext();

function UserContext({ children }) {

  const serverUrl = "http://localhost:8000";

  
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);


  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current user:", result.data);
    } catch (error) {
      console.log("Current‑user fetch error:", error);
    }
  };

  
  const getGemini = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoAssistent`, // ← ek hi slash
        { command },
        { withCredentials: true }
      );
    
      return result.data;
    } catch (error) {
      console.log("Gemini error:", error);
      return null; 
    }
  };


  useEffect(() => {
    handleCurrentUser();
  }, []);

 
  return (
    <userDataContext.Provider
      value={{
        serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        getGemini,
      }}
    >
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
