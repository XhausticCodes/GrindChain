import React from "react";
import socketAPI from "../API/socketApi";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const CreatingGroup2 = () => {
  const { user } = useAuth();

  const [createNewGroup, setCreateNewGroup] = useState(false);
  const [joinExistingGroup, setJoinExistingGroup] = useState(false);
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    groupImage: null,
    admin: "",
  });

  const handleCreateNewGroup = () => {
    setCreateNewGroup(true);
  };

  const handleJoinExistingGroup = () => {
    setJoinExistingGroup(true);
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateGroup = () => {
    const { groupName, description, admin } = formData;
    if (!groupName || !description || !admin) {
      alert("Please fill in all fields.");
      return;
    }

    const groupData = {
      name: groupName,
      description,
      admin: user._id, // Assuming user._id is the admin's ID
      avatar: formData.groupImage,
    };

    socketAPI.emit()

  };

  if (createNewGroup) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
        <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
          <h1
            className="text-4xl font-bold text-yellow-400 mb-6 tracking-wider text-center"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Create a New Group
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={formData.groupName}
                onChange={handleInput}
                name="groupName"
                placeholder="Enter a name for your group"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={handleInput}
                name="description"
                placeholder="Enter a description for your group"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {/*img upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Image
                </label>
                <input
                  type="file"
                  name="groupImage"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, groupImage: e.target.files[0] })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin
                </label>
                <input
                  type="text"
                  value={user.username}
                  onChange={handleInput}
                  name="admin"
                  placeholder="Enter the admin's name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button
                onClick={() => {
                  handleCreateGroup();
                }}
                className="mt-4 w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-4 rounded-xl font-semibold shadow hover:from-amber-600 hover:to-yellow-700 transition-all text-lg"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (joinExistingGroup) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
        <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
          <h1
            className="text-4xl font-bold text-yellow-400 mb-6 tracking-wider text-center"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Join an Existing Group
          </h1>
          {/* Add form or logic to join an existing group */}
        </div>
      </div>
    );
  }

  // Default view
  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
        <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
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
              onClick={handleCreateNewGroup}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-4 rounded-xl font-semibold shadow hover:from-amber-600 hover:to-yellow-700 transition-all text-lg"
            >
              🎯 Create New Group
            </button>
            <button
              onClick={handleJoinExistingGroup}
              className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 text-white px-6 py-4 rounded-xl font-semibold shadow hover:from-yellow-700 hover:to-amber-600 transition-all text-lg"
            >
              🚀 Join Existing Group
            </button>
          </div>

          <div className="mt-6 text-center text-white/50 text-sm">
            <p>Already have a group? Use your Group ID to join instantly.</p>
            <p className="mt-1">
              Need to create one? We'll generate a unique ID for you!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatingGroup2;
