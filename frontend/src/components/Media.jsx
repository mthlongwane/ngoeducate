import {
  faCheck,
  faEdit,
  faHeadphones,
  faPlay,
  faPlus,
  faTrash,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { editFile, getFiles, removeFile } from "../Api";
import { Input } from "./Fields";
import Alert from "./Alert";
import Button from "./Button";
import ReactPlayer from "react-player";
import { FormProvider, useForm } from "react-hook-form";
import videoImage from "../images/icon/video.png";
import audioImage from "../images/icon/audio.png";

const ContentItem = ({ name, type, path, id, callback, onRemoveFile }) => {
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [play, setPlay] = useState(false);
  const [edit, setEdit] = useState(false);
  const methods = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onRemove = () => {
    removeFile(
      id,
      (s) => {
        onRemoveFile()
        setConfirmRemove(false);
      },
      (e) => {
        setConfirmRemove(false);
      }
    );
  };
  const startEdit = () => {
    methods.setValue("title", name);
    setEdit(true);
  };
  const onChangeName = ({ title }) => {
    if (title && title != name) {
      editFile(
        id,
        { title: title },
        (s) => {
          callback({
            type: "Success",
            msg: s,
            id: id,
            contentType: type,
            callbackType: "changeName",
            newName: title,
          });
          setEdit(false);
        },
        (e) => {
          callback({ type: "Error", msg: e });
        }
      );
    } else setEdit(false);
  };

  if (play && type === "video")
    return (
      <div className="rounded-md flex text-center justify-items-center border-purple-300 bg-white shadow-sm border-b-2">
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
  if (confirmRemove)
    return (
      <div className="rounded-md justify-items-center text-center border-purple-300 bg-white py-3 px-2 my-2 shadow-sm border-b-2">
        <div className="font-bold">
          Are you sure you want to delete this file?
        </div>
        <div className="justify-around flex">
          <Button secondary noBg onClick={onRemove}>
            Yes
          </Button>
          <Button secondary onClick={() => setConfirmRemove(false)}>
            cancel
          </Button>
        </div>
      </div>
    );
  return (
    <div className="rounded-md text-center border-purple-300 bg-white py-2 px-2 my-2 shadow-sm border-b-2">
      <img
        className="rounded-md m-auto"
        style={{ width: 32 }}
        src={type === "video" ? videoImage : audioImage}
      />
      {!edit ? (
        <div className="font-bold">{name}</div>
      ) : (
        <FormProvider {...methods}>
          <form className="flex" onSubmit={methods.handleSubmit(onChangeName)}>
            <Input name="title" id="title" />
            <div className="text-center m-auto inline-block">
              <Button
                icon={faCheck}
                isloding={isLoading}
                noBg
                secondary
              ></Button>
            </div>
          </form>
        </FormProvider>
      )}
      {!(type === "audio" && play) ? (
        !edit && (
          <div className="justify-around flex">
            <Button
              icon={faPlay}
              secondary
              noBg
              onClick={() => setPlay(true)}
            />
            <Button icon={faEdit} secondary noBg onClick={startEdit} />
            <Button
              icon={faTrash}
              secondary
              noBg
              onClick={() => setConfirmRemove(true)}
            />
          </div>
        )
      ) : (
        <div className="rounded-md flex text-center justify-items-center">
          <ReactPlayer
            url={`${process.env.REACT_APP_BASE_URL}${path}`}
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

const Media = () => {
  const [files, setFiles] = useState({});
  const [msg, setMSG] = useState({ type: "", msg: "" });

  const fetchFiles = () => {
    ["video", "audio"].forEach((fileType) => {
      getFiles(fileType, (data) => {
        setFiles((files) => ({ ...files, [fileType]: data }));
      });
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-3xl font-medium text-purple-800 ml-5">Media</div>

        <div className="flex">
          <div>
            <Button icon={faPlus} to="/panel/media/new">
              Upload new File
            </Button>
          </div>
        </div>
      </div>
      {msg.type && (
        <div className="ml-5 mr-2">
          <Alert type={msg.type} message={msg.msg} />
        </div>
      )}
      <div className="mt-10 ">
        <div className="text-lg font-medium text-purple-800">
          <FontAwesomeIcon icon={faHeadphones} />
          <span className="px-2">Audio</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {files.audio && files.audio.length > 0 ? (
            files.audio.map((item) => (
              <ContentItem
                key={item.id}
                name={item.title}
                type={item.type}
                path={item.path}
                id={item.id}
                onRemoveFile={fetchFiles}
              />
            ))
          ) : (
            <div className="text-lg">No Audio Content</div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <div className="text-lg font-medium text-purple-800">
          <FontAwesomeIcon icon={faVideo} />
          <span className="px-2">Video</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {files.video && files.video.length > 0 ? (
            files.video.map((item) => (
              <ContentItem
                key={item.id}
                name={item.title}
                type={item.type}
                path={item.path}
                id={item.id}
              />
            ))
          ) : (
            <div className="text-lg">No Video Content</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Media;
