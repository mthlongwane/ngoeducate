import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Button = ({
  isloding,
  icon,
  secondary,
  children,
  noBg,
  to,
  size,
  ...props
}) => {
  let style = {
    textColor: "white",
    borderColor: "purple-600",
    bgColor: "purple-600",
    fontWeight: "semibold",
    fontSize: "sm",
    hover: {
      textColor: "white",
      bgColor: "purple-600",
      borderColor: "purple-600",
    },
  };

  if (secondary) {
    style.textColor = "gray-500";
    style.bgColor = "gray-100";
    style.borderColor = "white";
    style.hover.bgColor = "gray-200";
    style.hover.textColor = "text-gray-900";
  }

  if (size) {
    style.fontSize = size;
  }

  if (noBg) {
    style.bgColor = "";
    style.borderColor = "transparent";
  }

  let commonStyles = `uppercase block mx-2 py-1 px-5 text-${style.fontSize} rounded-md`;

  if (to) {
    return (
      <Link
        to={to}
        className={`${commonStyles} font-${style.fontWeight} bg-${style.bgColor}  text-${style.textColor} border-${style.borderColor} border-2 hover:bg-${style.hover.bgColor} hover:text-${style.hover.textColor} focus:outline-none`}
      >
        {icon ? <FontAwesomeIcon icon={icon} className="mr-2" /> : null}
        {children}
      </Link>
    );
  }

  return !isloding ? (
    <button
      className={` ${commonStyles} font-${style.fontWeight}  bg-${style.bgColor}  text-${style.textColor} border-${style.borderColor} border-2 hover:bg-${style.hover.bgColor} hover:text-${style.hover.textColor} focus:outline-none`}
      {...props}
    >
      {icon ? (
        <span>
          <FontAwesomeIcon icon={icon} className="mr-1" />
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  ) : (
    <button
      className={` ${commonStyles} font-${style.fontWeight}  bg-${style.bgColor}  text-${style.textColor} border-${style.borderColor} border-2 hover:bg-${style.hover.bgColor} hover:text-${style.hover.textColor} focus:outline-none`}
      {...props}
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
          {icon ? (
            <span>
              <FontAwesomeIcon icon={icon} className="mr-1" />
            </span>
          ) : null}
          <span>{children}</span>
        </span>
      </div>
    </button>
  );
};

export default Button;
