const express = require("express");
const app = express();
const fileupload = require("express-fileupload");
const server = require("http").createServer(app);
const cors = require("cors");
const { syncDB } = require("./models");

global.tokenSecret = "da39a3ee5e6b4b0d3255bfef95601890afd80709";
global.directory = __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));

const authRoute = require("./routes/auth");
const playListRoute = require("./routes/media/playlist");
const filesRoute = require("./routes/media/files");
const playListFilesRoute = require("./routes/media/playlistFiles");
const mediaLoad = require("./routes/media/load");
const generator = require("./routes/generate");
const apps = require("./routes/apps");

app.use("/auth", authRoute);
app.use("/playlist", playListRoute);
app.use("/files", filesRoute);

app.use("/playlist/:playlistId/files", playListFilesRoute);
app.use("/media", mediaLoad);
app.use("/applications", generator);

app.use("/apps/:appId", apps);

const port = 4000;
server.listen(port, async () => {
  syncDB();
  console.log(`Server is running on port: ${port}`);
});
