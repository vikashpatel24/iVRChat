import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    async function fetchMessages() {
      if (currentChat) {
        try {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
          // Handle the error, e.g., set an error state or show a message to the user.
        }
      }
    }

    fetchMessages();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentChat._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
      // alert("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle the error, e.g., set an error state or show a message to the user.
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  });

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml; base64, ${currentChat.avatarImage}`}
                  alt="your_avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div ref={scrollRef} key={uuidv4}>
                <div
                  className={`message ${
                    message.fromSelf ? "sended" : "recieved"
                  }`}
                >
                  <div className="Content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  /* gap: 1rem; */
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    height: 80%;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0%.2rem;
      &-thumb {
        background-color: #ffff39;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: white;
    }
  }
  .received {
    justify-content: flex-start;
    .content {
      background-color: white;
    }
  }
`;
