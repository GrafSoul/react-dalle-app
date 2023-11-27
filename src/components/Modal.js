import React, { useState, useRef } from "react";

const Modal = ({
  setModalOpen,
  setSelectedImage,
  selectedImage,
  generateVariations,
}) => {
  const [error, setError] = useState(null);

  const imgRef = useRef();

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const checkSize = () => {
    if (imgRef.current.width > 1024 && imgRef.current.height > 1024) {
      setError("The image is too large!\nChoose 1024x1024 image");
    } else {
      generateVariations();
      setError(null);
    }
  };

  return (
    <div className="modal">
      <div className="close-modal" onClick={closeModal}>
        ⓧ
      </div>
      <div className="image-container">
        {selectedImage && (
          <img
            ref={imgRef}
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
          />
        )}
      </div>
      <p>{error || "Image must be 1024x1024 and png format"}</p>
      {!error && <button onClick={checkSize}>Generate</button>}
      {error && <button onClick={closeModal}>Close this and try again</button>}
    </div>
  );
};

export default Modal;
