import React, { useState, useEffect, useMemo } from "react";
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
import { updateGroup as updateGroupAPI, leaveGroup as leaveGroupAPI } from "../../API/groupApi";
import { useAuth } from "../../contexts/AuthContext";

export default function ChatHeader({ selectedChat, onUpdateGroup, onLeaveGroup }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(selectedChat?.name || '');
  const [editedAvatar, setEditedAvatar] = useState(selectedChat?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [groupIdCopied, setGroupIdCopied] = useState(false);

// Check if current user is admin - be more thorough in checking
const isAdmin = useMemo(() => {
  if (!selectedChat || !user) return false;
  
  console.log('Admin check details:', {
    selectedChat: selectedChat,
    user: user,
    adminField: selectedChat.admin,
    adminsField: selectedChat.admins,
    createdBy: selectedChat.createdBy,
    userId: user._id
  });
  
  // Multiple ways to check admin status
  const adminChecks = [
    // Check single admin field
    selectedChat.admin?._id === user._id,
    selectedChat.admin === user._id,
    
    // Check admins array
    Array.isArray(selectedChat.admins) && selectedChat.admins.some(admin => 
      (typeof admin === 'string' ? admin : admin._id) === user._id
    ),
    
    // Check creator/owner fields
    selectedChat.createdBy === user._id,
    selectedChat.adminId === user._id,
    selectedChat.creator === user._id || selectedChat.ownerId === user._id,
    
    // Check isAdmin field from backend response
    selectedChat.isAdmin === true
  ];
  
  const result = adminChecks.some(check => check === true);
  console.log('Admin check result:', result, 'Individual checks:', adminChecks);
  return result;
}, [selectedChat, user]);

  // Debug logging
  console.log('ChatHeader Debug:', {
    selectedChat,
    user,
    isAdmin,
    hasSelectedChat: !!selectedChat,
    adminField: selectedChat?.admin,
    adminId: selectedChat?.admin?._id,
    userId: user?._id,
    createdBy: selectedChat?.createdBy,
    adminComparison: selectedChat?.admin?._id === user?._id
  });

  // Sync local state with props when selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      setEditedName(selectedChat.name || '');
      setEditedAvatar(selectedChat.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K');
    }
  }, [selectedChat]);

  // Get actual member count from the group data
  const memberCount = useMemo(() => {
    if (!selectedChat) return 0;
    
    // Try different possible member count fields
    return selectedChat.memberCount || 
           selectedChat.members?.length || 
           selectedChat.participants?.length || 
           (selectedChat.users ? selectedChat.users.length : 1);
  }, [selectedChat]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = editedName !== selectedChat?.name || editedAvatar !== selectedChat?.avatar;

  const handleSave = async () => {
    if (!editedName.trim()) {
      alert('Group name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      // Call the real API to update the group
      const groupIdentifier = selectedChat.joinCode || selectedChat._id || selectedChat.id;
      
      if (!groupIdentifier) {
        throw new Error('Group identifier not found');
      }

      const response = await updateGroupAPI(groupIdentifier, {
        name: editedName.trim(),
        avatar: editedAvatar
      });

      if (response.success && response.group) {
        // Update the local state through parent component
        if (onUpdateGroup) {
          onUpdateGroup({
            ...selectedChat,
            name: response.group.name,
            avatar: response.group.avatar,
            description: response.group.description
          });
        }
        setIsEditing(false);
        console.log('Group updated successfully:', response.group);
      } else {
        throw new Error(response.message || 'Update response was not successful');
      }
    } catch (error) {
      console.error('Error saving group changes:', error);
      alert('Failed to save changes: ' + (error.message || 'Unknown error occurred'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(selectedChat?.name || '');
    setEditedAvatar(selectedChat?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K');
    setIsEditing(false);
  };

  const handleLeaveGroup = async () => {
    const confirmed = window.confirm('Are you sure you want to leave this group? This action cannot be undone.');
    if (!confirmed) {
      setShowDropdown(false);
      return;
    }

    try {
      // Call the real API to leave the group
      const groupIdentifier = selectedChat.joinCode || selectedChat._id || selectedChat.id;
      
      if (!groupIdentifier) {
        throw new Error('Group identifier not found');
      }

      const response = await leaveGroupAPI(groupIdentifier);
      
      if (response.success) {
        console.log('Successfully left the group');
        
        // Call parent's leave group handler if available
        if (onLeaveGroup) {
          onLeaveGroup(selectedChat);
        }
        
        // Navigate to create group page
        navigate('/create-group', { 
          state: { message: `You have left the group "${selectedChat.name}"` }
        });
      } else {
        throw new Error(response.message || 'Failed to leave group');
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group: ' + (error.message || 'Unknown error occurred'));
    }
    
    setShowDropdown(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedAvatar(e.target.result);
      };
      reader.onerror = () => {
        alert('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const copyGroupId = async () => {
    // Try multiple possible group ID fields
    const groupId = selectedChat?.joinCode || 
                   selectedChat?._id || 
                   selectedChat?.id || 
                   selectedChat?.groupId || 
                   'Unknown';
    
    try {
      await navigator.clipboard.writeText(groupId);
      setGroupIdCopied(true);
      setTimeout(() => setGroupIdCopied(false), 2000);
      console.log('Group ID copied to clipboard:', groupId);
    } catch (err) {
      console.error('Failed to copy group ID:', err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = groupId;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setGroupIdCopied(true);
        setTimeout(() => setGroupIdCopied(false), 2000);
        console.log('Group ID copied using fallback method:', groupId);
      } catch (fallbackErr) {
        console.error('Both clipboard methods failed:', fallbackErr);
        alert('Failed to copy to clipboard. Group ID: ' + groupId);
      }
    }
  };

  // If no selectedChat, show a loading or empty state
  if (!selectedChat) {
    return (
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3 flex-1">
        {/* Avatar */}
        <div className="relative">
          <img
            src={isEditing ? editedAvatar : (selectedChat?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K')}
            alt={selectedChat?.name || 'Group'}
            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/50"
          />
          {isEditing && isAdmin && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
              <label htmlFor="avatar-upload" className="cursor-pointer p-2">
                <PhotoIcon className="w-5 h-5 text-white" />
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
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Group ID:
                </span>
                <code className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {selectedChat?.joinCode || selectedChat?._id || selectedChat?.id || selectedChat?.groupId || 'Unknown'}
                </code>
                <button
                  onClick={copyGroupId}
                  className="ml-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Copy Group ID"
                >
                  {groupIdCopied ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                {selectedChat.name}
                {isAdmin && (
                  <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-1">
            <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {memberCount} members
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
            <span className="text-xs text-green-500">Active</span>
          </div>
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
                      onClick={() => {
                        setShowDropdown(false);
                      }}
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
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-b border-gray-100 dark:border-gray-700"
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
  );
}
