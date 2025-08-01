import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import GroupJoinDialog from "../components/chatroom/GroupJoinDialog";
import * as groupApi from "../API/groupApi";

const CreateGroup = () => {
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('join');
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a message from leaving a group
  const leaveMessage = location.state?.message;

  // Open dialog for creating a group
  const handleCreateGroup = () => {
    setDialogMode('create');
    setShowJoinDialog(true);
  };

  // Open dialog for joining a group
  const handleJoinGroup = () => {
    setDialogMode('join');
    setShowJoinDialog(true);
  };

  useEffect(() => {
    if (user.groupID)
      // If user already has a groupID, redirect to chatroom
      navigate(`/chatroom`, { replace: true });
    return;
  }, [user.groupID]);

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
        <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
          {/* Show leave group message if available */}
          {leaveMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-center text-sm">
              {leaveMessage}
            </div>
          )}
          
          <h1
            className="text-4xl font-bold text-yellow-400 mb-6 tracking-wider text-center"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Create or Join a Chat Room
          </h1>
          
          <p className="text-white/70 text-center mb-8 text-lg">
            Connect with your study buddies and achieve your goals together!
          </p>

          <div className="flex flex-col gap-4 w-full justify-center">
            <button
              onClick={handleCreateGroup}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-4 rounded-xl font-semibold shadow hover:from-amber-600 hover:to-yellow-700 transition-all text-lg"
            >
              🎯 Create New Group
            </button>
            <button
              onClick={handleJoinGroup}
              className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 text-white px-6 py-4 rounded-xl font-semibold shadow hover:from-yellow-700 hover:to-amber-600 transition-all text-lg"
            >
              🚀 Join Existing Group
            </button>
          </div>

          <div className="mt-6 text-center text-white/50 text-sm">
            <p>Already have a group? Use your Group ID to join instantly.</p>
            <p className="mt-1">Need to create one? We'll generate a unique ID for you!</p>
          </div>
        </div>
      </div>
      
      {/* Group Join Dialog */}
      <GroupJoinDialog
        isOpen={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        mode={dialogMode}
      />
    </>
  );
};

export default CreateGroup;
