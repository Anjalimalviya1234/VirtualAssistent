import React, { useRef, useContext } from "react";
import Card from "../Components/Card";
import { userDataContext } from "../context/UserContext";
import {useNavigate} from "react-router-dom"
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { MdKeyboardBackspace } from "react-icons/md";
import { RiImageAddLine } from "react-icons/ri";

function Customize() {
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

  const inputImage = useRef();
  const navigate = useNavigate()

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setSelectedImage("input"); 
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#020236] flex justify-center items-center flex-col p-[20px] gap-[20px]">
      <MdKeyboardBackspace
  className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]'
  onClick={() => navigate("/")}
/>

      <h1 className="text-white mb-[30px] text-[30px] text-center">
        Select your <span className="text-blue-200">assistant image</span>
      </h1>

      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

     
        <div
          className={`w-[150px] h-[250px] bg-[#030326] border-2 rounded-2xl overflow-hidden
            hover:shadow-2xl hover:shadow-blue-950 cursor-pointer
            hover:border-4 hover:border-white flex items-center justify-center
            ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : "border-[#0000ff66]"}
          `}
          onClick={() => inputImage.current.click()}
        >
          {!frontendImage ? (
            <RiImageAddLine className="text-white w-[25px] h-[25px]" />
          ) : (
            <img
              src={frontendImage}
              className="h-full object-cover w-full"
              alt="Custom"
            />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
  {selectedImage &&  <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold rounded-full text-[19px] bg-white cursor pointer"
  onClick={()=>navigate("/customize2")}>
        Next
      </button> }
     
    </div>
  );
}

export default Customize;
