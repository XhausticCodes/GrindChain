import { useState } from "react";
import ChatSidebar from "../components/chatroom/ChatSidebar";
import ChatHeader from "../components/chatroom/ChatHeader";
import ChatMessages from "../components/chatroom/ChatMessages";
import ChatInput from "../components/chatroom/ChatInput";
import { mockChats } from "../assets/mockChats";
import { mockMessages } from "../assets/mockMessages";


export default function Chatroom() {
  const [selectedChat, setSelectedChat] = useState(mockChats[1]);
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
    <div
      className="flex h-[calc(100vh-10rem)] min-h-0 w-full bg-transparent rounded-xl shadow overflow-hidden"
      style={{ maxHeight: "calc(100vh - 2rem)" }}
    >
      {/* <ChatSidebar
        chats={mockChats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      /> */}
      <section
        className="flex-1 flex flex-col min-h-0 bg-white/80 dark:bg-white/10"
        style={{ minWidth: 0 }}
      >
        <ChatHeader selectedChat={selectedChat} />
        <ChatMessages
          messages={messages}
          className="flex-1 min-h-0 overflow-y-auto pb-3"
        />
        <ChatInput input={input} setInput={setInput} onSend={handleSend} />
      </section>
    </div>
  );
}
