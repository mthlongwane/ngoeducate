import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { Input, Upload } from "./Fields";
import Button from "./Button";
import { uploadFile } from "../Api";
import Alert from "./Alert";

const AddMedia = () => {
  const methods = useForm();
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const onSubmit = ({ title, file }) => {
    setMessage();
    setIsLoading(true);
    let fileData = new FormData();
    fileData.append("file", file[0]);
    fileData.append("title", title);
    uploadFile(
      fileData,
      () => {
        setRedirect("/panel/media");
        setIsLoading(false);
      },
      (err) => {
        setMessage(err);
        setIsLoading(false);
        if (err === undefined) setMessage("Please Check the Internet");
      }
    );
  };
  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div>
      <div className="m-auto text-center">
        <div className="text-3xl font-medium text-purple-800 mb-4">
          Upload New File
        </div>
      </div>
      {message && (
        <Alert type="Error" message={message} callback={() => setMessage()} />
      )}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="w-full flex">
            <div className="m-auto">
              <div className="mt-4">
                <Input
                  label="Title"
                  name="title"
                  id="title"
                  required
                />
              </div>

              <div className="my-10">
                <Upload name="file" required accept={["video/*", " audio/*"]} />
              </div>

              <Button
                isloding={isLoading}
                size="large"
                style={{ margin: "0 auto" }}
              >
                Upload file
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
export default AddMedia;
