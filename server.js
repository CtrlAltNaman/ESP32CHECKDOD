const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();


// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection (replace `<your_connection_string>` with your MongoDB URI)
mongoose.connect("mongodb+srv://HardWired:SIHT12345@esp32webserver.16amw.mongodb.net/?retryWrites=true&w=majority&appName=ESP32WEBSERVER", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema for storing ESP32 data
const dataSchema = new mongoose.Schema({
  frequency: Number,
  timestamp: { type: Date, default: Date.now },
});

const Data = mongoose.model("Data", dataSchema);

// Route to receive data from ESP32
app.post("/data", async (req, res) => {
  const { frequency } = req.body;

  if (!frequency) {
    return res.status(400).send("Frequency value is required");
  }

  try {
    await Data.create({ frequency });
    res.status(200).send("Data stored successfully");
  } catch (error) {
    res.status(500).send("Error storing data");
  }
});

// Route to get all data (for visualization or debugging)
app.get("/data", async (req, res) => {
  try {
    const data = await Data.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).send("Error retrieving data");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;  // Use the port assigned by Render
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});