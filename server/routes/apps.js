const { Apps, Playlist, File } = require("../models");
const router = require("express").Router({ mergeParams: true });
// const verify = require("./verify");

router.get("/", async (req, res) => {
  // const { appId } = req.params;
  let exclude = ["updatedAt", "createdAt", "user"];

  const playlists = await Playlist.findAll({
    attributes: {exclude: exclude},
    include: [
      {
        model: File,
        attributes: { exclude: exclude, },
        required: false,
        through: { attributes: [] },
      },
    ],
  });

  // if (!app) {
  //   return res.status(203).send({ message: "Invalid application id!" });
  // }

  res.status(200).send({ playlists: playlists });
});

router.get("/download", async (req, res) => {
  const { appId } = req.params;

  const app = await Apps.findOne({ where: { id: appId } });
  res.download(app.link);
});

module.exports = router;
