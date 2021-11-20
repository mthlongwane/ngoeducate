import LeftImage from "../images/main_left.svg";
import { Select, Input } from "./Fields";
import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "../useAuth";
import { useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import Alert from "./Alert";
import countryPhones from "../phone.json";

const LoginForm = (props) => {
  const methods = useForm();
  const { reg } = useLocation();
  const { login } = useAuth();
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const onSubmit = ({ mobile, countryCode, password }) => {
    setIsLoading(true);
    setLoginErrorMessage();
    login(
      mobile,
      countryCode,
      password,
      () => {
        setIsLoading(false);
        setRedirect("/panel/playlists");
      },
      (err) => {
        setLoginErrorMessage(err);
        setIsLoading(false);
        if (err === undefined)
          setLoginErrorMessage("Please check your connection!");
      }
    );
  };
  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 mt-20">
      <div className="">
        <img src={LeftImage} />
      </div>

      <div className="text-2xl">
        <div className="w-10/12 px-10">
          <div className="m-2">
            <h3 className="font-bold">Login</h3>
          </div>
          {loginErrorMessage && (
            <Alert
              type={"Error"}
              message={loginErrorMessage}
              callback={() => setLoginErrorMessage()}
            />
          )}
          {reg === "registered" && (
            <Alert type="Success" message={"Registration completed!"} />
          )}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex">
                <div>
                  <Select
                    name="countryCode"
                    isSearchable
                    label={"Country code"}
                    options={Object.values(countryPhones).map((item) => ({
                      label: `+${item}`,
                      value: item,
                      selected: item == "27",
                    }))}
                  />
                </div>
                <div>
                  <Input label="Mobile Number" name="mobile" maxLength="10" />
                </div>
              </div>

              <div>
                <Input label="Password" type="password" name="password" />
              </div>

              <div>
                {!isLoading ? (
                  <button className="font-semibold uppercase block mx-2 py-2 px-5 text-white text-lg rounded-md bg-purple-600 hover:bg-purple-700 focus:outline-none">
                    Login
                  </button>
                ) : (
                  <button
                    className="font-semibold uppercase block mx-2 py-2 px-5 text-white text-lg rounded-md bg-purple-600 hover:bg-purple-700 focus:outline-none"
                    disabled
                  >
                    <div className="flex justify-around">
                      <span className="inline-flex rounded-md shadow-sm">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Login...
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
