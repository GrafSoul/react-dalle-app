import React, { useState } from "react";
import Modal from "./components/Modal";

const App = () => {
  const [images, setImages] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const surpriseOptions = [
    "A blue ostrich eating a melon",
    "A matisse style shark on the telephone",
    "A pineapple sunbathing on the island",
    "A red house with a big flower in the middle",
  ];

  const handleGetImages = async () => {
    setImages([]);

    if (value === "") {
      setError("Error! Must have a search terms!");
      return;
    } else {
      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: value,
          }),
        };

        setError("");

        const response = await fetch("http://localhost:8000/images", options);
        const data = await response.json();
        setImages(data.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSurprise = () => {
    setImages([]);
    setValue(
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    );
  };

  const handleUploadImages = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setSelectedImage(e.target.files[0]);
    setOpenModal(true);
    e.target.value = null;

    try {
      const options = {
        method: "POST",
        body: formData,
      };

      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateVariations = async () => {
    setImages([]);

    if (selectedImage === "") {
      setError("Error! Must have an image!");
      setOpenModal(false);
      return;
    }

    const options = {
      method: "POST",
    };

    try {
      const response = await fetch("http://localhost:8000/variations", options);
      const data = await response.json();

      setImages(data);
      setError("");
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <section className="search-section">
        <p>
          Start with a detailed description{" "}
          <span className="surprise" onClick={handleSurprise}>
            Surprise me
          </span>
        </p>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter prompt..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={handleGetImages}>Generate</button>
        </div>
        <p className="extra-info">
          Or,
          <span>
            <label htmlFor="files"> [upload image] </label>
            <input
              onChange={handleUploadImages}
              type="file"
              id="files"
              accept="image/*"
              hidden
            />
          </span>{" "}
          to edit.
        </p>
      </section>

      {openModal && (
        <div className="overlay">
          <Modal
            setModalOpen={setOpenModal}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
            generateVariations={generateVariations}
          />
        </div>
      )}

      <section className="error-section">{error && <p>{error}</p>}</section>

      <section className="image-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image?.url} alt={`Generated - ${value}`} />
        ))}
      </section>
    </div>
  );
};

export default App;
