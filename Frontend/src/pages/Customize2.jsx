import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
function Customize2() {
  const {
    userData,
    backendImage,
    selectedImage,
    serverUrl,
    setUserData,
  } = useContext(userDataContext);

  const [assistantName, setAssistantName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (userData?.Assistantname) {
      setAssistantName(userData.Assistantname);
    }
  }, [userData]);

  const handleUpdateAssistant = async () => {
   
    if (loading) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('assistantName', assistantName);

      if (backendImage) {
        formData.append('assistantImage', backendImage);
      } else if (selectedImage) {
        formData.append('imageUrl', selectedImage);
      }

      const { data } = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      setUserData(data);
     
    } catch (err) {
      console.error('Error updating assistant:', err);// TODO: surface toast / error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col items-center justify-center gap-5 p-5">
      <MdKeyboardBackspace  className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]'onClick={()=>navigate("/customize")}/>
      <h1 className="text-white text-3xl text-center mb-8">
        Enter your <span className="text-blue-200">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="eg. Shifra"
        className="w-full max-w-[600px] h-14 rounded-full bg-transparent border-2 border-white px-5 text-white placeholder-gray-300 text-xl outline-none"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />

      {assistantName && (
        <button
          className="min-w-[300px] h-14 mt-8 rounded-full bg-white text-black font-semibold text-lg cursor-pointer disabled:opacity-60"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {loading ? 'Creating…' : 'Finally create your assistant'}
        </button>
      )}
    </div>
  );
}

export default Customize2;
