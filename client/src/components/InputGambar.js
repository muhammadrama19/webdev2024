import React, { useRef } from "react";
import "../styles/inputGambar.css";

const InputGambar = ({ onImageChange }) => {
  const imgRef = useRef(null);
  const iconRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (imgRef.current) {
          imgRef.current.src = e.target.result;
          imgRef.current.style.display = "block";
        }
        if (iconRef.current) {
          iconRef.current.style.display = "none";
        }
        if (containerRef.current) {
          containerRef.current.style.border = "none";
        }
        if (textRef.current) {
          textRef.current.style.display = "none";  // Sembunyikan teks setelah gambar diupload
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-container">
      <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          ></link>
      <div className="camera-icon" ref={containerRef}>
        <img ref={imgRef} src="#" alt="Img Preview" style={{ display: "none" }} />
        <i className="fa fa-camera" ref={iconRef}></i>
        <span ref={textRef} className="upload-text">Upload Image Here</span>
      </div>
      <div className="file-input-container">
        <input type="file" id="file-upload" onChange={handleImageChange} />
      </div>
    </div>
  );
};

export default InputGambar;