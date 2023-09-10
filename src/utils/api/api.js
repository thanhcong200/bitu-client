import axios from "axios";

export const register = async (data) => {
  try {
    const res = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/auth/register`,
      data,
    });
    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const login = async (data) => {
  try {
    const res = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/auth/login`,
      data,
    });
    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const getProfile = async () => {
  let token = localStorage.getItem("accessToken");
  try {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/users/profile`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const getListUser = async (keyword) => {
  let token = localStorage.getItem("accessToken");
  try {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/users?keyword=${keyword}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const renewToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const getGroupsByUserId = async () => {
  let token = localStorage.getItem("accessToken");
  try {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/rooms`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const getGroupById = async ({ id, offset, limit }) => {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/rooms/${id}?offset=${offset}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const createGroup = async (data) => {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/rooms`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};
