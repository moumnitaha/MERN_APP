import axios from "axios";

const refreshToken = async () => {
  try {
    await axios.post(
      "http://localhost:3000/refresh",
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error(error?.response?.data);
  }
};

const createApiInstance = () => {
  const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
  });
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        console.log("Token expired, refreshing token...");
        return refreshToken().then(() => {
          const config = error.config;
          return axios(config);
        });
      }
      return Promise.reject(error);
    }
  );
  return api;
};

export default createApiInstance;
