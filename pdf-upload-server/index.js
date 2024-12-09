const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

// Initialize Express App
const app = express();
const PORT = 5080;

// Enable CORS
app.use(cors());
app.use(express.static("uploads"));

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to Upload PDF
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileURL = `http://localhost:${PORT}/${req.file.filename}`;
  res.json({ fileURL });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
