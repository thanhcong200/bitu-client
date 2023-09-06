import axios from "axios";
// const token = localStorage.getItem("accessToken");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Zjc0MzdmZjU3MDE2NjAwMmY3YzU0OCIsInVzZXJuYW1lIjoidnVjb25nICIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk0MDE5MjkzLCJleHAiOjE2OTQwMTkzNTN9.OdKbU7pGrMN07URM3x00_yHRUDFVpE1gNeeHTAYYHqU";

export const register = async (data) => {
  try {
    const res = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/auth/register`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const renewToken = async (data) => {
  try {
    const res = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};

export const getGroupsByUserId = async (id) => {
  try {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/rooms?userId=${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { status: res.status, data: res.data };
  } catch (error) {}
  return { status: 400 };
};
