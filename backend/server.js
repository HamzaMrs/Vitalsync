const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "1.0.0", service: "vitalsync-api", uptime: process.uptime(), timestamp: new Date() });
});

app.get("/api/activities", (req, res) => {
  res.json([]);
});

app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "Patient Test" }]);
});

app.listen(3000, () => console.log("VitalSync API on :3000"));
