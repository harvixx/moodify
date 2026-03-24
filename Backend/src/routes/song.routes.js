const express = require("express");
const { getSongs, getCategories } = require("../controllers/song.controller");
const songRouter = express.Router();
songRouter.post("/getSongs", getSongs);
songRouter.get("/categories", getCategories);
module.exports = songRouter;