import React, { useContext } from 'react'
import { userDataContext } from "../context/UserContext";
function Card({ image }) {
   const {
       serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
    } = useContext(userDataContext);
  
  return (
    <div className={`w-[150px] h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-950 ":null}`}
    onClick={()=>{setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
    }}>
      <img src={image} className='h-full object-cover w-full' />
    </div>
  )
}

export default Card;
