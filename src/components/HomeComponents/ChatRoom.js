import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import iziToast from "izitoast";
import { io } from "socket.io-client";
import "./ChatRoom.css";

const socket = io(process.env.REACT_APP_BASE_URL.replace('/api', '').replace('http', 'ws'));


function ChatRoom() {
  const { loggedInUser } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatWithUser, setChatWithUser] = useState(null);
  const [time, setTime] = useState(new Date());

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (loggedInUser?._id) {
      socket.emit("register_user", loggedInUser._id);
    }
  }, [loggedInUser]);


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/list`);
        setUsersList(response.data.users);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong!";
        iziToast.error({
          title: "Error",
          message: errorMessage,
          position: "topRight",
        });
      }
    };

    getUsersList();
  }, [baseURL]);

  const chatWithUserFunction = (user) => {
    setChatWithUser(user);
    getChatHistory(user._id);
    setMessages([]);
  };

  const sendMessage = () => {
    const messageData = {
      senderId: loggedInUser._id,
      receiverId: chatWithUser._id,
      message,
    };

    socket.emit("send_message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  function getChatHistory(user_id) {
    console.log("Called : ", user_id);
    
    const chatHistory = async () => {

      try {
        const baseURL = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseURL}/chat/${user_id}/${loggedInUser._id}`);


        console.log(response);

      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Invalid credentials!";
        iziToast.error({
          title: "Error",
          message: errorMessage,
          position: "topRight",
        });
      }
    };

    chatHistory();
  }

  return (

    <div className="col-12 bg-lightblue">
      <div className="chat-room-container">


        <header className="dashboard-header p-3 border-bottom">
          <div className="d-flex justify-content-between">
            <div className="col-6">

              <h5>{loggedInUser?.name}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end header-right">
              <span className="time">{time.toLocaleTimeString()}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="d-flex col-12 chat-body">
          <div className="col-3">
            <section className="user-list border">
              {usersList.map((user) => (
                user._id != loggedInUser._id ?
                  <div
                    key={user._id}
                    className="pointer users-list"
                    onClick={() => chatWithUserFunction(user)}
                  >
                    <div className="col-12 d-flex justify-content-between">
                      <div className="col-8">
                        <strong>{user.name}</strong>
                      </div>
                      <div className="col-5">
                        {user.mobile}
                      </div>
                    </div>
                  </div>
                  :
                  <div>

                  </div>
              ))}
            </section>
          </div>
          <div className="col-9">
            <section className="chat-box border d-flex flex-column">
              {chatWithUser && (
                <>
                  <h5 className="border-bottom p-2">{chatWithUser.name}</h5>
                  <div className="messages flex-grow-1 overflow-auto">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={
                          msg.senderId === loggedInUser._id
                            ? "sent-message"
                            : "received-message"
                        }
                      >
                        <p>{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="message-input-container d-flex align-items-center mt-auto">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="form-control me-2"
                    />
                    <button className="btn btn-primary" onClick={sendMessage}>
                      Send
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>

        <footer className="dashboard-footer">
          <p>&copy; 2024 Simple Company</p>
        </footer>
      </div>
    </div>
  );

}

export default ChatRoom;
