import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller, useFormContext } from "react-hook-form";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useEffect } from "react";
import _Select from "react-select";

export const Upload = ({ label, accept, required, ...props }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const [fileSelected, setFileSelected] = useState({
    name: "",
    size: "",
    type: "",
  });

  const fileValues = watch(props.name);

  if (
    fileValues &&
    fileValues.length > 0 &&
    fileSelected.name != fileValues[0].name
  ) {
    setFileSelected({
      name: fileValues[0].name,
      size: (fileValues[0].size / 1024 / 1024).toFixed(1),
      type: fileValues[0].type.split("/")[0],
    });
  }

  return (
    <div className="mt-3 mr-2 ml-2">
      <div className="uppercase font-medium">{label}</div>
      <div className="flex items-center bg-grey-lighter ml-2 mt-5">
        <div>
          <label className="items-center px-4 py-2 rounded-md shadow-md border cursor-pointer hover:bg-gray-50">
            <FontAwesomeIcon icon={faUpload} />
            <span className="mt-2 text-base leading-normal mx-2">
              {!fileSelected.name ? "Select file" : "Change file"}
            </span>
            <input
              type="file"
              name={props.name}
              className="hidden"
              {...register(props.name, { required: required })}
              accept={accept}
            />
          </label>
        </div>
        <div id="fileList" className="ml-2">
          {!fileSelected.name && <p>No files selected!</p>}
          {fileSelected.name && (
            <div>
              <p>{"name: " + fileSelected.name}</p>
              <div className="flex">
                <p>{"type: " + fileSelected.type}</p>
                <p className="ml-5">{"size: " + fileSelected.size + " MB"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        {errors[props.name] && errors[props.name].type === "required" && (
          <span role="alert" className="text-red-500 font-bold">
            Please upload a logo!
          </span>
        )}
      </div>
    </div>
  );
};

export const CheckBox = ({ name, label, required, pattern, ...props }) => {
  const { register, formState } = useFormContext();
  return (
    <div className="flex text-base text-gray-700 font-semibold mt-3 mr-2 ml-2">
      <div className="mr-5">
        <input
          {...register(name, { required: required, pattern })}
          className=""
          name={name}
          {...props}
          type="checkbox"
        />
      </div>
      <label className="uppercase" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};

export const TextArea = ({ name, label, required, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={`text-base text-gray-700 font-semibold m-2`}>
      <div>
        <label className="uppercase">{label}:</label>
      </div>
      <textarea
        {...register(name, { required: required })}
        className="block w-full p-1 text-gray-800 font-semibold outline-none border-2 border-gray-200 rounded-md"
        {...props}
      ></textarea>

      {errors[name] && errors[name].type === "required" && (
        <span role="alert" className="text-red-500">
          Please fill this field!
        </span>
      )}

      {errors[name] && errors[name].type === "pattern" && (
        <span role="alert" className="text-red-500">
          {errors[name].message}
        </span>
      )}

      {errors[name] && errors[name].type == "server" && (
        <span role="alert" className="text-red-500">
          {errors[name].message}
        </span>
      )}
    </div>
  );
};
export const Input = ({ name, label, required, pattern, row, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className={`text-base text-gray-700 font-semibold m-2 ` + row}>
      <div className={row === "flex" ? "mt-1 mr-2" : ""}>
        {label ? <label className="uppercase">{label}:</label> : null}
      </div>
      <input
        {...register(name, { required: required, pattern })}
        className="block w-full p-1 text-gray-800 font-semibold outline-none border-2 border-gray-200 rounded-md"
        {...props}
      />

      {errors[name] && errors[name].type === "required" && (
        <span role="alert" className="text-red-500">
          Please fill this field!
        </span>
      )}

      {errors[name] && errors[name].type === "pattern" && (
        <span role="alert" className="text-red-500">
          {errors[name].message}
        </span>
      )}

      {errors[name] && errors[name].type == "server" && (
        <span role="alert" className="text-red-500">
          {errors[name].message}
        </span>
      )}
    </div>
  );
};

export const AsyncSelect = ({
  fetch,
  fetchParams,
  label,
  name,
  required,
  children,
  includeAll,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  if (fetchParams === undefined) {
    fetchParams = "";
  }
  useEffect(() => {
    fetch(fetchParams, (data) => {
      if (includeAll) {
        data.unshift({ id: null, name: "All" });
      }
      setOptions(
        data.map((item, index) => {
          return { value: item.id, label: item.name };
        })
      );
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <Select
        name={name}
        isSearchable
        label={label}
        options={options}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Select = (props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="text-base text-gray-700 font-semibold m-2">
      <label className="uppercase">{props.label}:</label>
      <div className="z-50">
        <Controller
          control={control}
          defaultValue={
            props.options.filter((item) => item.selected)[0].label || ""
          }
          rules={{ required: props.required }}
          name={props.name}
          render={({ field: { ref, onChange, value, name } }) => (
            <_Select
              inputRef={ref}
              options={props.options}
              value={props.options.find((c) => c.value === value)}
              onChange={(val) => onChange(val.value)}
            />
          )}
        />
      </div>
      {errors[props.name] && errors[props.name].type === "required" && (
        <span role="alert" className="text-red-500">
          Please fill this field!
        </span>
      )}

      {errors[props.name] && errors[props.name].type == "server" && (
        <span role="alert" className="text-red-500">
          {errors[props.name].message}
        </span>
      )}
    </div>
  );
};
