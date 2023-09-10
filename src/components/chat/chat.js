import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./chat.css";
import { api } from "../../utils/api/index";
import Group from "./group";
import { io } from "socket.io-client";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import People from "./people";
import { SOCKET_EVENT, SOCKET_SUBCRIBE } from "../../utils/constant";
const URL = process.env.REACT_APP_WEBSOCKET_URL;
function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentGroup, setCurrentGroup] = useState({});
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isChat, setIsChat] = useState(false);
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [suggestUsers, setSuggestUsers] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const messagesEndRef = useRef(null);
  const [messageQuery, setMessageQuery] = useState({ offset: 0, limit: 10 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentGroup]);

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isLogin) {
      api.handleGetProfile().then((res) => {
        if (res.status !== 400 && res.status !== 401) {
          setUser(res.data);
        }
      });
    }
  }, [isLogin]);

  useEffect(() => {
    if (lastMessage) {
      chatHistory.push(lastMessage);
      const newGroups = groups.filter(
        (group) => group._id.toString() !== lastMessage.roomId.toString()
      );
      const cGroup = groups.find(
        (group) => group._id.toString() === lastMessage.roomId.toString()
      );
      cGroup.lastMessage = lastMessage;
      newGroups.unshift(cGroup);
      setGroups(newGroups);
      setChatHistory(chatHistory);
      setLastMessage(null);
    }
  }, [lastMessage, groups]);

  useEffect(() => {
    if (!isLogin || !user) return () => {};
    const socketInstance = io(URL, {
      query: { roomId: user?._id.toString() },
    });
    setSocket(socketInstance);

    function onConnect() {}

    function onDisconnect() {}

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);
    socketInstance.on(SOCKET_EVENT.MESSAGE, (data) => {
      setLastMessage({
        ...data.message,
      });
    });

    socketInstance.on(SOCKET_EVENT.NEW_GROUP, (data) => {
      const group = data?.group;
      const partner = group.members.find(
        (member) => member.id.toString() !== user?._id.toString()
      );
      setGroups([{ ...group, partner }, ...groups]);
      setCurrentGroup(group);
    });

    socketInstance.on(SOCKET_EVENT.OFFLINE, (data) => {
      const newGroups = groups.map((group) =>
        group._id.toString() === data.roomId.toString()
          ? { ...group, partner: { ...group.partner, isOnline: data.isOnline } }
          : group
      );
      console.log(data, newGroups);
      setGroups(newGroups);
    });

    socketInstance.on(SOCKET_EVENT.ONLINE, (data) => {
      const newGroups = groups.map((group) =>
        group._id.toString() === data.roomId.toString()
          ? { ...group, partner: { ...group.partner, isOnline: data.isOnline } }
          : group
      );
      console.log(data, newGroups);
      setGroups(newGroups);
    });

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
      socketInstance.off("message-recieve", (data) => console.log(data));
    };
  }, [isLogin, user]);

  useEffect(() => {
    let mounted = true;
    api.handleGetGroupsByUserId().then((res) => {
      if (mounted) {
        if (res.status !== 400 && res.status !== 401) {
          setGroups(res.data.docs);
        } else history.push("/login");
      }
    });

    return () => (mounted = false);
  }, []);

  const handleUpdateGroups = async (group) => {
    if (group) {
      setCurrentGroup(group);
      setChatHistory([]);
      setGroups([group, ...groups]);
      socket.emit(SOCKET_SUBCRIBE.GROUP, {
        senderId: user?._id.toString(),
        roomId: group?._id.toString(),
      });
      setIsChat(true);
    }
    cancelSearch();
  };

  const handleCurrentChat = async (group) => {
    const res = await api.handleGetGroupById({
      ...messageQuery,
      id: group._id.toString(),
    });
    setCurrentGroup(group);
    setChatHistory(res.data.docs.reverse());
    setIsChat(true);
  };

  const handleKeyDownMessage = (e) => {
    const key = e.key;
    const message = e.target.value;
    if (key === "Enter" && isLogin) {
      const messageObj = {
        roomId: currentGroup._id.toString(),
        sender: {
          id: user?._id,
          username: user?.username,
          avatar: user?.avatar,
        },
        message,
      };
      setLastMessage(messageObj);
      socket.emit(SOCKET_SUBCRIBE.MESSAGE, {
        senderId: user?._id.toString(),
        message,
        roomId: currentGroup._id.toString(),
      });
      e.target.value = "";
    }
  };

  const handleKeyDownSearch = async (e) => {
    const key = e.key;
    const keyword = e.target.value;
    if (key === "Enter" && isLogin) {
      const { status, data } = await api.handleGetListUser(keyword);
      if (status !== 400 && status !== 401) {
        setSuggestUsers(data.docs);
        setIsSearch(true);
      }
    }
  };

  const handleScroll = async (e) => {
    if (e.target.scrollTop === 0) {
      if (currentGroup?._id) {
        const { offset, limit } = messageQuery;
        let newOffset = offset + chatHistory.length;
        const { status, data } = await api.handleGetGroupById({
          offset: newOffset,
          limit: limit,
          id: currentGroup._id.toString(),
        });

        if (status !== 400 && status !== 401) {
          if (data.docs.length > 0) {
            setMessageQuery({
              offset: offset + chatHistory.length,
              limit: limit,
            });
            setChatHistory([...data.docs.reverse(), ...chatHistory]);
          }
        } else history.push("/login");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    history.push("/login");
  };

  const renderGroups = () => {
    return (
      <ul className="list-unstyled chat-list mt-2 mb-0">
        {groups.map((group, index) => (
          <Group
            key={index}
            group={group}
            handleCurrentChat={handleCurrentChat}
          />
        ))}
      </ul>
    );
  };

  const renderSuggestUser = () => {
    return (
      <ul className="list-unstyled chat-list mt-2 mb-0">
        {suggestUsers &&
          suggestUsers.map((userSuggest, index) => (
            <People
              key={index}
              user={userSuggest}
              currentUserId={user._id.toString()}
              handleUpdateGroups={handleUpdateGroups}
            />
          ))}
      </ul>
    );
  };

  const cancelSearch = () => {
    document.querySelector("#search").value = "";
    setIsSearch(false);
  };

  const renderChatHistory = () => {
    return (
      <ul className="m-b-0" onScroll={handleScroll} ref={messagesEndRef}>
        {isChat &&
          chatHistory.map((message, index) => {
            return message.sender.id.toString() === user?._id.toString() ? (
              <li className="clearfix" key={index}>
                <div className="message-data"></div>
                <div className="message my-message">{message.message}</div>
              </li>
            ) : (
              <li className="clearfix" key={index}>
                <div className="message-data text-right">
                  <img src={currentGroup.partner?.avatar} alt="avatar" />
                </div>
                <div className="message other-message float-right">
                  {message.message}
                </div>
              </li>
            );
          })}
      </ul>
    );
  };
  return (
    <div className="container">
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card chat-app">
            <div id="plist" className="people-list">
              <div className="profile">
                <div>
                  <img src={user?.avatar} alt="avatar" className="avatar" />
                </div>
                <div className="message">{user?.username}</div>
              </div>

              <div className="input-group">
                <input
                  id="search"
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  onKeyDown={(e) => handleKeyDownSearch(e)}
                />
              </div>
              {isSearch ? renderSuggestUser() : renderGroups()}
            </div>
            <div className="chat">
              <div className="chat-header clearfix">
                <div className="row">
                  <div className="col-lg-6">
                    <a
                      href="javascript:void(0);"
                      data-toggle="modal"
                      data-target="#view_info"
                    >
                      <img
                        src={
                          currentGroup?.partner?.avatar
                            ? currentGroup?.partner?.avatar
                            : user?.avatar
                        }
                        alt="avatar"
                      />
                    </a>
                    <div className="chat-about">
                      <h6 className="m-b-0">
                        {currentGroup?.partner?.username}
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-6 hidden-sm text-right">
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => handleLogout()}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              <div className="chat-history" onClick={() => cancelSearch()}>
                {renderChatHistory()}
              </div>
              <div className="chat-message clearfix">
                <div className="input-group mb-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter text here..."
                    disabled={isChat ? false : true}
                    onKeyDown={(e) => handleKeyDownMessage(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
