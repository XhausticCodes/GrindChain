import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import AvatarCard from "../components/profile/AvatarCard";
import AboutSection from "../components/profile/AboutSection";
import EditProfileForm from "../components/profile/EditProfileForm";
import ToastNotification from "../components/profile/ToastNotification";

const Profile = () => {
  const { user, loading, updateProfile } = useAuth();
  const [form, setForm] = useState({
    email: user?.email || "",
    description: user?.description || "",
    avatar: user?.avatar || "",
  });
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setForm({
      email: user?.email || "",
      description: user?.description || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (!user) return <div className="text-white p-8">No user data found.</div>;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfile({
      description: form.description,
      avatar: form.avatar,
    });
    setSaving(false);
    if (result.success) {
      setForm((f) => ({ ...f, avatar: "", description: "" }));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <>
      <ToastNotification show={showToast} message="Profile updated!" />
      <div className="w-full h-full min-h-0 min-w-0 flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-0 bg-transparent">
        {/* Left: Avatar (top) and Description (bottom) */}
        <div className="flex flex-col h-full w-full">
          <AvatarCard avatar={form.avatar} username={user.username} />
          <AboutSection
            username={user.username}
            description={form.description}
          />
        </div>
        {/* Right: Edit Form (spans both quarters) */}
        <div className="flex flex-col justify-center items-center h-full w-full bg-transparent p-6 md:p-12 row-span-2">
          <EditProfileForm
            form={form}
            setForm={setForm}
            saving={saving}
            onSave={handleSave}
            user={user}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
