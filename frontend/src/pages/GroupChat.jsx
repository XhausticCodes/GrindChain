import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import socketAPI from "../API/socketApi";

const GroupChat = () => {
  const { user } = useAuth();

  const [groupID] = useState(user.groupID || null);
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
    <div className="min-h-screen w-full flex blur-theme2 rounded-tl-3xl">
      <div className="w-full h-[89vh] flex flex-coldark:bg-black/40 rounded-tl-3xl shadow-2xl border border-yellow-400/30 overflow-hidden">
        <section
          className="flex-1 flex flex-col min-h-0"
          style={{ minWidth: 0 }}
        >
          {/* chatHeader for GroupChat content */}
          <div className="px-8 pt-6 pb-2 bg-gradient-to-r from-yellow-400/30 to-yellow-400/10 rounded-tl-3xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src=""
                alt="GroupPhoto"
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 bg-yellow-100"
              />
              <div>
                <div
                  className="font-bold text-xl text-yellow-700 dark:text-yellow-300 tracking-wider"
                  style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
                >
                  HACKAHOLICS
                </div>
                <div className="text-xs text-green-500 font-semibold">
                  2 people active
                </div>
              </div>
            </div>
          </div>
          {/* ChatMessages for GroupChat content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-8 py-4 scrollbar-none hide-scrollbar space-y-3 mt-3 ">
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
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 bg-yellow-100"
                  />
                  <div
                    className={`px-4 py-2 rounded-2xl shadow text-base font-medium ${
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
          <div className="flex items-center gap-2 px-8 pb-6 pt-2 bg-gradient-to-t from-yellow-400/10 to-transparent border-t border-yellow-400/10">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-5 py-3 rounded-full bg-white/60 dark:bg-white/20 text-gray-800 dark:text-white outline-none text-lg shadow border border-yellow-400/20"
            />
            <button
              onClick={sendMessage}
              className="px-5 py-3 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white text-xl shadow-lg transition-all"
            >
              ➤
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GroupChat;
