import { Link } from "react-router-dom";
import config from "../../../config";
import { useAuth } from "../../../useAuth";

const Main = ({ children }) => {
  const { appTitle, appSlogan } = config;
  const { isAuthenticated } = useAuth();

  let goToPanelButton = (
    <div className="flex justify-end">
      <div>
        <Link
          to="/panel"
          className="font-semibold uppercase block mx-2 py-2 px-5 text-white text-lg rounded-md bg-purple-600 hover:bg-purple-700 focus:outline-none"
        >
          Go to the Panel
        </Link>
      </div>
    </div>
  );
  
  let loginRegisterButtons = (
    <div className="flex justify-end">
      <div>
        <Link
          to="/login"
          className="font-semibold uppercase block mx-2 py-2 px-5 text-white text-lg rounded-md bg-purple-600 hover:bg-purple-700 focus:outline-none"
        >
          Login
        </Link>
      </div>
      <div>
        <Link
          to="/register"
          className="font-semibold uppercase block mx-2 py-2 px-5 text-white text-lg rounded-md bg-purple-600 hover:bg-purple-700 focus:outline-none"
        >
          Register
        </Link>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto mt-10">
      <div className="grid sm:grid-cols-1 md:grid-cols-2">
        <div>
          <div className="siteTitle text-4xl font-bold">
            <Link to="/">{appTitle}</Link>
          </div>
          <div className="text-md font-medium">{appSlogan}</div>
        </div>

        {isAuthenticated ? goToPanelButton : loginRegisterButtons}
      </div>

      <div>{children}</div>
    </div>
  );
};

export default Main;
