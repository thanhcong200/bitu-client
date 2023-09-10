import {
  createGroup,
  getGroupById,
  getGroupsByUserId,
  getListUser,
  getProfile,
  login,
  register,
  renewToken,
} from "./api";

export const api = {
  async handleRegister(data) {
    return register(data);
  },
  async handleLogin(data) {
    return login(data);
  },
  async handleRefreshToken(fn) {
    const { status, data = null } = await fn();
    if (status === 401 || status === 400) {
      const { status } = await renewToken();
      if (status === 401 || status === 400) return { status: 400, data: null };
      return await fn();
    } else return { status, data };
  },
  async handleGetProfile() {
    return this.handleRefreshToken(getProfile);
  },
  async handleGetGroupsByUserId() {
    return this.handleRefreshToken(getGroupsByUserId);
  },
  async handleGetGroupById({ id, offset = 0, limit = 10 }) {
    const { status, data = null } = await getGroupById({ id, offset, limit });
    if (status === 401 || status === 400) {
      const { status } = await renewToken();
      if (status === 401 || status === 400) return { status: 400, data: null };
      return await getGroupById({ id, offset, limit });
    } else return { status, data };
  },
  async handleGetListUser(keyword) {
    const { status, data = null } = await getListUser(keyword);
    if (status === 401 || status === 400) {
      const { status } = await renewToken();
      if (status === 401 || status === 400) return { status: 400, data: null };
      return await getListUser(keyword);
    } else return { status, data };
  },
  async handleCreateGroup(group) {
    const { status, data = null } = await createGroup(group);
    if (status === 401 || status === 400) {
      const { status } = await renewToken();
      if (status === 401 || status === 400) return { status: 400, data: null };
      return await createGroup(data);
    } else return { status, data };
  },
};
