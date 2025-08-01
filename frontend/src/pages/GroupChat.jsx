import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import socketAPI from "../API/socketApi";
import * as groupApi from "../API/groupApi";
import ChatHeader from "../components/chatroom/ChatHeader";

const GroupChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId: paramGroupId } = useParams();
  const [searchParams] = useSearchParams();

  const [groupData, setGroupData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get group ID from URL params or search params
  const urlGroupId = paramGroupId || searchParams.get('groupId');

  // Load current group on component mount
  useEffect(() => {
    const loadCurrentGroup = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        
        // If there's a group ID in the URL, try to join that group first
        if (urlGroupId) {
          try {
            const joinResponse = await groupApi.createOrJoinGroup(urlGroupId, false);
            if (joinResponse.success) {
              setGroupData(joinResponse.group);
              setMessages([]);
              setLoading(false);
              
              // Update URL to clean format
              const newUrl = `/chatroom?groupId=${joinResponse.group.joinCode}`;
              if (location.pathname + location.search !== newUrl) {
                window.history.replaceState(null, '', newUrl);
              }
              return;
            }
          } catch (urlError) {
            console.error('Failed to join group from URL:', urlError);
            // Continue to load current group if URL group fails
          }
        }
        
        // Load user's current group
        const response = await groupApi.getCurrentGroup();
        
        if (response.success && response.group) {
          setGroupData(response.group);
          
          // Update URL to include group ID without triggering navigation
          const newUrl = `/chatroom?groupId=${response.group.joinCode}`;
          if (location.pathname + location.search !== newUrl) {
            window.history.replaceState(null, '', newUrl);
          }
          
          // In a real app, you would load messages for this group
          setMessages([]);
        } else {
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
  }, [user, navigate, urlGroupId, location]);

  const sendMessage = () => {
    if (currentMessage.trim() && groupData) {
      const newMessage = {
        id: Date.now() + Math.random(),
        sender: user.username,
        avatar: user.avatar,
        message: currentMessage,
        time: new Date().toISOString(),
      };
      
      // Add message to local state immediately
      setMessages(prev => [...prev, newMessage]);
      
      // Send via socket
      socketAPI.emit("sendMessage", {
        groupID: groupData.joinCode,
        ...newMessage,
        username: user.username,
      });
      
      setCurrentMessage("");
    }
  };

  const handleUpdateGroup = async (updatedGroup) => {
    try {
      
      // Update group on backend
      const response = await groupApi.updateGroup(groupData.joinCode, {
        name: updatedGroup.name,
        avatar: updatedGroup.avatar,
        description: updatedGroup.description
      });
      
      if (response.success) {
        setGroupData(response.group);
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
    return () => {
      socketAPI.off("receiveMessage", handleMessageReceived);
    };
  }, []);

  useEffect(() => {
    if (groupData?.joinCode && user?.username) {
      socketAPI.emit("joinGroup", {
        groupID: groupData.joinCode,
        username: user.username,
      });
    }
  }, [groupData, user]);

  // Loading state
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

  // Error state
  if (error || !groupData) {
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

    const handleDebugGroups = async () => {
      try {
        const response = await groupApi.getAllGroups();
        alert(`Found ${response.groups.length} groups. Check console for details.`);
      } catch (error) {
        console.error('Error getting all groups:', error);
        alert('Failed to get groups: ' + error.message);
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
            <button
              onClick={handleClearGroup}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:from-red-600 hover:to-red-700 transition-all"
            >
              Clear User Group Data
            </button>
            <button
              onClick={handleDebugGroups}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Debug: Check All Groups
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex blur-theme2 rounded-tl-3xl">
      <div className="w-full h-[89vh] flex flex-coldark:bg-black/40 rounded-tl-3xl shadow-2xl border border-yellow-400/30 overflow-hidden">
        <section
          className="flex-1 flex flex-col min-h-0"
          style={{ minWidth: 0 }}
        >
          {/* Enhanced chatHeader for GroupChat content */}
          <div className="px-8 pt-6 pb-2 bg-gradient-to-r from-yellow-400/30 to-yellow-400/10 rounded-tl-3xl shadow-sm">
            <ChatHeader 
              selectedChat={groupData}
              onUpdateGroup={handleUpdateGroup}
              onLeaveGroup={handleLeaveGroup}
            />
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
