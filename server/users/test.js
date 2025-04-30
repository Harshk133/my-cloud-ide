// this is the example code here nice 😀
const express = require("express");
const app = express();
    const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic Route
app.get("/",    (req, res) => {
  res.send("Hello, World Programmer!");
});

// Sample API Route
app.get("/api/data", (req, res) => {
  res.json({ message: "This is a JSON response!" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

                                                                                                                                                  