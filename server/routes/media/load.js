const router = require("express").Router();

router.get("/:path/:type/:fileName", async (req, res) => {
  const { path, type, fileName } = req.params;
  var filePath = `${directory}/media/${path}/${type}/${fileName}`;
  return res.sendFile(filePath);
});
module.exports = router;
