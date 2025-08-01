import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PencilIcon, 
  UsersIcon, 
  CheckIcon, 
  XMarkIcon,
  PhotoIcon,
  ArrowLeftOnRectangleIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/24/outline";
import { updateGroup as updateGroupAPI, leaveGroup as leaveGroupAPI } from "../../API/groupApi";

export default function ChatHeader({ selectedChat, onUpdateGroup, onLeaveGroup }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(selectedChat?.name || '');
  const [editedAvatar, setEditedAvatar] = useState(selectedChat?.avatar || 'https://via.placeholder.com/48x48/6b7280/ffffff?text=G');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state with props when selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      setEditedName(selectedChat.name || '');
      setEditedAvatar(selectedChat.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K');
    }
  }, [selectedChat]);

  // Mock member count - in real app, this would come from props or API
  const memberCount = selectedChat?.memberCount || 3;

  // Check if there are unsaved changes
  const hasUnsavedChanges = editedName !== selectedChat?.name || editedAvatar !== selectedChat?.avatar;

  const handleSave = async () => {
    if (!editedName.trim()) return;

    setIsSaving(true);
    try {
      // Call the real API to update the group
      const response = await updateGroupAPI(selectedChat.joinCode || selectedChat.id, {
        name: editedName.trim(),
        avatar: editedAvatar
      });

      if (response.success) {
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
        alert('Group updated successfully!');
      }
    } catch (error) {
      console.error('Error saving group changes:', error);
      alert('Failed to save changes: ' + error.message);
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
      const response = await leaveGroupAPI(selectedChat.joinCode || selectedChat.id);
      
      if (response.success) {
        alert('Successfully left the group!');
        
        // Navigate to create group page
        navigate('/create-group', { 
          state: { message: `You have left the group "${selectedChat.name}"` }
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
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <label htmlFor="avatar-upload" className="cursor-pointer">
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
              />
              {hasUnsavedChanges && (
                <div className="text-xs text-yellow-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  Unsaved changes
                </div>
              )}
            </div>
          ) : (
            <div className="font-semibold text-gray-900 dark:text-white text-lg">
              {selectedChat.name}
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
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 transition-colors"
                title="Edit group"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              
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
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveGroup();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-b border-gray-100 dark:border-gray-700"
                      >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Leave Group</span>
                      </button>
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                        This action cannot be undone
                      </div>
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
