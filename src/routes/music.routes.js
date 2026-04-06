const express = require("express");
const musicRouter = express.Router();
const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

// Route to upload music
musicRouter.post(
  "/upload",
  authMiddleware.authArtist,
  upload.single("music"),
  musicController.createMusic,
);

// Route to create an album
musicRouter.post(
  "/album",
  authMiddleware.authArtist,
  musicController.createAlbum,
);

// Route to get all musics (for normal users)
musicRouter.get("/", authMiddleware.authUser, musicController.getAllMusics);

// Route to get all albums (for normal users)
musicRouter.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);

// Route to get a specific album by ID (for normal users)
musicRouter.get("/albums/:albumId", authMiddleware.authUser, musicController.getAlbumById);

module.exports = musicRouter;
