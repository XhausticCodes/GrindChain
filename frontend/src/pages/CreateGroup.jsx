import React, { useEffect, useState } from "react";
import socketAPI from "../API/socketApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const [groupID, setGroupID] = useState("");
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const createGroupKey = () => {
    setGroupID(Date.now() + Math.random());
  };

  const join = () => {
    socketAPI.emit("joinGroup", {
      groupID: groupID,
      username: user.username,
    });
    setUser((prevUser) => ({
      ...prevUser,
      groupID: groupID,
    }));
    navigate(`/chatroom/${groupID}`); // Pass groupID in state
  };

  const handleJoinGroup = () => {
    if (!groupID) {
      alert("Please enter a group ID");
      return;
    }
    join();
  };

  useEffect(() => {
    if (user.groupID)
      // If user already has a groupID, redirect to chatroom
      navigate(`/chatroom/${user.groupID}`, { replace: true });
    return;
  }, [user.groupID]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
      <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
        <h1
          className="text-4xl font-bold text-yellow-400 mb-6 tracking-wider text-center"
          style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
        >
          Create or Join a Chat Room
        </h1>
        <input
          type="text"
          placeholder="Enter group name or ID"
          value={groupID}
          onChange={(e) => setGroupID(e.target.value)}
          className="w-full px-5 py-3 mb-6 rounded-xl bg-white/10 text-white/90 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg placeholder:text-yellow-200 shadow"
        />
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={createGroupKey}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:from-amber-600 hover:to-yellow-700 transition-all text-lg"
          >
            Create Group
          </button>
          <button
            onClick={handleJoinGroup}
            className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:from-yellow-700 hover:to-amber-600 transition-all text-lg"
          >
            Join Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
