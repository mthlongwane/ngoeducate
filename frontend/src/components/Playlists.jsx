import {
  faCloudDownloadAlt,
  faEdit,
  faHeadphones,
  faPlus,
  faPlusCircle,
  faTrash,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { editPlayList, getPlaylists, removePlayList } from "../Api";
import Button from "./Button";
import { CheckBox, Input } from "./Fields";
import { FormProvider, useForm } from "react-hook-form";
import Alert from "./Alert";

const PlaylistItem = ({ name, items, embedded, callback, id, type }) => {
  const methods = useForm();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onRemove = () => {
    removePlayList(
      id,
      (s) => {
        callback({
          type: "Success",
          msg: s,
          id: id,
          contentType: type,
          callbackType: "remove",
        });
        setConfirmRemove(false);
      },
      (e) => {
        callback({ type: "Error", msg: e });
        setConfirmRemove(false);
      }
    );
  };
  const startEdit = () => {
    setEdit(true);
    methods.setValue("title", name);
    methods.setValue("embedded", embedded);
  };
  const onEdit = ({ title, embedded }) => {
    if (title) {
      editPlayList(
        id,
        { title: title, embedded: embedded },
        (s) => {
          callback({
            type: "Success",
            msg: s,
            id: id,
            contentType: type,
            callbackType: "edit",
            newName: title,
            embedded: embedded,
          });
          setEdit(false);
        },
        (e) => {
          callback({ type: "Error", msg: e });
        }
      );
    } else setEdit(false);
  };
  if (confirmRemove)
    return (
      <div className="rounded-md flex justify-around gap-6 border-purple-300 bg-white w-full py-4 px-2 my-2 shadow-sm border-l-2">
        <div className="font-bold">
          Are you sure you want to delete this playList?
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
  if (edit)
    return (
      <div className="rounded-md gap-6 border-purple-300 bg-white w-full py-1 px-2 my-2 shadow-sm border-l-2">
        <FormProvider {...methods}>
          <form
            className="flex justify-around"
            onSubmit={methods.handleSubmit(onEdit)}
          >
            <div className="flex ml-4">
              <Input label="Title" name="title" id="title" row="flex" />
              <CheckBox label="Embedded" name="embedded" id="embedded" />
            </div>
            <div className="m-auto flex mr-4">
              <Button isloding={isLoading}>
                Save Changes
              </Button>
              <Button
                isloding={isLoading}
                secondary
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  return (
    <div className="rounded-md flex items-center justify-around gap-6 border-purple-300 bg-white w-full py-4 px-2 my-2 shadow-sm border-l-2">
      <div className="font-bold flex-1 ml-4">
        {name}
        {!embedded && (
          <FontAwesomeIcon icon={faCloudDownloadAlt} className="ml-1" />
        )}
      </div>
      <div className="">{items > 0 ? items + " Items" : "Empty"}</div>
      <Button
        secondary
        icon={faPlusCircle}
        to={"/panel/playlists/editfile/" + type + "/" + name + "/" + id}
      >
        files
      </Button>
      <Button icon={faEdit} secondary noBg onClick={startEdit}>
        Edit
      </Button>
      <Button
        icon={faTrash}
        secondary
        noBg
        onClick={() => setConfirmRemove(true)}
      ></Button>
    </div>
  );
};

const Playlist = () => {
  const [audioPlayList, setAudioPlayList] = useState();
  const [videoPlayList, setVideoPlayList] = useState();
  const [msg, setMSG] = useState({ type: "", msg: "" });
  const callbackItem = (values) => {
    setMSG({ type: values.type, msg: values.msg });
    if (values.type === "Success" && values.callbackType === "remove") {
      if (values.contentType === "audio") {
        setAudioPlayList(audioPlayList.filter((item) => item.id != values.id));
      }
      if (values.contentType === "video") {
        setVideoPlayList(videoPlayList.filter((item) => item.id != values.id));
      }
    }

    if (values.type === "Success" && values.callbackType === "edit") {
      if (values.contentType === "audio") {
        let p = audioPlayList.filter((item) => item.id === values.id)[0];
        p.title = values.newName;
        p.embedded = values.embedded;
        const old = audioPlayList.filter((item) => item.id != values.id);
        old.push(p);

        old.sort((a, b) => a.id - b.id);
        setAudioPlayList(old);
      }
      if (values.contentType === "video") {
        let p = videoPlayList.filter((item) => item.id === values.id)[0];
        p.title = values.newName;
        p.embedded = values.embedded;
        const old = videoPlayList.filter((item) => item.id != values.id);
        old.push(p);
        old.sort((a, b) => a.id - b.id);
        setVideoPlayList(old);
      }
    }
  };
  useEffect(() => {
    getPlaylists(
      (data) => {
        setVideoPlayList(
          data
            .filter((item) => item.type === "video")
            .sort((a, b) => a.id - b.id)
        );
        setAudioPlayList(
          data
            .filter((item) => item.type === "audio")
            .sort((a, b) => a.id - b.id)
        );
      },
      () => {}
    );
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        <div className="text-3xl font-medium text-purple-800 ml-5">
          Playlists
        </div>
        <div className="flex">
          <div>
            <Button icon={faPlus} to="/panel/playlists/new/video">
              Video Playlist
            </Button>
          </div>
          <div>
            <Button icon={faPlus} to="/panel/playlists/new/audio">
              Audio Playlist
            </Button>
          </div>
        </div>
      </div>
      {msg.type && (
        <div className="ml-5 mr-2">
          <Alert type={msg.type} message={msg.msg} />
        </div>
      )}

      <div className="mt-10">
        <div className="text-lg font-medium text-purple-800">
          <FontAwesomeIcon icon={faHeadphones} />
          <span className="px-2">Audio Playlists</span>
        </div>
        <div>
          {audioPlayList && audioPlayList.length > 0 ? (
            audioPlayList.map((item) => (
              <PlaylistItem
                key={item.id}
                name={item.title}
                items={item.files.length}
                embedded={item.embedded}
                type={item.type}
                id={item.id}
                callback={callbackItem}
              />
            ))
          ) : (
            <div className="text-lg">No audio playlist found!</div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <div className="text-lg font-medium text-purple-800">
          <FontAwesomeIcon icon={faVideo} />
          <span className="px-2">Video Playlists</span>
        </div>

        <div>
          {videoPlayList && videoPlayList.length > 0 ? (
            videoPlayList.map((item) => (
              <PlaylistItem
                key={item.id}
                name={item.title}
                items={item.files.length}
                embedded={item.embedded}
                type={item.type}
                id={item.id}
                callback={callbackItem}
              />
            ))
          ) : (
            <div className="text-lg">No video playlist found!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
