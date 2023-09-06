import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../utils/socket/index";
import "bootstrap/dist/css/bootstrap.css";
import "./chat.css";
import * as api from "../../utils/api";
import { getUser } from "../../utils";

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();
  const [currentGroup, setCurrentGroup] = useState({});
  const [groups, setGroups] = useState([
    {
      name: "Thanh Cong",
      isActive: 1,
      finalMessage: "Dang lam gi do",
      lastSeen: new Date(),
      isRead: true,
      messages: [
        {
          message: "How are you today",
          username: "Thanh Cong",
          isCurrentUser: 1,
          createdAt: "10:12 AM, Today",
        },
        {
          message: "How are you today",
          username: "Huy",
          isCurrentUser: 0,
          createdAt: "",
        },
        {
          message: "How are you today",
          username: "Thanh Cong",
          isCurrentUser: 1,
          createdAt: "",
        },
        {
          message: "How are you today",
          username: "Huy",
          isCurrentUser: 0,
          createdAt: "",
        },
      ],
    },
    {
      name: "Vu Dat",
      isActive: 0,
      finalMessage: "",
      lastSeen: new Date(),
      isRead: false,
      messages: [],
    },
    {
      name: "Le Thao",
      isActive: 1,
      finalMessage: "",
      lastSeen: new Date(),
      isRead: false,
      messages: [],
    },
    {
      name: "Nguyen Nhung",
      isActive: 0,
      finalMessage: "hihi",
      lastSeen: new Date(),
      isRead: false,
      messages: [],
    },
  ]);
  const [user, setUser] = useState({});
  const socketRef = useRef();

  useEffect(() => {
    let mounted = true;
    api.getGroupsByUserId("64f7437ff570166002f7c548").then((res) => {
      if (mounted && res.status !== 400) {
        console.log(res.data);
      }
    });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    socketRef.current = socket;
  }, []);

  useEffect(() => {
    socketRef.current = socket;

    socketRef.current.on("getId", (data) => {
      setId(data);
    }); // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.

    socketRef.current.on("sendDataServer", (dataGot) => {
      setChatHistory((oldMsgs) => [...oldMsgs, dataGot.data]);
    }); // mỗi khi có tin nhắn thì mess sẽ được render thêm

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleCurrentChat = (group) => {
    setCurrentGroup(group);
    setChatHistory(group.messages);
  };

  const renderGroups = () => {
    return (
      <ul className="list-unstyled chat-list mt-2 mb-0">
        {groups.map((group, index) => {
          return group.isActive ? (
            <li
              className="clearfix active"
              key={index}
              onClick={() => handleCurrentChat(group)}
            >
              <img
                src="https://bootdey.com/img/Content/avatar/avatar2.png"
                alt="avatar"
              />
              <div className="about">
                <div className="name">{group.name}</div>
                <div className="status">
                  <h6>{group.finalMessage}</h6>
                  <i className="fa fa-circle online">online</i>
                </div>
              </div>
            </li>
          ) : (
            <li
              className="clearfix"
              key={index}
              onClick={() => handleCurrentChat(group)}
            >
              <img
                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                alt="avatar"
              />
              <div className="about">
                <div className="name">{group.name}</div>
                <div className="status">
                  {group.finalMessage}
                  <i className="fa fa-circle offline"></i>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderChatHistory = () => {
    return (
      <ul className="m-b-0">
        {chatHistory.map((message, index) => {
          //   const isCurrentUser = 1;
          return message.isCurrentUser ? (
            <li className="clearfix" key={index}>
              <div className="message-data">
                <span className="message-data-time">{message.createdAt}</span>
              </div>
              <div className="message my-message">{message.message}</div>
            </li>
          ) : (
            <li className="clearfix" key={index}>
              <div className="message-data text-right">
                <span className="message-data-time">{message.createdAt}</span>
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar7.png"
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
                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                        alt="avatar"
                      />
                    </a>
                    <div className="chat-about">
                      <h6 className="m-b-0">{currentGroup?.name}</h6>
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
