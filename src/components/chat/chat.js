import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./chat.css";
import * as api from "../../utils/api";
import People from "./people";
import { socket } from "../../utils/socket";

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentGroup, setCurrentGroup] = useState({});
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("id"));
  const [lastMessage, setLastMessage] = useState(null)

  useEffect(() => {
    if (lastMessage && groups.length) {
      console.log(groups.length, groups[0]._id)

      const group = groups.find(g => g?._id?.toString() !== lastMessage?.roomId?.toString());
      if (group) {
        group.lastMessage = lastMessage;
        console.log(group)
        const newGroups = groups.filter(group => group?._id?.toString() !== lastMessage?.roomId?.toString());
        newGroups.unshift(group);
        setGroups(newGroups)
        setLastMessage(null)
      }
      // currentGroup.messafes /
    }
  }, [lastMessage, groups])

  useEffect(() => {
    function onConnect() {

    }

    function onDisconnect() {
    }


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message-recieve', message => {
      setLastMessage(message)
    })

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message-recieve', data => console.log(data))

    };
  }, []);



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
    setCurrentGroup(res.data.docs[0]);
    setChatHistory(res.data.docs[0].messages);
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    const message = e.target.value;
    if (key === "Enter") {
      socket.emit('messages', { senderId: userId, message, roomId: currentGroup._id.toString() })
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
        {chatHistory.map((message, index) => {
          //   const isCurrentUser = 1;
          return message.sender._id.toString() === userId ? (
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
