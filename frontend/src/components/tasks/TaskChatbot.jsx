import React, { useState, useRef, useEffect } from "react";
import { SparklesIcon, PaperAirplaneIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";

const TaskChatbot = ({ onTaskGenerated }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the Task Oracle! ✨ I can help you generate AI-powered tasks with detailed roadmaps. What would you like to work on?",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "Would you like to generate tasks for yourself or for your group? This will help me tailor the task assignment and analytics accordingly.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(true);
  const [groupMembers, setGroupMembers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isGroupMode) {
      fetchGroupMembers();
    }
  }, [isGroupMode]);

  const fetchGroupMembers = async () => {
    try {
      const response = await fetch('/api/groups/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success && data.group && data.group.members) {
        setGroupMembers(data.group.members);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  const handleModeSelection = (mode) => {
    setIsGroupMode(mode);
    setShowModeSelector(false);
    
    // TODO: Add admin check here - for now everyone can toggle
    // Future: Check if user.admin === true for group task creation
    
    const modeMessage = {
      id: Date.now(),
      text: mode ? "Great! I'll generate tasks for your group with assignment options." : "Perfect! I'll generate tasks specifically for you.",
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, modeMessage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const originalInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/generate-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          taskDescription: originalInput,
          duration: "2 weeks", // Default duration, AI will detect from prompt if specified
          isGroupMode: isGroupMode,
          groupMembers: isGroupMode ? groupMembers : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const actualDuration = data.data.task.duration || "2 weeks";
        const botMessage = {
          id: Date.now() + 1,
          text: `✨ Perfect! I've created "${
            data.data.task.title
          }" with a comprehensive ${actualDuration} roadmap. The task has been added to your list with ${
            data.data.task.milestones?.length || 0
          } milestones to guide your journey!`,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        onTaskGenerated(data.data.task);
      } else {
        throw new Error(data.message || "Failed to generate task");
      }
    } catch (error) {
      console.error("Task generation error:", error);

      let errorText = "🔮 The mystical energies are disturbed...";

      if (error.message.includes("AI response formatting")) {
        errorText +=
          " The oracle's message was unclear. Please try rephrasing your request.";
      } else if (error.message.includes("User session expired")) {
        errorText +=
          " Your session has expired. Please refresh and log in again.";
      } else if (error.message.includes("minimum 5 characters")) {
        errorText +=
          " Please provide more details about what you'd like to work on.";
      } else {
        errorText += ` ${error.message}. Please try again with a different approach.`;
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purple-400/10 shadow-[0_0_40px_10px_rgba(168,85,247,0.15)] rounded-2xl h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-t-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <SparklesIcon className="w-8 h-8 text-purple-400" />
            <div className="absolute inset-0 bg-purple-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Task Oracle
            </h2>
            <p className="text-sm text-gray-400">
              AI-Powered Task & Roadmap Generator
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      {showModeSelector && (
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-x border-purple-500/30 p-4">
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleModeSelection(false)}
              className="flex-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-white px-4 py-3 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">Individual Tasks</span>
              </div>
            </button>
            <button
              onClick={() => handleModeSelection(true)}
              className="flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-white px-4 py-3 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 flex">
                  <UsersIcon className="w-4 h-4" />
                </div>
                <span className="font-medium">Group Tasks</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 bg-black/20 backdrop-blur-sm border-x border-purple-500/30 p-4 overflow-y-auto scrollbar-none hide-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-white border border-purple-500/30"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-white border border-purple-500/30 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-b-2xl p-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={showModeSelector ? "Please select task mode first..." : "Describe the task you want to work on..."}
            className="flex-1 bg-black/30 border border-purple-500/30 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            disabled={loading || showModeSelector}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || showModeSelector}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskChatbot;
