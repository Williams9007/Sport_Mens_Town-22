import express from "express";
import fs from "fs";

const app = express();
const PORT = 5000;

app.get("/api/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json"));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
