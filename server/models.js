const { Model, DataTypes, Sequelize } = require("sequelize");
const databaseConfig = require("./database/config/config");
const path = require("path");

class File extends Model {}
class Playlist extends Model {}
class User extends Model {}
class Apps extends Model {}

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  databaseConfig
);

const PlaylistFile = sequelize.define(
  "playlist_files",
  {},
  { timestamps: false }
);

const AppPlaylist = sequelize.define(
  "app_playlists",
  {},
  { timestamps: false }
);

Apps.init(
  {
    user: DataTypes.STRING,
    appName: DataTypes.STRING,
    link: DataTypes.STRING,
    status: DataTypes.STRING,
  },
  { sequelize, modelName: "apps" }
);

File.init(
  {
    user: DataTypes.STRING,
    fileName: DataTypes.STRING,
    title: DataTypes.STRING,
    path: DataTypes.STRING,
    type: DataTypes.STRING,
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${process.env.BASE_URL}/${this.path}`;
      },
    },
  },
  { sequelize, modelName: "files" }
);

Playlist.init(
  {
    user: DataTypes.STRING,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    embedded: DataTypes.BOOLEAN,
  },
  { sequelize, modelName: "playlist" }
);

User.init(
  {
    uid: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    countryCode: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

File.belongsToMany(Playlist, { through: "PlaylistFile" });
Playlist.belongsToMany(File, { through: "PlaylistFile" });
Playlist.belongsToMany(Apps, { through: "AppPlaylist" });

const syncDB = () => {
  sequelize.sync({});
};

module.exports = {
  sequelize: sequelize,
  User,
  Playlist,
  File,
  Apps,
  PlaylistFile,
  syncDB,
};
