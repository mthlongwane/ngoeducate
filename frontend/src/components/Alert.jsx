import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Alert = ({ type, message }) => {
  let color = "blue";
  if (type === "Error") {
    color = "red";
  } else if (type === "Success") {
    color = "green";
  }
  return (
    <div
      className={`text-white px-2 py-2 border-0 text-base rounded relative mb-4 bg-${color}-500`}
    >
      <span className="px-2">
        <FontAwesomeIcon icon={faBell} />
      </span>
      <span className="mr-1">
        <b className="capitalize">{type}!</b>&nbsp;
      </span>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
