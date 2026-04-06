const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

// Controller to handle music-related operations like creating music
const createMusic = async (req, res) => {
  const { title } = req.body;
  const file = req.file;

  const result = await uploadFile(file.buffer.toString("base64"));

  const newMusic = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Music created successfully",
    music: newMusic,
  });
};

// Controller to handle album-related operations like creating an album
const createAlbum = async (req, res) => {
  const { title, musicIds } = req.body;

  const newAlbum = await albumModel.create({
    title,
    musics: musicIds,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Album created successfully",
    album: newAlbum,
  });
};

// Controller to get all musics (for normal users)
const getAllMusics = async (req, res) => {
  // Populate the artist field with the username of the artist
  const musics = await musicModel
    .find()
    .skip(1)
    .limit(1)
    .populate("artist", "username");
  res.status(200).json({
    message: "Musics retrieved successfully",
    musics,
  });
};

// Controller to get all albums (for normal users)
const getAllAlbums = async (req, res) => {
  const albums = await albumModel
    .find()
    .select("title artist")
    .populate("artist", "username");
  res.status(200).json({
    message: "Albums retrieved successfully",
    albums,
  });
};

// Controller to get a specific album by ID (for normal users)
const getAlbumById = async (req, res) => {
  const { albumId } = req.params;
  const album = await albumModel
    .findById(albumId)
    .populate("musics")
    .populate("artist", "username");
  if (!album) {
    return res.status(404).json({
      message: "Album not found",
    });
  } else {
    res.status(200).json({
      message: "Album retrieved successfully",
      album,
    });
  }
};

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
};
