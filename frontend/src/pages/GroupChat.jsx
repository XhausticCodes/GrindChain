import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import socketAPI from "../API/socketApi";

const GroupChat = () => {

  const { user } = useAuth();

  const [groupID, setGroupID] = useState(user.groupID || null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessage = () => {
    // Logic to send message
    if (currentMessage.trim()) {
      const newMessage = {
        id: Date.now() + Math.random(),
        sender: user.username,
        avatar: user.avatar,
        message: currentMessage,
        time: new Date().toISOString(),
      };
      socketAPI.emit("sendMessage", {
        groupID,
        ...newMessage,
        username: user.username,
      });
      setCurrentMessage("");
    }
  };

  const handleMessageReceived = (messageData) => {
    setMessages((prevMessage) => {
      const exists = prevMessage.some((msg) => msg.id === messageData.id);
      if (!exists) {
        return [...prevMessage, messageData];
      }
      return prevMessage;
    });
  };

  useEffect(() => {
    socketAPI.on("receiveMessage", handleMessageReceived);
  }, []);

  useEffect(() => {
    if (groupID && user?.username) {
      socketAPI.emit("joinGroup", {
        groupID,
        username: user.username,
      });
    }
  }, [groupID, user]);

  return (
    <div
      className="flex h-[calc(100vh-10rem)] min-h-0 w-full bg-transparent  rounded-xl shadow overflow-hidden"
      style={{ maxHeight: "calc(100vh - 2rem)" }}
    >
      <div
        className="flex-1 flex flex-col min-h-0 bg-white/80 dark:bg-white/10"
        style={{ minWidth: 0 }}
      >
        {/* chatHeader for GroupChat content */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <img
              src=""
              alt="GroupPhoto"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Group Name
              </div>
              <div className="text-xs text-green-500">
                how Many people Active
              </div>
            </div>
          </div>
        </div>

        {/* ChatMessages for GroupChat content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 scrollbar-none hide-scrollbar space-y-3 mt-3">
          {/* Messages will be rendered here */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === user.username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[60%] flex items-center gap-2 ${
                  msg.sender === user.username ? "flex-row-reverse" : ""
                }`}
              >
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`px-4 py-2 rounded-2xl shadow text-sm ${
                    msg.sender === user.username
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white"
                  }`}
                >
                  {msg.message}
                  <div className="text-xs text-right mt-1 opacity-60">
                    {msg.time && (
                      <span>
                        {new Date(msg.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* ChatInput for GroupChat content */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/10">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/20 text-gray-800 dark:text-white outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-3 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
