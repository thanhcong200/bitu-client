import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../utils/socket/index";
import "bootstrap/dist/css/bootstrap.css";
import "./chat.css";
import * as api from "../../utils/api";
import People from "./people";

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [currentGroup, setCurrentGroup] = useState({});
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    let mounted = true;
    api.getGroupsByUserId().then((res) => {
      if (mounted && res.status !== 400) {
        console.log(res.data);
        setGroups(res.data.docs)
      }
    });

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    setUserId(localStorage.getItem('id'))
  }, [localStorage.getItem('id')])

  const handleCurrentChat = async (group) => {
    const res = await api.getGroupById(group._id.toString());
    setCurrentGroup(res.data.docs[0]);
    setChatHistory(res.data.docs[0].messages);
  };

  const renderGroups = () => {
    return (
      <ul className="list-unstyled chat-list mt-2 mb-0">
        {groups.map((group, index) => <People index={index} group={group} handleCurrentChat={handleCurrentChat} />)}
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
              <div className="message-data">
              </div>
              <div className="message my-message">{message.message}</div>
            </li>
          ) : (
            <li className="clearfix" key={index}>
              <div className="message-data text-right">
                <img
                  src={currentGroup.partner?.avatar}
                  alt="avatar"
                />
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
                      <img
                        src={currentGroup?.partner?.avatar}
                        alt="avatar"
                      />
                    </a>
                    <div className="chat-about">
                      <h6 className="m-b-0">{currentGroup?.partner?.username}</h6>
                      {/* <small>Last seen: 2 hours ago</small> */}
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
                    onChange={(e) => setMessage(e.target.value)}
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
