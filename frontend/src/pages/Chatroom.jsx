import { useState } from "react";
import ChatSidebar from "../components/chatroom/ChatSidebar";
import ChatHeader from "../components/chatroom/ChatHeader";
import ChatMessages from "../components/chatroom/ChatMessages";
import ChatInput from "../components/chatroom/ChatInput";
import { mockChats } from "../assets/mockChats";
import { mockMessages } from "../assets/mockMessages";

export default function Chatroom() {
  const [selectedChat] = useState(mockChats[1]);
  const [messagesByChat, setMessagesByChat] = useState(mockMessages);
  const [input, setInput] = useState("");

  const messages = messagesByChat[selectedChat.id] || [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: "Me",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fromMe: true,
    };
    setMessagesByChat((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
    }));
    setInput("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
      <div className="w-full max-w-3xl h-[80vh] flex flex-col bg-white/20 dark:bg-black/40 rounded-3xl shadow-2xl border border-yellow-400/30 backdrop-blur-md overflow-hidden">
        {/* <ChatSidebar
          chats={mockChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        /> */}
        <section
          className="flex-1 flex flex-col min-h-0"
          style={{ minWidth: 0 }}
        >
          <div className="px-8 pt-6 pb-2 bg-gradient-to-r from-yellow-400/30 to-amber-400/10 rounded-t-3xl shadow-sm">
            <ChatHeader selectedChat={selectedChat} />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-8 py-4">
            <ChatMessages
              messages={messages}
              className="flex-1 min-h-0 overflow-y-auto pb-3"
            />
          </div>
          <div className="px-8 pb-6 pt-2 bg-gradient-to-t from-yellow-400/10 to-transparent rounded-b-3xl">
            <ChatInput input={input} setInput={setInput} onSend={handleSend} />
          </div>
        </section>
      </div>
    </div>
  );
}
