export const getUser = async () => {
  const id = localStorage.getItem("id");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("accessToken");
  return {
    id,
    username,
    token,
  };
};
