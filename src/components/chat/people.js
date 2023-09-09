import { api } from "../../utils/api";

function People({ user, handleUpdateGroups, currentUserId }) {
  const createGroup = async () => {
    const members = [user._id.toString(), currentUserId].join(",");
    const { status, data } = await api.handleCreateGroup({ members });
    if (status !== 400 && status !== 401) {
      handleUpdateGroups(data);
    }
  };
  return user.isOnline ? (
    <li className="clearfix" onClick={() => createGroup()}>
      <img src={user?.avatar} alt="avatar" />
      <div className="about">
        <div className="name">{user?.username}</div>
        <div className="status">
          <i className="fa fa-circle online">online</i>
        </div>
      </div>
    </li>
  ) : (
    <li className="clearfix" onClick={() => createGroup()}>
      <img src={user?.avatar} alt="avatar" />
      <div className="about">
        <div className="name">{user?.username}</div>
        <div className="status">
          <i className="fa fa-circle offline"></i>
        </div>
      </div>
    </li>
  );
}

export default People;
