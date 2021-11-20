const router = require("express").Router();
const verify = require("../verify");
const { Playlist, File, PlaylistFile } = require("../../models");

/**
 * Create playlist
 */
router.post("/", verify, async (req, res) => {
  const { title, type, embedded } = req.body;
  let playlist = await Playlist.findOne({
    where: { title: req.body.title, user: req.verify.uid },
  });
  if (playlist) {
    return res.status(203).send({ message: "Duplicated playlist title!" });
  }

  const newPlaylist = await Playlist.create({
    user: req.verify.uid,
    title: title,
    type: type,
    embedded: embedded,
  });
  return res
    .status(200)
    .send({ message: "Playlist created successfully!", data: newPlaylist });
});

/**
 * Edit a playlist
 */
router.put("/:id", verify, async (req, res) => {
  const { title, embedded } = req.body;
  const { id } = req.params;
  let playlist = await Playlist.findOne({ where: { id: id } });

  playlist = { ...playlist, title: title, embedded: embedded };

  let newPlaylist = await Playlist.update(
    { title: title, embedded: embedded },
    {
      where: { user: req.verify.uid, id: req.params.id },
      returning: true,
    }
  );

  return res
    .status(200)
    .send({ message: "Playlist updated successfully!", data: newPlaylist[1] });
});


router.delete("/:id", async (req, res) => {
  await Playlist.destroy({ where: { id: req.params.id } }).then(
    async (count) => {
      if (!count) {
        return res.status(200).send({ message: "Playlist doesn't exist!" });
      }

      await PlaylistFile.destroy({ where: { playlistID: req.params.id } });
      return res.status(200).send({ message: "Playlist deleted sucessfully!" });
    }
  );
});

router.get("/", verify, async (req, res) => {
  const playlists = await Playlist.findAll({
    where: { user: req.verify.uid },
    include: [File],
  });

  if (playlists) {
    return res.status(200).send({ data: playlists });
  } else return res.status(203).send({ message: "No playlists found!" });
});

router.get("/:id", verify, async (req, res) => {
  const playlist = await Playlist.findOne({
    where: { id: req.params.id, user: req.verify.uid },
  });

  if (playlist) {
    return res.status(200).send(playlist);
  }

  return res.status(203).send({ message: "Playlist doesn't exist" });
});

module.exports = router;
