import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../components/chatroom/ChatSidebar";
import ChatHeader from "../components/chatroom/ChatHeader";
import ChatMessages from "../components/chatroom/ChatMessages";
import ChatInput from "../components/chatroom/ChatInput";
import GroupInfoCard from "../components/chatroom/GroupInfoCard";
import { useAuth } from "../contexts/AuthContext";
import * as groupApi from "../API/groupApi";

export default function Chatroom() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current group on component mount
  useEffect(() => {
    const loadCurrentGroup = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const response = await groupApi.getCurrentGroup();
        
        if (response.success && response.group) {
          setSelectedChat(response.group);
          // In a real app, you would load messages for this group
          setMessages([]);
        } else {
          // No current group, redirect to create group page
          setError('No group found. Please create or join a group.');
        }
      } catch (error) {
        console.error('Error loading current group:', error);
        setError('Failed to load group data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentGroup();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
        <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Loading Chat...
          </h2>
          <p className="text-white/70 text-center">
            Please wait while we load your group chat.
          </p>
        </div>
      </div>
    );
  }

  if (error || !selectedChat) {
    const handleClearGroup = async () => {
      try {
        setLoading(true);
        await groupApi.clearCurrentGroup();
        alert('Current group cleared successfully! You can now create or join a new group.');
        navigate('/create-group');
      } catch (error) {
        console.error('Error clearing group:', error);
        alert('Failed to clear group: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
        <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            No Group Found
          </h2>
          <p className="text-white/70 text-center mb-6">
            {error || "You're not currently in any group. Create or join a group to start chatting!"}
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => navigate('/create-group')}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:from-yellow-600 hover:to-amber-600 transition-all"
            >
              Create or Join Group
            </button>
            {error && (
              <button
                onClick={handleClearGroup}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:from-red-600 hover:to-red-700 transition-all"
              >
                Clear Invalid Group Data
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateGroup = async (updatedGroup) => {
    try {
      
      // Update group on backend
      const response = await groupApi.updateGroup(selectedChat.joinCode, {
        name: updatedGroup.name,
        avatar: updatedGroup.avatar,
        description: updatedGroup.description
      });
      
      if (response.success) {
        setSelectedChat(response.group);
        alert(`Group updated successfully! New name: "${response.group.name}"`);
      }
    } catch (error) {
      console.error('Error updating group:', error);
      alert('Failed to update group. Please try again.');
    }
  };

  const handleLeaveGroup = async (group) => {
    try {
      
      // Call the real API to leave the group
      const response = await groupApi.leaveGroup(group.joinCode);
      
      if (response.success) {
        alert(`Successfully left the group "${group.name}"`);
        navigate('/create-group', { 
          state: { message: `You have left the group "${group.name}"` }
        });
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group: ' + error.message);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: user?.username || "Me",
      avatar: user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fromMe: true,
    };
    
    // In a real app, you would send this message to the backend
    // For now, just add it to the local state
    setMessages(prev => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
      <div className="w-full max-w-6xl h-[80vh] flex gap-4">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/20 dark:bg-black/40 rounded-3xl shadow-2xl border border-yellow-400/30 backdrop-blur-md overflow-hidden">
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
              <ChatHeader 
                selectedChat={selectedChat} 
                onUpdateGroup={handleUpdateGroup}
                onLeaveGroup={handleLeaveGroup}
              />
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

        {/* Group Info Sidebar */}
        {showGroupInfo && (
          <div className="w-80 bg-white/20 dark:bg-black/40 rounded-3xl shadow-2xl border border-yellow-400/30 backdrop-blur-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Group Info
              </h3>
              <button
                onClick={() => setShowGroupInfo(false)}
                className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                ×
              </button>
            </div>
            <GroupInfoCard 
              group={selectedChat}
              onInviteClick={() => {
                // Handle invite functionality
                alert('Invite feature coming soon!');
              }}
            />
          </div>
        )}

        {/* Toggle Group Info Button */}
        {!showGroupInfo && (
          <button
            onClick={() => setShowGroupInfo(true)}
            className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg transition-all self-center"
            title="Show Group Info"
          >
            ℹ️
          </button>
        )}
      </div>
    </div>
  );
}
