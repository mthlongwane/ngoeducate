import {
  faHeadphones,
  faPlay,
  faPlus,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "./Button";
import videoLogo from "../images/icon/video.png";
import audioLogo from "../images/icon/audio.png";
import {
  addFileToPlaylist,
  getPlayListFiles,
  removePlayListFiles,
} from "../Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPlayer from "react-player";

const ContentItem = ({
  name,
  type,
  path,
  fileId,
  playListID,
  selected,
  onAdd,
  onRemove,
}) => {
  const [play, setPlay] = useState(false);

  const handleAddToPlaylist = (callback) => {
    addFileToPlaylist(
      playListID,
      fileId,
      (data) => {
        onAdd(data);
      },
      (error) => {}
    );
  };

  const handleRemoveFromPlaylist = () => {
    removePlayListFiles(
      playListID,
      fileId,
      (data) => {
        onRemove(data);
      },
      (error) => {}
    );
  };

  if (play && type === "video")
    return (
      <div className="rounded-md flex text-center border-purple-300 bg-white shadow-sm border-b-2">
        <ReactPlayer
          url={`${process.env.REACT_APP_BASE_URL}/${path}`}
          controls
          playing
          height={150}
          onPause={() => setPlay(false)}
          onEnded={() => setPlay(false)}
        />
      </div>
    );
  return (
    <div
      className={
        selected
          ? "rounded-md text-center border-purple-700 bg-white py-2 px-2 my-2 shadow-sm border-b-2"
          : "rounded-md text-center border-purple-300 bg-white py-2 px-2 my-2 shadow-sm border-b-2"
      }
    >
      <img
        className="rounded-md m-auto"
        style={{ width: 32 }}
        src={type === "video" ? videoLogo : audioLogo}
      />

      <div className="font-bold">{name}</div>

      {!(type === "audio" && play) ? (
        <div className="justify-around flex">
          <Button icon={faPlay} secondary noBg onClick={() => setPlay(true)} />

          {onRemove && (
            <Button
              secondary
              noBg
              onClick={handleRemoveFromPlaylist}
              callback={onAdd}
            >
              Remove
            </Button>
          )}

          {onAdd && (
            <Button
              secondary
              noBg
              onClick={handleAddToPlaylist}
              callback={onAdd}
            >
              Add to playlist
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md flex text-center justify-items-center">
          <ReactPlayer
            url={`${process.env.REACT_APP_BASE_URL}/${path}`}
            controls
            playing
            onEnded={() => setPlay(false)}
            height={31}
            onPause={() => setPlay(false)}
          />
        </div>
      )}
    </div>
  );
};

const AddPlayListFiles = () => {
  const { playList, type, id } = useParams();
  const [availableFilesToAdd, setAvailableFilesToAdd] = useState();
  const [playlistFiles, setPlaylistFiles] = useState();

  const fetchPlaylistFiles = () => {
    getPlayListFiles(
      id,
      (data) => {
        setPlaylistFiles(data.files);
        setAvailableFilesToAdd(data.availableToAdd);
      },
      () => {}
    );
  };
  useEffect(() => {
    fetchPlaylistFiles();
  }, []);

  return (
    <div>
      <div className="text-2xl font-medium text-purple-800 text-center">
        <span>Manage Playlist files: </span>
        <span className="font-bold">{playList}</span>
      </div>

      <div className="mt-10 bg-white p-4">
        {playlistFiles && playlistFiles.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {playlistFiles.map((item) => (
              <ContentItem
                key={item.id}
                name={item.title}
                type={type}
                path={item.path}
                fileId={item.id}
                playListID={id}
                onRemove={fetchPlaylistFiles}
              />
            ))}
          </div>
        ) : (
          <div className="text-xl text-gray-600 text-center">
            Playlist is empty!
            <div>Add files from the list below.</div>
          </div>
        )}
      </div>
      <div className="mt-10 ">
        <div className="text-lg font-medium text-purple-800">
          <FontAwesomeIcon icon={type === "audio" ? faHeadphones : faVideo} />
          <span className="px-2">
            {`Available ${type === "audio" ? "Audios " : "Videos"} `}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {availableFilesToAdd && availableFilesToAdd.length > 0 ? (
            availableFilesToAdd.map((item) => (
              <ContentItem
                key={item.id}
                name={item.title}
                type={type}
                path={item.path}
                fileId={item.id}
                playListID={id}
                onAdd={fetchPlaylistFiles}
              />
            ))
          ) : (
            <div className="text-lg">---</div>
          )}
        </div>
        <div className="flex mt-5">
          <Button icon={faPlus} to="/panel/media/new">
            Upload New File
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AddPlayListFiles;
