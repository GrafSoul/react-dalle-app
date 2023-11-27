/* eslint-disable no-unused-vars */
const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const multer = require("multer");

const OpenAI = require("openai");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const PORT = 8000;

const API_KEY = process.env.OPEN_AI_API_KEY;

const configuration = {
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
};

const openai = new OpenAI(configuration);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
    console.log("File - ", file);
  },
});

const upload = multer({ storage: storage }).single("file");
let filePath;

app.post("/images", async (req, res) => {
  try {
    const images = await openai.images.generate({
      model: "dall-e-2",
      prompt: req.body.prompt,
      n: 4,
      size: "1024x1024",
    });
    req.body.data = images.data;
    res.send(images);
  } catch (error) {
    console.error(error);
  }
});

app.post("/upload", async (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    filePath = req.file.path;
    res.status(200).send({ filePath: req.file.path });
  });
});

app.post("/variations", async (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const fileStream = fs.createReadStream(filePath);

  try {
    const response = await openai.images.createVariation({
      image: fileStream,
      model: "dall-e-2",
      n: 4,
      size: "1024x1024",
    });

    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
