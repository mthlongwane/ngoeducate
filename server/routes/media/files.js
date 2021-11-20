const verify = require("../verify");
const router = require("express").Router();
const { File, PlaylistFile } = require("../../models");
const fs = require("fs");
const cmd = require("node-cmd");
const { v1: uuidv1 } = require("uuid");

router.post("/upload", verify, async (req, res) => {
  if (req.files == undefined)
    return res.status(203).send({
      message: "File undefined",
    });

  const file = req.files.file;
  let type = file.mimetype.split("/")[0];
  let ext = file.name.split(".");
  ext = ext[ext.length - 1];
  const dir = `${directory}/media/${req.verify.uid}/${type}`;

  let { title } = req.body;
  let fileName = `${type}_${uuidv1()}.${ext}`.replaceAll("-", "_");

  cmd.runSync("mkdir -p " + dir);
  let path = `${dir}/${fileName}`;
  var pathUrl = `media/${req.verify.uid}/${type}/${fileName}`;

  file.mv(path, async (err) => {
    if (err) {
      return res.status(203).send({
        message: "File upload failed",
      });
    }

    let newFile = await File.create({
      user: req.verify.uid,
      fileName: fileName,
      title: title,
      path: pathUrl.toString(),
      type: type,
    });

    return res.status(200).send({
      message: "File Uploaded successfully!",
      data: newFile,
    });
  });
});

router.delete("/:id", verify, async (req, res) => {
  const { id } = req.params;
  const file = await File.findOne({ where: { id: id } });

  const playlists = await file.getPlaylists();
  if (playlists.length > 0) {
    return res.status(203).send({
      message: `To delete this file, first remove it from the playlist(s) ${playlists.map(
        (p) => (p.title)
      )}`,
    });
  }

  if (file) {
    fs.unlink(directory + file.path, async (err) => {
      if (err) {
        console.log(err);
        return res.status(203).send({ message: "Delete File Error" });
      }

      await Files.destroy({ where: { id: id } });
      return res.status(200).send({ message: "File Deleted" });
    });
  }

  return res.status(203).send({ message: "File doesn't exist" });
});

router.put("/:id", verify, async (req, res) => {
  const id = req.params.id;

  if (await File.findOne({ where: { fileName: req.body.fileName } })) {
    return res.status(203).send({
      message: "File name exists.",
    });
  }

  const file = await File.findOne({
    where: { id: id },
  });

  const oldPath = file.path;

  let oldFileName = file.fileName;
  const newPathURL = oldPath.replace(oldFileName, req.body.fileName);
  fs.rename(directory + oldPath, directory + newPathURL, async (err) => {
    if (err) {
      return res
        .status(203)
        .send({ message: "Error in changing the file name!" });
    }

    await Files.update(
      {
        title: req.body.title,
        path: newPathURL.toString(),
      },
      {
        where: { user: req.verify.uid, id: req.params.id },
      }
    );

    return res.status(200).send({ message: "File name changed successfully!" });
  });
});

router.get("/", verify, async (req, res) => {
  const { type } = req.query;

  let conditions = { user: req.verify.uid };
  if (type) {
    conditions = { ...conditions, type: type };
  }
  const files = await File.findAll({ where: conditions });

  if (files) {
    return res.status(200).send({ data: files });
  }

  return res.status(404).send({ message: "No file found" });
});

router.get("/:id", verify, async (req, res) => {
  const { id } = req.params;

  const file = await Files.findOne({
    where: { id: id, user: req.verify.uid },
  });

  if (file) {
    return res.status(200).send(file);
  }

  return res.status(203).send({ message: "No file found!" });
});

module.exports = router;
