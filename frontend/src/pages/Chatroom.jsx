import { useState } from "react";
import ChatSidebar from "../components/chatroom/ChatSidebar";
import ChatHeader from "../components/chatroom/ChatHeader";
import ChatMessages from "../components/chatroom/ChatMessages";
import ChatInput from "../components/chatroom/ChatInput";

const mockChats = [
  {
    id: 1,
    name: "Sarita",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "Great! Let me know what you think...",
    time: "04:46 PM",
    unread: 0,
  },
  {
    id: 2,
    name: "Dharampaal",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Yeah",
    time: "02:51 PM",
    unread: 2,
  },
  {
    id: 3,
    name: "Shobhna",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    lastMessage: "Have you seen the new movie...",
    time: "03:30 PM",
    unread: 0,
  },
  // ...more
];

const mockMessages = {
  1: [
    {
      id: 1,
      sender: "Debra L. Glen",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Hey! How's it going?",
      time: "04:40 PM",
      fromMe: false,
    },
    {
      id: 2,
      sender: "Me",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "All good! You?",
      time: "04:41 PM",
      fromMe: true,
    },
  ],
  2: [
    {
      id: 1,
      sender: "Gary N. Roache",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "What's for dinner tonight?",
      time: "02:20 PM",
      fromMe: false,
    },
    {
      id: 2,
      sender: "Me",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "I can't believe it's almost the weekend!",
      time: "02:22 PM",
      fromMe: true,
    },
    {
      id: 3,
      sender: "Kaku",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Just got a new book. Excited to start reading.",
      time: "02:25 PM",
      fromMe: false,
    },
  ],
  3: [
    {
      id: 1,
      sender: "Roberta K. Simons",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Have you seen the new movie?",
      time: "03:25 PM",
      fromMe: false,
    },
    {
      id: 2,
      sender: "Me",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Not yet! Is it good?",
      time: "03:27 PM",
      fromMe: true,
    },
  ],
};

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
      <ChatSidebar
        chats={mockChats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
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
