import React from "react";

export default function ChatSidebar({ chats, selectedChat, onSelectChat }) {
  return (
    <aside className="h-full w-80 bg-white/70 dark:bg-white/10 border-r border-gray-200 dark:border-white/10 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <input
          type="text"
          placeholder="Search along chats"
          className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white outline-none"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/20 ${
              selectedChat.id === chat.id ? "bg-gray-100 dark:bg-white/20" : ""
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white truncate">
                {chat.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300 truncate">
                {chat.lastMessage}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">{chat.time}</span>
              {chat.unread > 0 && (
                <span className="mt-1 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
