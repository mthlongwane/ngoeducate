import { faCheckCircle, faClock, faDownload, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { getApps } from "../Api";
import { useState } from "react";
const Apps = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getApps(data => {
      setApps(data)
    }, err => {
      alert("error: " + err)
    })
  }, [])

  return (
    <div>

      {apps.map((app, index) => {
      return (
      <div className="flex justify-around rounded-xl bg-white px-10 py-5 my-5 shadow-md">
        <div style={{minWidth: 200}}>
          <span className="font-bold text-lg">{app.appName}</span>
        </div>

        <div className="text-gray-800 text-left mx-10 bg-purple-50 pl-24 pr-3 border-2 border-purple-100 py-1 rounded-md relative" style={{minWidth: 200}}>
          <div className="text-gray-600 pr-4 font-semibold bg-white py-1 pl-2 absolute left-0 top-0 ">Status:</div>
       
          {
            app.status == "error" && (<FontAwesomeIcon icon={faExclamation} />)
          }
          {
            app.status == "building" && (<FontAwesomeIcon icon={faClock} />)
          }
          {
            app.status == "finished" && (<FontAwesomeIcon icon={faCheckCircle} color="green" />)
          }
          <span className="pl-2 capitalize font-semibold">{app.status}</span>
        </div>

        {app.status == "finished" && (
          <>
          <a href={`${process.env.REACT_APP_BASE_URL}/apps/${app.id}/download`} className="bg-purple-700 text-white px-4 py-1 rounded-md font-bold">
          <FontAwesomeIcon icon={faDownload} />
            <span className="px-2">
            Download
            </span>
            </a>
          </>
        )}
      </div>
      )

      })}
    </div>
  )
}

export default Apps;