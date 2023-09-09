function Group({ group, handleCurrentChat }) {
  return group.partner?.isOnline ? (
    <li className="clearfix" onClick={() => handleCurrentChat(group)}>
      <img src={group.partner?.avatar} alt="avatar" />
      <div className="about">
        <div className="name">{group.partner?.username}</div>
        <div className="status">
          <h6>
            {group?.lastMessage ? group.lastMessage?.message.slice(0, 20) : ""}
          </h6>
          <i className="fa fa-circle online">online</i>
        </div>
      </div>
    </li>
  ) : (
    <li className="clearfix" onClick={() => handleCurrentChat(group)}>
      <img src={group.partner?.avatar} alt="avatar" />
      <div className="about">
        <div className="name">{group.partner?.username}</div>
        <div className="status">
          <h6>{group?.lastMessage ? group.lastMessage?.message : ""}</h6>
          <i className="fa fa-circle offline"></i>
        </div>
      </div>
    </li>
  );
}

export default Group;
