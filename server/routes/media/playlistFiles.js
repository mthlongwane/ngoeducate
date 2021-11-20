const verify = require("../verify");
const { File, Playlist } = require("../../models");
const { Op } = require("sequelize");
const router = require("express").Router({ mergeParams: true });

/**
 * Add an existing file to a playlist
 */
router.post("/", verify, async (req, res) => {
  let { playlistId } = req.params;
  const { fileId } = req.body;

  const file = await File.findOne({ where: { id: fileId } });
  if (!file) {
    return res.status(203).send({ message: "File not found!" });
  }

  const playlist = await Playlist.findOne({
    where: { id: playlistId },
  });
  if (!playlist) {
    return res.status(203).send({ message: "Playlist not found!" });
  }

  if (file.type != playlist.type) {
    return res
      .status(203)
      .send({ message: "File type doesn't match playlist type!" });
  }

  try {
    await playlist.addFile(file);
  } catch (e) {
    if (e.name == "SequelizeUniqueConstraintError") {
      return res
        .status(203)
        .send({ message: "The file already exists in the playlist!" });
    }
  }

  return res.status(200).send({ message: "File added to the playlist" });
});

router.delete("/:fileId", verify, async (req, res) => {
  const { fileId, playlistId } = req.params;
  let playlist = await Playlist.findOne({ where: { id: playlistId } });
  let file = await File.findOne({ where: { id: fileId } });

  if (!playlist) {
    return res.status(404).send({ message: "Playlist not found" });
  }
  if (!file) {
    return res.status(404).send({ message: "File not found" });
  }
  try {
    await playlist.removeFile(file);

    return res.status(200).send({ message: "File removed from the playlist" });
  } catch (e) {
    return res.status(200).send({ message: "Failed!" });
  }
});

router.get("/", verify, async (req, res) => {
  const playlist = await Playlist.findOne({
    where: { id: req.params.playlistId },
    include: [{ all: true, nested: true }],
  });

  if (!playlist) {
    return res.status(203).send({ message: "Playlist not found!" });
  }

  const availableFiles = await File.findAll({
    where: {
      id: { [Op.notIn]: playlist.files.map((i) => i.id) },
      type: playlist.type,
      user: req.verify.uid,
    },
  });

  return res.status(200).send({
    data: {
      files: playlist.files,
      availableToAdd: availableFiles,
    },
  });
});
module.exports = router;
