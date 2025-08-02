import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import socketAPI from "../API/socketApi";
import { useNavigate } from "react-router-dom";
import { 
  PencilIcon, 
  UsersIcon, 
  CheckIcon, 
  XMarkIcon,
  PhotoIcon,
  ArrowLeftOnRectangleIcon,
  EllipsisVerticalIcon,
  ClipboardDocumentIcon
} from "@heroicons/react/24/outline";
import { updateGroup as updateGroupAPI, leaveGroup as leaveGroupAPI, getCurrentGroup } from "../API/groupApi";

const GroupChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Group state
  const [groupData, setGroupData] = useState(null);
  const [groupID, setGroupID] = useState(user.groupID || null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // Header editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [groupIdCopied, setGroupIdCopied] = useState(false);

  // Check if current user is admin
  const isAdmin = useMemo(() => {
    if (!groupData || !user) return false;
    
    // First check if backend already determined admin status
    if (typeof groupData.isAdmin === 'boolean') {
      return groupData.isAdmin;
    }
    
    // Fallback to frontend admin checks
    const adminChecks = [
      groupData.admin?._id === user._id,
      groupData.admin === user._id,
      groupData.createdBy === user._id,
      groupData.adminId === user._id,
      groupData.creator === user._id,
      groupData.ownerId === user._id
    ];
    
    return adminChecks.some(check => check === true);
  }, [groupData, user]);

  // Get member count
  const memberCount = useMemo(() => {
    if (!groupData) return 1;
    return groupData.memberCount || 
           groupData.members?.length || 
           groupData.participants?.length || 
           1;
  }, [groupData]);

  // Check for unsaved changes
  const hasUnsavedChanges = editedName !== groupData?.name || editedAvatar !== groupData?.avatar;

  // Load group data
  useEffect(() => {
    const loadGroupData = async () => {
      if (groupID) {
        try {
          const response = await getCurrentGroup(groupID);
          if (response.success && response.group) {
            setGroupData(response.group);
            setEditedName(response.group.name || '');
            setEditedAvatar(response.group.avatar || '');
          }
        } catch (error) {
          console.error('Error loading group data:', error);
          
          // Fallback for offline mode - create mock data
          if (error.message?.includes('Failed to fetch') || error.code === 'ECONNREFUSED') {
            console.log('🔧 Using offline mode with mock data');
            const mockGroup = {
              id: 'offline-group',
              _id: 'offline-group', 
              name: 'Offline Demo Group',
              joinCode: groupID || 'OFFLINE123',
              avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiNlZjQ0NDQiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+T0ZGPC90eHQ+Cjwvc3ZnPgo=',
              description: 'Demo group for offline testing',
              memberCount: 1,
              members: [{ _id: user._id, username: user.username }],
              admin: user._id,
              isAdmin: true,
              createdAt: new Date().toISOString()
            };
            
            setGroupData(mockGroup);
            setEditedName(mockGroup.name);
            setEditedAvatar(mockGroup.avatar);
          }
        }
      }
    };
    loadGroupData();
  }, [groupID, user]);

  // Handle saving group changes
  const handleSave = async () => {
    if (!editedName.trim()) {
      alert('Group name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const groupIdentifier = groupData.joinCode || groupData._id || groupData.id;
      
      const response = await updateGroupAPI(groupIdentifier, {
        name: editedName.trim(),
        avatar: editedAvatar
      });

      if (response.success && response.group) {
        setGroupData(response.group);
        setIsEditing(false);
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.textContent = '✅ Group updated successfully!';
        successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
        document.body.appendChild(successMsg);
        setTimeout(() => {
          successMsg.style.opacity = '0';
          setTimeout(() => document.body.removeChild(successMsg), 300);
        }, 2000);
        
        console.log('Group updated successfully');
      }
    } catch (error) {
      console.error('Error saving group changes:', error);
      alert('Failed to save changes: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(groupData?.name || '');
    setEditedAvatar(groupData?.avatar || '');
    setIsEditing(false);
  };

  const handleLeaveGroup = async () => {
    const confirmed = window.confirm('Are you sure you want to leave this group? This action cannot be undone.');
    if (!confirmed) {
      setShowDropdown(false);
      return;
    }

    try {
      const groupIdentifier = groupData.joinCode || groupData._id || groupData.id;
      const response = await leaveGroupAPI(groupIdentifier);
      
      if (response.success) {
        navigate('/create-group', { 
          state: { message: `You have left the group "${groupData.name}"` }
        });
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group: ' + error.message);
    }
    
    setShowDropdown(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => setEditedAvatar(e.target.result);
      reader.onerror = () => alert('Failed to read the image file.');
      reader.readAsDataURL(file);
    }
  };

  const copyGroupId = async () => {
    const groupId = groupData?.joinCode || groupData?._id || groupData?.id || 'Unknown';
    
    try {
      await navigator.clipboard.writeText(groupId);
      setGroupIdCopied(true);
      setTimeout(() => setGroupIdCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy group ID:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = groupId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setGroupIdCopied(true);
      setTimeout(() => setGroupIdCopied(false), 2000);
    }
  };

  const sendMessage = () => {
    // Logic to send message
    if (currentMessage.trim()) {
      const newMessage = {
        id: Date.now() + Math.random(),
        sender: user.username,
        avatar: user.avatar,
        message: currentMessage,
        time: new Date().toISOString(),
      };
      socketAPI.emit("sendMessage", {
        groupID,
        ...newMessage,
        username: user.username,
      });
      setCurrentMessage("");
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
    if (groupID && user?.username) {
      socketAPI.emit("joinGroup", {
        groupID,
        username: user.username,
      });
    }
  }, [groupID, user]);

  // Default avatar
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K';

  return (
    <div
      className="flex h-[calc(100vh-10rem)] min-h-0 w-full bg-transparent rounded-xl shadow overflow-hidden"
      style={{ maxHeight: "calc(100vh - 2rem)" }}
    >
      <div
        className="flex-1 flex flex-col min-h-0 bg-white/80 dark:bg-white/10"
        style={{ minWidth: 0 }}
      >
        {/* Enhanced Chat Header with Admin Features */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="relative">
              <img
                src={isEditing ? editedAvatar : (groupData?.avatar || defaultAvatar)}
                alt={groupData?.name || 'Group'}
                className={`w-12 h-12 rounded-full object-cover border-2 transition-all ${
                  isEditing && hasUnsavedChanges 
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' 
                    : 'border-yellow-400/50'
                }`}
              />
              {isEditing && isAdmin && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                  <label htmlFor="avatar-upload" className="cursor-pointer p-2 flex flex-col items-center">
                    <PhotoIcon className="w-5 h-5 text-white mb-1" />
                    <span className="text-xs text-white font-medium">Change</span>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
              {hasUnsavedChanges && isEditing && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white animate-pulse">
                  <span className="sr-only">Unsaved changes</span>
                </div>
              )}
            </div>

            {/* Group Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="font-semibold text-gray-900 dark:text-white bg-transparent border-b border-yellow-400 focus:outline-none focus:border-yellow-500 text-lg w-full"
                    autoFocus
                    maxLength={30}
                    placeholder="Enter group name"
                    disabled={!isAdmin}
                  />
                  
                  {/* Group ID Display in Edit Mode */}
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Group ID:
                    </span>
                    <code className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded flex-1">
                      {groupData?.joinCode || groupData?._id || groupData?.id || 'Loading...'}
                    </code>
                    <button
                      onClick={copyGroupId}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                      title={groupIdCopied ? "Copied!" : "Copy Group ID"}
                    >
                      {groupIdCopied ? (
                        <>
                          <CheckIcon className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-500 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {hasUnsavedChanges && (
                    <div className="text-xs text-yellow-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                      Unsaved changes
                    </div>
                  )}
                  
                  {!isAdmin && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Only admins can edit group details
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-lg">
                    {groupData?.name || 'Group Name'}
                    {isAdmin && (
                      <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {memberCount} members
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                    <span className="text-xs text-green-500">Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Controls */}
            <div className="flex items-center gap-2 relative">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={!editedName.trim() || isSaving}
                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Save changes"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    title="Cancel"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 transition-colors"
                      title="Edit group"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Dropdown Menu Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(!showDropdown);
                      }}
                      className="p-2 rounded-lg bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30 transition-colors border border-gray-300 dark:border-gray-600"
                      title="More options"
                    >
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <>
                        {/* Click outside overlay */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowDropdown(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                          {/* Copy Group ID Option */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyGroupId();
                              setShowDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
                          >
                            <ClipboardDocumentIcon className="w-5 h-5" />
                            <div>
                              <span className="text-sm font-medium">Copy Group ID</span>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Share with others to join
                              </div>
                            </div>
                          </button>
                          
                          {/* Leave Group Option */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeaveGroup();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            <div>
                              <span className="text-sm font-medium">Leave Group</span>
                              <div className="text-xs text-red-500 dark:text-red-400">
                                This action cannot be undone
                              </div>
                            </div>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ChatMessages for GroupChat content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 scrollbar-none hide-scrollbar space-y-3 mt-3">
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
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`px-4 py-2 rounded-2xl shadow text-sm ${
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
        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/10">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/20 text-gray-800 dark:text-white outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-3 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;