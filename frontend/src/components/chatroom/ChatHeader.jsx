import React from "react";

export default function ChatHeader({ selectedChat }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3">
        <img
          src={selectedChat.avatar}
          alt={selectedChat.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {selectedChat.name}
          </div>
          <div className="text-xs text-green-500">Active</div>
        </div>
      </div>
    </div>
  );
}
