import React from "react";

export default function ChatInput({ input, setInput, onSend }) {
  return (
    <form
      onSubmit={onSend}
      className="flex items-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/10"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/20 text-gray-800 dark:text-white outline-none"
      />
      <button
        type="submit"
        className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
      >
        <span role="img" aria-label="send">
          ➤
        </span>
      </button>
    </form>
  );
}
