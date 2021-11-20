import _axios from "axios";
import jwtDecode from "jwt-decode";

const axios = _axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem("authToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const checkLogin = (data, successCallback, errorCallback) => {
  return axios
    .post("/auth/login", data)
    .then((response) => {
      if (response.status === 200) {
        let token = response.data.token;
        let decoded = jwtDecode(token);
        successCallback(token, decoded);
      } else errorCallback && errorCallback(response.data.message);
    })
    .catch((err) => {
      errorCallback && errorCallback(err.response);
    });
};

export const ckeckRegister = (data, successCallback, errorCallback) => {
  return axios
    .post("auth/register", data)
    .then((response) => {
      if (response.status === 200) {
        successCallback();
      } else errorCallback && errorCallback(response.data.message);
    })
    .catch((err) => {
      errorCallback && errorCallback(err.response);
    });
};

const axiosPost = (uri, data, successCallback, errorCallback) => {
  return axios
    .post(uri, data)
    .then((response) => {
      if (response.status === 200) {
        successCallback(response.data.message);
      } else errorCallback && errorCallback(response.data.message);
    })
    .catch((err) => {
      errorCallback && errorCallback(err.response);
    });
};
const axiosDelete = (uri, successCallback, errorCallback) => {
  return axios
    .delete(uri)
    .then((response) => {
      if (response.status === 200) {
        successCallback(response.data.message);
      } else errorCallback && errorCallback(response.data.message);
    })
    .catch((err) => {
      errorCallback && errorCallback(err.response);
    });
};
const axiosPut = (url: string, data, successCallback, errorCallback) => {
  return axios
    .put(url, data)
    .then((response) => {
      if (response.status === 200) {
        successCallback(response.data.message);
      } else errorCallback && errorCallback(response.data.message);
    })
    .catch((err) => {
      errorCallback && errorCallback(err.response);
    });
};
const axiosGet = (url: string, successCallback, errorCallback) => {
  return axios
    .get(url)
    .then((response) => {
      if (response.status === 200) {
        successCallback(response.data.data);
      } else errorCallback && errorCallback(response.data.message);
    })
    .catch((err) => {
      errorCallback && errorCallback(err.response);
    });
};

export const uploadFile = (data, successCallback, errorCallback) => {
  return axiosPost("files/upload", data, successCallback, errorCallback);
};

export const removeFile = (id: number, successCallback, errorCallback) => {
  return axiosDelete("files/" + id, successCallback, errorCallback);
};
export const editFile = (id: number, data, successCallback, errorCallback) => {
  return axiosPut("files/" + id, data, successCallback, errorCallback);
};
export const getFiles = (fileType: string, successCallback, errorCallback) => {
  return axiosGet("files?type=" + fileType, successCallback, errorCallback);
};

export const getOneFile = (id: number, successCallback, errorCallback) => {
  return axiosGet("files/" + id, successCallback, errorCallback);
};

export const addPlayList = (data, successCallback, errorCallback) => {
  return axiosPost("/playlist", data, successCallback, errorCallback);
};

export const editPlayList = (
  id: number,
  data: { title: string; embedded: boolean },
  successCallback,
  errorCallback
) => {
  return axiosPut("playlist/" + id, data, successCallback, errorCallback);
};

export const removePlayList = (id: number, successCallback, errorCallback) => {
  return axiosDelete("playlist/" + id, successCallback, errorCallback);
};

export const getPlaylists = (successCallback, errorCallback) => {
  return axiosGet("playlist", successCallback, errorCallback);
};

export const getOnePlayList = (id: number, successCallback, errorCallback) => {
  return axiosGet("playlist/" + id, successCallback, errorCallback);
};

export const addFileToPlaylist = (
  playlistId,
  fileId,
  successCallback,
  errorCallback
) => {
  return axiosPost(
    `playlist/${playlistId}/files`,
    { fileId: fileId },
    successCallback,
    errorCallback
  );
};

export const removePlayListFiles = (
  playlistId: number,
  fileId: number,
  successCallback,
  errorCallback
) => {
  return axiosDelete(
    `playlist/${playlistId}/files/${fileId}`,
    successCallback,
    errorCallback
  );
};

export const getPlayListFiles = (
  playlistId: number,
  successCallback,
  errorCallback
) => {
  return axiosGet(
    `playlist/${playlistId}/files`,
    successCallback,
    errorCallback
  );
};

export const generateApplication = (
  appData,
  successCallback,
  errorCallback
) => {
  axiosPost("/applications", appData, successCallback, errorCallback);
};

export const getApps = (
  successCallback, errorCallback
) => {
  axiosGet("/applications", successCallback, errorCallback);
}