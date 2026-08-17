"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Save, Bell, Shield, Globe, Loader2, CheckCircle2, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/v1/user/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setName(data.data.name || "");
          setBio(data.data.bio || "");
          setEmail(data.data.email || "");
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/v1/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 w-full">
      <div className="border-b border-[#1E2433] pb-6">
        <span className="badge-pill mb-2">Module 1 — User Management</span>
        <h1 className="text-3xl font-extrabold text-white">Account Settings & Profile</h1>
        <p className="text-gray-400 text-sm">Manage personal information, API keys, and notification preferences.</p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" /> Personal Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0D14] border border-gray-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Email</label>
            <input
              type="email"
              value="alex.rivera@example.com"
              disabled
              className="w-full bg-[#0A0D14] border border-gray-800 text-gray-500 text-xs px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Professional Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-[#0A0D14] border border-gray-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Changes saved successfully
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-electric text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
          </button>
        </div>
        <button className="text-xs text-rose-400 hover:underline flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> Request 30-Day Account Deletion...
        </button>
      </div>
    </div>
  );
}
