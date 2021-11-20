import { FormProvider, useForm } from "react-hook-form";
import { Redirect, useParams } from "react-router-dom";
import { CheckBox, Input } from "./Fields";
import Button from "./Button";
import { addPlayList } from "../Api";
import { useState } from "react";
import Alert from "./Alert";

const AddPlayList = ({}) => {
  const methods = useForm();
  const { playListType } = useParams();
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const onSubmit = ({ title, embedded }) => {
    setMessage();
    setIsLoading(true);
    addPlayList(
      { title: title, type: playListType, embedded: embedded },
      (s) => {
        setRedirect("/panel/playlists");
        setIsLoading(false);
      },
      (err) => {
        setMessage(err);
        setIsLoading(false);
        if (err === undefined) setMessage("Please Check your connection!");
      }
    );
  };
  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className="flex mt-20">
      <div className="m-auto text-center">
        <div className="text-3xl font-medium text-purple-800 mb-4">
          Create New <span className="capitalize">{playListType}</span> Playlist
        </div>
        {message && (
          <Alert type="Error" message={message} callback={() => setMessage()} />
        )}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Input label="Playlist Name" name="title" id="title" required />
            <CheckBox
              label="Embedded"
              name="embedded"
              id="embedded"
            />

            <div className="text-center m-auto inline-block mt-10">
              <Button isloding={isLoading} size="large">
                Create Playlist
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddPlayList;
