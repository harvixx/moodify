const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRouter = require("./routes/auth.routes");
const songRouter = require("./routes/song.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);

// Static files
const frontendPath = path.join(__dirname, "../../Frontend/dist");
app.use(express.static(frontendPath));

// React routing
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

module.exports = app;