import API_KEY_V4 from "./key";
import axios from "axios";

const API_BASE = "https://api.themoviedb.org/3";

let tmdbConfig;
let baseImageUrl = "https://image.tmdb.org/t/p/";
const basePosterSize = "w185";


const defaultFetchParams = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + API_KEY_V4,
  },
};

function getImageUrl(path, posterSize = basePosterSize) {
  return baseImageUrl + posterSize + path;
}

/*

const getMovies = async (path, params = {}) => {
  const url = API_BASE + path;
  const requestParams = {
    ...defaultFetchParams,
    ...params,
  };
  const data = await fetch(url, requestParams);
  return data.json();
};

*/

const getMovies = async (path, params = {}) => {
  const url = API_BASE + path;
  const requestParams = {
    ...defaultFetchParams,
    ...params,
  };
  return fetch(url, requestParams).then((data) => data.json());
};

const loadMovies = async (path, params = {}) => {
  const url = API_BASE + path;
  const requestParams = {
    ...defaultFetchParams,
    ...params,
  };
  const response = await axios.get(url, requestParams);
  return response.data;
};

const loadConfig = async () => {
  const data = await getMovies("/configuration");
  tmdbConfig = data;
  baseImageUrl = data.images?.base_url;
  return data;
};

const getMovieDetails = async (path, params = {}) => {
  const url = API_BASE + path;
  const requestParams = {
    ...defaultFetchParams,
    ...params,
  };
  const response = await axios.get(url, requestParams);

  return response.data;;
};

export { getImageUrl, getMovies, loadMovies, getMovieDetails, loadConfig };
