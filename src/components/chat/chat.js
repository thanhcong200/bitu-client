import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./chat.css";
import * as api from "../../utils/api";
import People from "./people";
import { io } from 'socket.io-client';
const URL = process.env.REACT_APP_WEBSOCKET_URL
function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentGroup, setCurrentGroup] = useState({});
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const [socket, setSocket] = useState(null)
  const [isChat, setIsChat] = useState(false)

  const [isLogin, setIsLogin] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    }
  }, [accessToken]);

  useEffect(() => {
    setUser(user)
  }, [user]);


  useEffect(() => {
    if (lastMessage) {
      chatHistory.push(lastMessage)
      const newGroups = groups.filter(group => group._id.toString() !== lastMessage.roomId.toString())
      const cGroup = groups.find(group => group._id.toString() === lastMessage.roomId.toString());
      cGroup.lastMessage = lastMessage;
      newGroups.unshift(cGroup);
      setGroups(newGroups)
      setLastMessage(null)
    }
  }, [lastMessage, groups])

  useEffect(() => {

    if (!isLogin) return () => { }
    api.getProfile().then(res => {
      if (res.status !== 400) {
        console.group("profile ", res.data)
        setUser(res.data)
        const socketInstance = io(URL, { query: { roomId: user?._id.toString() } });
        setSocket(socketInstance)

        function onConnect() {

        }

        function onDisconnect() {
        }


        socketInstance.on('connect', onConnect);
        socketInstance.on('disconnect', onDisconnect);
        socketInstance.on('message-recieve', data => {
          setLastMessage(data.message)
        })

        return () => {
          socketInstance.off('connect', onConnect);
          socketInstance.off('disconnect', onDisconnect);
          socketInstance.off('message-recieve', data => console.log(data))

        };
      }
    })

  }, [isLogin]);



  useEffect(() => {
    let mounted = true;
    api.getGroupsByUserId().then((res) => {
      if (mounted && res.status !== 400) {
        setGroups(res.data.docs);
      }
    });

    return () => (mounted = false);
  }, []);

  const handleCurrentChat = async (group) => {
    const res = await api.getGroupById(group._id.toString());
    setCurrentGroup(group);
    setChatHistory(res.data.docs);
    setIsChat(true)
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    const message = e.target.value;
    if (key === "Enter" && isLogin) {
      socket.emit('messages', { senderId: user?._id.toString(), message, roomId: currentGroup._id.toString() })
      e.target.value = ""
    }
  };


  const renderGroups = () => {
    return (
      <ul className="list-unstyled chat-list mt-2 mb-0">
        {groups.map((group, index) => (
          <People
            key={index}
            group={group}
            handleCurrentChat={handleCurrentChat}
          />
        ))}
      </ul>
    );
  };

  const renderChatHistory = () => {
    return (
      <ul className="m-b-0">
        {isChat && chatHistory.map((message, index) => {
          //   const isCurrentUser = 1;
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
                <div >
                  <img src={user?.avatar} alt="avatar" className="avatar" />

                </div>
                <div className="message">
                  {user?.username}
                </div>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
              </div>
              {renderGroups()}
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
                      <img src={currentGroup?.partner?.avatar} alt="avatar" />
                    </a>
                    <div className="chat-about">
                      <h6 className="m-b-0">
                        {currentGroup?.partner?.username}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-history">{renderChatHistory()}</div>
              <div className="chat-message clearfix">
                <div className="input-group mb-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter text here..."
                    disabled={isChat ? false : true}
                    onKeyDown={(e) => handleKeyDown(e)}
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
