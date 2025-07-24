import React from "react";

const EditProfileForm = ({ form, setForm, saving, onSave, user }) => (
  <div className="blur-theme rounded-2xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center border border-white/10">
    <h2
      className="text-2xl font-bold text-yellow-400 mb-4 tracking-wider"
      style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
    >
      Edit Profile
    </h2>
    <form className="w-full flex flex-col gap-4" onSubmit={onSave}>
      <div>
        <label className="block text-white/80 text-sm mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          className="w-full px-4 py-2 bg-black/20 text-white/80 border border-white/10 rounded focus:outline-none cursor-not-allowed"
          disabled
        />
      </div>
      <div>
        <label className="block text-white/80 text-sm mb-1">Avatar URL</label>
        <input
          type="text"
          value={form.avatar}
          onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
          className="w-full px-4 py-2 bg-black/20 text-white/80 border border-white/10 rounded focus:outline-none"
          placeholder="Paste image URL..."
        />
      </div>
      <div>
        <label className="block text-white/80 text-sm mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full px-4 py-3 bg-black/20 text-white/80 border border-white/10 rounded min-h-[120px] resize-none focus:outline-none text-base"
          placeholder="Tell us about yourself..."
          rows={5}
        />
      </div>
      <div className="flex gap-4">
        <div className="bg-black/30 rounded-lg px-4 py-2 text-yellow-300 text-center flex-1">
          <div className="text-xs">Streak</div>
          <div className="text-lg font-bold">{user.streak || 0}🔥</div>
        </div>
        <div className="bg-black/30 rounded-lg px-4 py-2 text-yellow-300 text-center flex-1">
          <div className="text-xs">Last Check-in</div>
          <div className="text-lg font-bold">
            {user.lastCheckinDate
              ? new Date(user.lastCheckinDate).toLocaleDateString()
              : "Never"}
          </div>
        </div>
        <div className="bg-black/30 rounded-lg px-4 py-2 text-yellow-300 text-center flex-1">
          <div className="text-xs">Groups</div>
          <div className="text-lg font-bold">{user.groups?.length || 0}</div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-2 px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold shadow hover:from-yellow-600 hover:to-amber-700 transition-all disabled:opacity-60 cursor-pointer"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  </div>
);

export default EditProfileForm;
