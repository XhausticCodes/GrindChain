import React from "react";

export default function ChatMessages({ messages, className }) {
  // Add 'scrollbar-none' to hide scrollbar if using Tailwind, otherwise fallback to custom CSS
  const combinedClass =
    (className || "flex-1 min-h-0 overflow-y-auto px-6 py-4") +
    " scrollbar-none hide-scrollbar space-y-3 mt-3";
  return (
    <div className={combinedClass}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[60%] flex items-end gap-2 ${
              msg.fromMe ? "flex-row-reverse" : ""
            }`}
          >
            <img
              src={msg.avatar}
              alt={msg.sender}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div
              className={`px-4 py-2 rounded-2xl shadow text-sm ${
                msg.fromMe
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white"
              }`}
            >
              {msg.text}
              <div className="text-xs text-right mt-1 opacity-60">
                {msg.time}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
