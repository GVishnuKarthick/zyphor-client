import { useState } from "react";
import { X, LogOut, Edit3, Bell, User } from "lucide-react";
import Modal from "../common/Modal";
import Avatar from "../common/Avatar";
import Toggle from "../common/Toggle";
import Divider from "../common/Divider";

export default function SettingsModal({ open, onClose, currentUser, onLogout, onSave }) {
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [ne, setNe] = useState(true);
  const [np, setNp] = useState(true);
  const [pm, setPm] = useState(false);
  const [tab, setTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", Icon: User },
    { id: "notifications", label: "Notifications", Icon: Bell }
  ];

  return (
    <Modal open={open} onClose={onClose} width={760}>
      <div className="relative flex flex-col md:flex-row min-h-[580px] bg-[#0d0d0d]">
        
        {/* Navigation Sidebar/Top Scroll */}
        <div className="flex w-full shrink-0 flex-row overflow-x-auto no-scrollbar border-b border-zinc-900 bg-black px-3 py-3 md:w-52 md:flex-col md:border-b-0 md:border-r md:px-4 md:py-8 gap-1.5">
          <div className="mb-4 hidden px-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 md:block">
            Settings
          </div>

          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-bold md:font-medium transition-all ${
                tab === id 
                ? "bg-zinc-800 text-white shadow-lg ring-1 ring-zinc-700" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              }`}
            >
              <Icon size={16} className={tab === id ? "text-white" : "text-zinc-600"} />
              <span className="capitalize">{label}</span>
            </button>
          ))}

          <div className="hidden md:block flex-1" />

          <button
            onClick={onLogout}
            className="flex items-center gap-3 rounded-xl border border-red-900/20 bg-red-950/10 px-4 py-3 text-[13px] font-bold text-red-500 hover:bg-red-950/20 transition-all active:scale-95"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 no-scrollbar relative flex flex-col">
          
          <button 
            onClick={onClose} 
            className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors z-10"
          >
            <X size={18} />
          </button>

          <div className="flex-1">
            {tab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-center md:text-left">
                <h2 className="mb-1 text-xl font-black tracking-tight text-white uppercase">Profile Settings</h2>
                <p className="mb-8 text-xs font-medium text-zinc-500">Manage your presence on Zyphor</p>

                {/* Full Width User Card */}
                <div className="mb-10 overflow-hidden rounded-[24px] border border-zinc-800 bg-zinc-900/30 flex flex-col">
                  {/* Subtle Top Accent */}
                  <div className="h-24 w-full bg-gradient-to-r from-zinc-800/50 to-zinc-900/50" />
                  
                  <div className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-center md:items-end gap-6">
                    <div className="relative group shrink-0 mx-auto md:mx-0">
                      <Avatar 
                        src={currentUser.profileImageUrl} 
                        initials={currentUser.avatar} 
                        sz={110} 
                        ring 
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-2 border-transparent group-hover:border-white shadow-xl">
                         <Edit3 size={24} className="text-white" />
                      </div>
                    </div>

                    <div className="flex-1 mb-2 md:mb-1 text-center md:text-left">
                      <div className="text-2xl font-black text-white tracking-tighter">{currentUser.username}</div>
                      <div className="text-sm font-mono text-zinc-500 mb-4">{currentUser.email}</div>
                      
                      <button className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:bg-zinc-100 hover:text-black transition-all active:scale-95 shadow-lg">
                        <Edit3 size={12} />
                        Change Profile Photo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-zinc-100 transition-colors">Your Username</label>
                    <input 
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none focus:border-zinc-600 focus:bg-black transition-all font-mono"
                       placeholder="Enter username"
                    />
                  </div>

                  <div className="group flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-zinc-100 transition-colors">Public Bio</label>
                    <textarea 
                       value={bio}
                       onChange={(e) => setBio(e.target.value)}
                       className="min-h-[120px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-sm leading-relaxed text-white outline-none focus:border-zinc-600 focus:bg-black transition-all font-mono"
                       placeholder="Say something about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {tab === "notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="mb-1 text-xl font-black tracking-tight text-white uppercase">Notifications</h2>
                <p className="mb-8 text-xs font-medium text-zinc-500">Pick where you want to be notified</p>

                <div className="space-y-1">
                  <Toggle value={ne} onChange={setNe} label="Email Notifications" sub="Receive updates in your inbox" />
                  <Divider />
                  <Toggle value={np} onChange={setNp} label="Push Notifications" sub="Desktop and mobile alerts" />
                  <Divider />
                  <Toggle value={pm} onChange={setPm} label="Private Messages" sub="Never miss a message" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto py-6">
            <button
              onClick={() => {
                onSave({ username, bio });
                onClose();
              }}
              className="w-full rounded-2xl bg-zinc-100 py-4 text-[13px] font-black uppercase tracking-[0.15em] text-black shadow-xl transition-all hover:scale-[1.02] active:scale-95 shadow-zinc-100/10"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}