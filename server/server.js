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

const upload = multer({ storage: storage }).single("files");

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
    console.log(req.file);
  });

  // try {
  //   const images = await openai.images.generate({
  //     model: "dall-e-2",
  //     prompt: req.body.prompt,
  //     n: 4,
  //     size: "1024x1024",
  //   });
  //   req.body.data = images.data;
  //   res.send(images);
  // } catch (error) {
  //   console.error(error);
  // }
});

// app.post("/completions", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "gpt-3.5-turbo",
//       max_tokens: 100,
//       messages: [
//         {
//           role: "user",
//           content: req.body.message,
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options
//     );
//     const data = await response.json();
//     res.send(data);
//   } catch (error) {
//     console.log(error);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
