const verify = require("./verify");
const cmd = require("node-cmd");
const router = require("express").Router();
const fs = require("fs");
const { Playlist, Apps, File } = require("../models");
const { default: axios } = require("axios");
const keyPassword = process.env.KEY_PASSWORD;
const keystorePassword = process.env.KEYSTORE_PASSWORD;
const keyAlias = process.env.KEY_ALIAS;
const FormData = require("form-data");

const runSync = (command) => {
  if (typeof command == "string") {
    command = [command];
  }
  console.log(`Executing: ${command.join(" ")}\n----------\n`);
  return cmd.runSync(command.join(" "));
};

router.get("/", verify, async (req, res) => {
  const apps = await Apps.findAll({
    where: { user: req.verify.uid },
    order: [["id", "DESC"]],
  });
  res.status(200).send({ data: apps });
});

const updateAppBuildStatus = async (appLink, uid, status) => {
  await Apps.update(
    {
      link: appLink,
      status: status,
    },
    {
      where: { user: uid, status: "building" },
    }
  );
};

const processPlaylists = async ({ audio, video }, resourcesDir) => {
  let playlistIds = [...audio.split(","), ...video.split(",")].filter(
    (item) => item.length > 0
  );
  let exclude = ["updatedAt", "createdAt", "user"];
  let playlists = await Playlist.findAll({
    where: { id: playlistIds },
    attributes: { exclude: exclude },
    include: [
      {
        model: File,
        attributes: { exclude: exclude },
        required: false,
        through: { attributes: [] },
      },
    ],
  });

  playlists.forEach((playlist) => {
    playlist.files.forEach((file) => {
      fs.copyFileSync(
        `${directory}/${file.path}`,
        `${resourcesDir}/${file.fileName}`
      );
      console.log(`Copied ${file.path} to ${resourcesDir}/${file.fileName}`);
    });
  });

  console.log(playlists);
  return playlists;
};

router.post("/", verify, async (req, res) => {
  const uid = req.verify.uid;
  const appPath = `${process.env.APP_BUILDS_PATH}/${uid}`;
  const buildPath = `${appPath}/source`;
  const resourcesDir = `${buildPath}/android/app/src/main/res/raw`;
  const logo = req?.files?.logo;
  const { name, video, audio, description } = req.body;

  let packagename = "com.ngo." + name.toLowerCase().replace(/[^a-z]/g, "");

  runSync(`rm -rf ${buildPath}/`);
  runSync(`mkdir -p ${buildPath}`);
  runSync(`mkdir -p ${resourcesDir}`);

  const commands = {
    extractSource: [`tar xf ${process.env.APPSOURCE_PATH} -C ${buildPath}`],
    tar: ["tar", "czf", `${appPath}/app-modified.tar.gz`, "-C", buildPath, "."],
    keygen: [
      "keytool -genkey -v -storetype JKS -keyalg RSA -keysize 2048 -validity 1000",
      `-keypass ${keyPassword}`,
      `-alias ${keyAlias}`,
      `-storepass ${keystorePassword}`,
      `-keystore ${buildPath}/release.keystore`,
      `-dname "CN=com.expo.your.android.package,OU=,O=,L=,S=,C=US"`,
    ].join(" "),
    rename: ["npx", `react-native-rename '${name}'`, "-b", packagename],
  };

  const { err } = runSync(commands.extractSource);
  if (err) {
    console.log(err);
    return res.status(203).send({
      message: "Extracting the source app failed!",
    });
  }

  const logoPath = buildPath + "/assets/logo.png";
  if (logo) {
    logo.mv(logoPath, async (err) => {
      if (err) {
        runSync(`rm -r ${buildPath}`);
        res.status(203).send({
          message: "Logo upload failed!",
        });
      }
    });
  }

  const app = await Apps.create({
    user: uid,
    appName: name,
    link: "",
    status: "building",
  });

  res.status(200).send({
    message: "App is in the building queue. This takes a few minutes...",
  });

  let playlists = await processPlaylists({ audio, video }, resourcesDir);

  let appconfigJSON = JSON.stringify({
    appName: name,
    appDescription: description,
    serverURL: process.env.BASE_URL,
  });

  let appconfig = `const config=${appconfigJSON}; export default config`;
  fs.writeFileSync(`${buildPath}/appconfig.js`, appconfig, null, 2);
  fs.writeFileSync(
    `${resourcesDir}/playlist.json`,
    JSON.stringify(playlists, null, 2)
  );

  if (!fs.existsSync(`${buildPath}/release.keystore`)) {
    console.log("keystore file not found... Generating a new one!");
    runSync(commands.keygen);
  }

  runSync(commands.rename);
  runSync(commands.tar);

  console.log(`Building...`);
  req.next();
  const form = new FormData();
  form.append("file", fs.createReadStream(appPath + "/app-modified.tar.gz"));

  const request_config = {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
      ...form.getHeaders(),
    },
  };

  axios
    .post("http://apkbuilder:5000", form, {
      ...request_config,
      responseType: "stream",
    })
    .then((res) => {
      const savePath = `${appPath}/${name}-${app.id}.apk`;
      res.data.pipe(fs.createWriteStream(savePath));
      updateAppBuildStatus(savePath, uid, "finished");
    })
    .catch((error) => {
      console.error("Build failed");
      updateAppBuildStatus(null, uid, "error");
    });
});

module.exports = router;
