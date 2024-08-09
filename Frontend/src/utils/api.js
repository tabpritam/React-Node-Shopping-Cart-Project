import axios from "axios";

const authConfig = () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {},
  };
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

export const fetchData = async (endpoint) => {
  try {
    const config = authConfig();
    const response = await axios.get(
      `http://localhost:5000/api/${endpoint}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const postData = async (endpoint, data) => {
  try {
    const config = authConfig();
    const response = await axios.post(
      `http://localhost:5000/api/${endpoint}`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
export const deleteData = async (endpoint, data) => {
  try {
    const config = authConfig();
    config.data = data; // Add data to config
    const response = await axios.delete(
      `http://localhost:5000/api/${endpoint}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
export const putData = async (endpoint, data) => {
  try {
    const config = authConfig();
    const response = await axios.put(
      `http://localhost:5000/api/${endpoint}`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
