import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faPlusSquare,
  faStream,
  faPhotoVideo,
  faUpload,
  faMobile,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../useAuth";
import { Link, useLocation } from "react-router-dom";

const Item = ({ icon, iconColor, children, active, onClick, to }) => {
  const { pathname } = useLocation();
  if (active == null) {
    active = pathname == to;
  }

  let activeClass = active
    ? "bg-gradient-to-l bg-gradient-to-r from-white to-gray-50 text-gray-700  hover:text-gray-800"
    : "";

  return (
    <li className="my-px">
      <Link
        to={to || "#"}
        onClick={onClick}
        className={`flex ${activeClass} flex-row my-2 items-center h-12 px-4 rounded-lg  text-white hover:bg-white hover:text-gray-800`}
      >
        <span className={`text-lg ${iconColor} w-5 inline-block text-center`}>
          <FontAwesomeIcon icon={icon} />
        </span>
        <span className="ml-3 text-lg font-medium">{children}</span>
      </Link>
    </li>
  );
};
const SeparatorItem = ({ children }) => {
  return (
    <li className="my-px">
      <span className="flex font-medium text-sm text-gray-50 px-4 mt-10 uppercase">
        {children}
      </span>
    </li>
  );
};
const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <div className="h-full items-center justify-center relative bg-purple-500 rounded-xl">
      <div className=" w-full p-4">
        <ul className="h-full w-full">
          <SeparatorItem>Apps</SeparatorItem>

          <Item icon={faMobileAlt} to="/panel/apps">
            My Apps
          </Item>

          <Item icon={faPlusSquare} to="/panel/new-app">
            New App
          </Item>

          <SeparatorItem>Media</SeparatorItem>

          <Item icon={faUpload} to="/panel/media/new">
            Upload File
          </Item>

          <Item icon={faPhotoVideo} to="/panel/media">
            Manage Files
          </Item>

          <Item icon={faStream} to="/panel/playlists">
            Playlists
          </Item>

          <SeparatorItem>Account</SeparatorItem>
          <Item
            icon={faSignOutAlt}
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Item>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
