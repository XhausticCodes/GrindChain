import React, { useEffect, useState } from "react";
import socketAPI from "../API/socketApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const [groupID, setGroupID] = useState("");
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const createGroupKey = () => {
    setGroupID(Date.now() + Math.random().toString(36).substring(2, 15));
  };

  const join = () => {
    socketAPI.emit("joinGroup", {
      groupID: groupID,
      username: user.username,
    });
    // setUser((prevUser) => ({
    //   ...prevUser,
    //   groupID: groupID,
    // }));
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
    <div>
      <h1>Chat Room</h1>
      <div>
        <input
          type="text"
          placeholder="Enter group name"
          value={groupID}
          onChange={(e) => setGroupID(e.target.value)}
        />
        <div>
          <button
            onClick={() => createGroupKey()}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-amber-600 hover:to-yellow-700 transition-all"
          >
            Create Group
          </button>
          <button
            onClick={() => handleJoinGroup()}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-amber-600 hover:to-yellow-700 transition-all"
          >
            Join Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
