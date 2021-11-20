import {
  faArrowLeft,
  faArrowRight,
  faHeadphones,
  faMinusCircle,
  faPlusCircle,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FormProvider } from "react-hook-form";
import androidImage from "../images/android.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getPlaylists } from "../Api";
import Button from "./Button";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Input, TextArea, Upload } from "./Fields";
import { useForm } from "react-hook-form";
import { useNewApp } from "../AppContext";
import { generateApplication } from "../Api";
import { useHistory } from "react-router-dom";


const PlayListItem = ({ name, items, onRemove, onAdd }) => {
  return (
    <div className="rounded-md flex justify-around gap-1 border-purple-300 bg-white w-full py-1 px-1 my-2 shadow-sm border-l-2">
      <div className="font-bold text-sm flex-1 ml-4 self-center">{name}</div>
      <div className="flex-1 text-xs self-center">
        {items.length > 0 ? items.length + " Items" : "Empty"}
      </div>
      {onAdd && (
        <div className="px-2 text-gray-500 self-center hover:text-purple-800 cursor-pointer">
          <FontAwesomeIcon icon={faPlusCircle} onClick={onAdd} />
        </div>
      )}
      {onRemove && (
        <div className="px-2 text-gray-500 self-center hover:text-red-800 cursor-pointer">
          <FontAwesomeIcon icon={faMinusCircle} onClick={onRemove} />
        </div>
      )}
    </div>
  );
};

const GeneralAppDataForm = () => {
  const appData = useNewApp();
  const methods = useForm({
    defaultValues: {
      appName: appData.values.appName,
      appDescription: appData.values.appDescription,
      logo: appData.values.logo,
    },
  });
  const onSubmit = (values) => {
    appData.setValue("appName", values.appName);
    appData.setValue("appDescription", values.appDescription);
    appData.setValue("logo", values.logo[0]);
    appData.setValue("step", 2);
  };

  return (
    <FormProvider {...methods}>
      <form className="" onSubmit={methods.handleSubmit(onSubmit)}>
        <div>
          <Input
            label="Application name"
            name="appName"
            id="appName"
            required
            onChange={(e) => appData.setValue("appName", e.target.value)}
          />
        </div>
        <div>
          <TextArea
            label="App description"
            name="appDescription"
            required
            onChange={(e) => appData.setValue("appDescription", e.target.value)}
          ></TextArea>
        </div>
        <div className="mt-6">
          <Upload
            name="logo"
            label="Select a logo for your application"
            required
            accept={[".png"]}
          />
        </div>

        <div className="mt-10">
          <div className="text-center">
            <Button size="xl">
              <span className="px-2">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
              Next : Add media
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const move = (source, destination, droppableSource, droppableDestination) => {
  const srcClone = Array.from(source);
  const dstClone = Array.from(destination);
  const [removed] = srcClone.splice(droppableSource.index, 1);

  dstClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = srcClone;
  result[droppableDestination.droppableId] = dstClone;

  return result;
};

const NewApplication = () => {
  const appData = useNewApp();
  const history = useHistory();

  const [playlist, setPlayList] = useState({
    addedVideos: [],
    addedAudios: [],
    video: [],
    audio: [],
  });

  useEffect(() => {
    appData.setValue("playlists", {
      audio: playlist.addedAudios,
      video: playlist.addedVideos,
    });
  }, [playlist]);

  const moveItem = (source, destination, type) => {
    const res = move(
      getList(source.droppableId),
      getList(destination.droppableId),
      source,
      destination
    );

    if (type == "video") {
      setPlayList((playList) => ({
        ...playList,
        video: res.video,
        addedVideos: res.addedVideos,
      }));
    } else if (type == "audio") {
      setPlayList((playList) => ({
        ...playList,
        audio: res.audio,
        addedAudios: res.addedAudios,
      }));
    }
  };

  const handleGenerateApp = (appData) => {
    let data = new FormData();
    data.append("name", appData.appName);
    data.append("description", appData.Description);
    data.append("audio", appData.playlists.audio.map((a) => a.id).join(","));
    data.append("video", appData.playlists.video.map((v) => v.id).join(","));

    generateApplication(
      data,
      (data) => {
        history.push("/panel/apps")
      },
      (err) => {}
    );
  };

  const reorderItem = (type, playList, sourceIndex, destinationIndex) => {
    if (type === "video") {
      const video = reorder(
        playList.addedVideos,
        sourceIndex,
        destinationIndex
      );
      setPlayList((playList) => ({ ...playList, addedVideos: video }));
    } else if (type === "audio") {
      const audio = reorder(
        playList.addedAudios,
        sourceIndex,
        destinationIndex
      );
      setPlayList((playList) => ({ ...playList, addedAudios: audio }));
    }
  };

  useEffect(() => {
    getPlaylists(
      (data) => {
        setPlayList({
          ...playlist,
          audio: data
            .filter((item) => item.type === "audio")
            .sort((a, b) => a.id - b.id),
          video: data
            .filter((item) => item.type === "video")
            .sort((a, b) => a.id - b.id),
        });
      },
      () => {}
    );
  }, []);

  const getList = (id) => playlist[id];
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "addedVideos") {
        reorderItem(
          "video",
          playlist,
          result.source.index,
          result.destination.index
        );
      } else if (source.droppableId === "addedAudios") {
        reorderItem(
          "audio",
          playlist,
          result.source.index,
          result.destination.index
        );
      } else return;
    } else if (
      (source.droppableId === "video" &&
        destination.droppableId === "addedVideos") ||
      (destination.droppableId === "video" &&
        source.droppableId === "addedVideos")
    ) {
      moveItem(source, destination, "video");
    } else if (
      (source.droppableId === "audio" &&
        destination.droppableId === "addedAudios") ||
      (destination.droppableId === "audio" &&
        source.droppableId === "addedAudios")
    ) {
      moveItem(source, destination, "audio");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <div className="flex justify-between">
          <div className="text-3xl font-medium text-purple-800 ml-5">
            New Application
          </div>
        </div>

        <div className="grid grid-cols-3 pt-6">
          {appData.values.step == 1 && (
            <div className="mt-10 col-span-2">
              <GeneralAppDataForm />
            </div>
          )}
          {appData.values.step == 2 && (
            <div className="col-span-2">
              <div className="justify-around gap-4 grid grid-cols-2 mt-3">
                {[
                  {
                    icon: faVideo,
                    title: "Videos",
                    playList: playlist.video,
                    id: "video",
                  },
                  {
                    icon: faHeadphones,
                    title: "Audios",
                    playList: playlist.audio,
                    id: "audio",
                  },
                ].map((item, index) => (
                  <div className="flex-1" key={index}>
                    <div className="text-lg font-medium text-purple-800">
                      <FontAwesomeIcon icon={item.icon} />
                      <span className="px-2">{item.title}</span>
                    </div>
                    <Droppable droppableId={item.id}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="rounded-md bg-gray-200 p-2"
                        >
                          {item.playList.length == 0 && (
                            <div className="text-center">No items!</div>
                          )}

                          {item.playList &&
                            item.playList.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.title}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                  >
                                    <PlayListItem
                                      name={item.title}
                                      items={item.files}
                                      embedded={item.embedded}
                                      type={item.type}
                                      id={item.id}
                                      onAdd={() => {
                                        if (item.type == "video") {
                                          setPlayList((playList) => ({
                                            ...playList,
                                            video: playList.video.filter(
                                              (elm) => elm.id != item.id
                                            ),
                                            addedVideos: [
                                              ...playList.addedVideos,
                                              item,
                                            ],
                                          }));
                                        } else if (item.type == "audio") {
                                          setPlayList((playList) => ({
                                            ...playList,
                                            audio: playList.audio.filter(
                                              (elm) => elm.id != item.id
                                            ),
                                            addedAudios: [
                                              ...playList.addedAudios,
                                              item,
                                            ],
                                          }));
                                        }
                                      }}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="relative">
            <img src={androidImage} className="w-full absolute z-0" />
            <div className="relative pt-20 w-full px-5 z-10">
              <div className="overflow-x-auto" style={{ maxHeight: 400 }}>
                <div className="text-lg font-medium text-purple-800 text-center">
                  <span className="px-2 uppercase font-bold text-2xl">
                    {appData.values.appName}
                  </span>
                </div>
                <div className="text-center">
                  {appData.values.appDescription}
                </div>
                <div className="rounded-xl p-2 mt-10">
                  <div className="text-sm font-small text-center text-gray-800 bg-gray-300 rounded-t-md py-1">
                    <FontAwesomeIcon icon={faVideo} />
                    <span className="px-2 font-bold ">Video Playlists</span>
                  </div>

                  <Droppable droppableId="addedVideos">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {playlist.addedVideos &&
                          playlist.addedVideos.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.title}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <PlayListItem
                                    name={item.title}
                                    items={item.files}
                                    embedded={item.embedded}
                                    type={item.type}
                                    id={item.id}
                                    onRemove={() => {
                                      setPlayList((playList) => ({
                                        ...playList,
                                        addedVideos:
                                          playList.addedVideos.filter(
                                            (elm) => elm.id != item.id
                                          ),
                                        video: [...playList.video, item],
                                      }));
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}

                        <div className="text-xs text-center p-2  border-t-0 border-gray-300  ">
                          {playlist.addedVideos.length == 0 && (
                            <span>Empty!</span>
                          )}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <div className="text-sm font-small text-center text-gray-800 bg-gray-300 rounded-t-md py-1 mt-4">
                    <FontAwesomeIcon icon={faHeadphones} />
                    <span className="px-2">Audio Playlists</span>
                  </div>

                  <Droppable droppableId="addedAudios">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {playlist.addedAudios &&
                          playlist.addedAudios.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <PlayListItem
                                    name={item.title}
                                    items={item.files}
                                    embedded={item.embedded}
                                    type={item.type}
                                    id={item.id}
                                    onRemove={() => {
                                      setPlayList((playList) => ({
                                        ...playList,
                                        addedAudios:
                                          playList.addedAudios.filter(
                                            (elm) => elm.id != item.id
                                          ),
                                        audio: [...playList.audio, item],
                                      }));
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        <div className="text-xs text-center p-2  border-t-0 border-gray-300  ">
                          {playlist.addedAudios.length == 0 && (
                            <span>Empty!</span>
                          )}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          </div>
        </div>

        {appData.values.step == "2" && (
          <div>
            <div className="flex">
              <Button
                size="xl"
                secondary
                onClick={() => appData.setValue("step", 1)}
              >
                <span className="px-2">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </span>
                Previous Step
              </Button>
              <Button
                size="xl"
                onClick={() => handleGenerateApp(appData.values)}
              >
                <span className="px-2">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
                Generate the App!
              </Button>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default NewApplication;
