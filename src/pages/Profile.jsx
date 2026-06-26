import React, { useEffect, useState, useRef } from "react";
import {
  CheckCircle, XCircle, Camera, User, Mail, Phone,
  Edit, Save, X, Loader2, Check,
} from "lucide-react";
import { API_BASE_URL } from "../utils/config";
import { useDispatch } from "react-redux";
import { updateUser } from "../utils/userSlice";

const Profile = () => {
  const getAuthToken = () =>
    localStorage.getItem("userToken") || localStorage.getItem("authToken");

  const [profile, setProfile] = useState({
    avatar: null,
    fullName: "",
    username: "",
    email: "",
    isEmailVerified: false,
    phone_number: "",
    role_name: "",
    profile_pic: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        if (!token) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/user/getProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok || !data.success)
          throw new Error(data.message || "Failed to load profile");

        const user = data.user;
        const profilePicUrl = user.profile_pic
          ? user.profile_pic.startsWith("http")
            ? user.profile_pic
            : `${API_BASE_URL}/uploads/${user.profile_pic}`
          : null;

        setProfile({
          avatar: null,
          fullName: user.name || "",
          username: user.username || "",
          email: user.email || "",
          isEmailVerified: true,
          phone_number: user.phone_number || "",
          role_name: user.role_name || "",
          profile_pic: user.profile_pic || null,
        });
        setPreview(profilePicUrl);
        localStorage.setItem("userProfilePic", profilePicUrl || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  const handleChange = (e) =>
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = getAuthToken();
      if (!token) throw new Error("Not authorized");

      const formData = new FormData();
      formData.append("name", profile.fullName);
      formData.append("username", profile.username);
      formData.append("email", profile.email);
      formData.append("phone_number", profile.phone_number);
      if (profile.avatar instanceof File)
        formData.append("profile_pic", profile.avatar);

      const response = await fetch(`${API_BASE_URL}/user/updateUser`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to update profile");

      const updatedUser = data.updatedUser || data.user || {};
      const newPicUrl = updatedUser.profile_pic
        ? updatedUser.profile_pic.startsWith("http")
          ? updatedUser.profile_pic
          : `${API_BASE_URL}/uploads/${updatedUser.profile_pic}`
        : preview;

      setProfile((prev) => ({
        ...prev,
        fullName: updatedUser.name || prev.fullName,
        username: updatedUser.username || prev.username,
        email: updatedUser.email || prev.email,
        phone_number: updatedUser.phone_number || prev.phone_number,
        profile_pic: updatedUser.profile_pic || prev.profile_pic,
      }));
      setPreview(newPicUrl);
      localStorage.setItem("userProfilePic", newPicUrl || "");

      dispatch(
        updateUser({
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          profile_pic: updatedUser.profile_pic,
        })
      );

      setShowModal(true);
      setIsEditing(false);
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-[#F7F6F3]">
        <Loader2 className="w-6 h-6 animate-spin text-[#534AB7]" />
        <p className="ml-3 text-sm text-gray-500 font-medium tracking-wide">
          Loading profile…
        </p>
      </main>
    );
  }

  const fields = [
    { label: "Full name", name: "fullName", type: "text" },
    { label: "Username", name: "username", type: "text" },
    { label: "Email address", name: "email", type: "email" },
    { label: "Phone number", name: "phone_number", type: "tel" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .pf-serif { font-family: 'DM Serif Display', serif; }
        .pf-sans  { font-family: 'DM Sans', sans-serif; }

        .pf-input-line {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #E5E3DC;
          padding: 6px 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1C1B18;
          outline: none;
          transition: border-color 0.2s;
        }
        .pf-input-line[readonly] {
          cursor: default;
          color: #1C1B18;
        }
        .pf-input-line:not([readonly]) {
          border-bottom-color: #534AB7;
        }
        .pf-input-line:not([readonly]):focus {
          border-bottom-color: #3C3489;
        }

        .pf-btn-save {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          background: #534AB7;
          color: #EEEDFE;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .pf-btn-save:hover   { opacity: 0.87; }
        .pf-btn-save:active  { transform: scale(0.97); }
        .pf-btn-save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pf-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: transparent;
          color: #888780;
          border: 1px solid #D3D1C7;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          transition: background 0.15s;
        }
        .pf-btn-ghost:hover { background: #F1EFE8; }

        .pf-btn-edit {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          background: transparent;
          color: #444441;
          border: 1px solid #D3D1C7;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .pf-btn-edit:hover  { background: #F1EFE8; }
        .pf-btn-edit:active { transform: scale(0.97); }

        .pf-modal-ok {
          width: 100%;
          padding: 9px 0;
          background: #534AB7;
          color: #EEEDFE;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
          margin-top: 8px;
        }
        .pf-modal-ok:hover { opacity: 0.87; }
      `}</style>

      <main className="min-h-screen bg-[#F7F6F3] p-6 md:p-10 pf-sans">
        <div className="max-w-4xl mx-auto">

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-[#FCEBEB] text-[#791F1F] text-sm border border-[#F09595]">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-[240px_1fr] gap-5">

            {/* ── Sidebar ── */}
            <div className="bg-white rounded-2xl border border-[#E5E3DC] p-6 flex flex-col items-center">

              {/* Avatar */}
              <div className="relative mb-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-[84px] h-[84px] rounded-full object-cover border-2 border-[#D3D1C7]"
                  />
                ) : (
                  <div className="w-[84px] h-[84px] rounded-full bg-[#EEEDFE] flex items-center justify-center border-2 border-[#D3D1C7]">
                    <span className="pf-serif text-[28px] text-[#3C3489] leading-none">
                      {getInitials(profile.fullName)}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <label
                    htmlFor="avatar-input"
                    className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-white border border-[#D3D1C7] flex items-center justify-center cursor-pointer hover:bg-[#F1EFE8] transition-colors"
                  >
                    <Camera size={13} className="text-[#888780]" />
                    <input
                      id="avatar-input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>

              {/* Name + role */}
              <p className="pf-serif text-[17px] text-[#1C1B18] text-center leading-snug mb-0.5">
                {profile.fullName || "—"}
              </p>
              <p className="text-[10.5px] font-medium tracking-widest uppercase text-[#888780] text-center mb-3">
                {profile.role_name || "Member"}
              </p>

              {/* Verified badge */}
              {profile.isEmailVerified ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full bg-[#EAF3DE] text-[#27500A]">
                  <CheckCircle size={11} /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full bg-[#FCEBEB] text-[#791F1F]">
                  <XCircle size={11} /> Not verified
                </span>
              )}

              <div className="w-full h-px bg-[#E5E3DC] my-4" />

              {/* Meta rows */}
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Phone size={13} className="text-[#B4B2A9] flex-shrink-0" />
                  <span className="text-[12.5px] text-[#444441] truncate">
                    {profile.phone_number || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={13} className="text-[#B4B2A9] flex-shrink-0" />
                  <span className="text-[12.5px] text-[#444441] truncate">
                    {profile.email || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Main panel ── */}
            <div className="bg-white rounded-2xl border border-[#E5E3DC] p-6 flex flex-col relative">

              {/* Updating overlay */}
              {updating && (
                <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center rounded-2xl z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#534AB7]" />
                  <p className="mt-2 text-sm text-[#888780]">Saving…</p>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="pf-serif text-[20px] text-[#1C1B18] leading-tight mb-0.5">
                    Profile details
                  </p>
                  <p className="text-[12px] text-[#B4B2A9]">
                    {isEditing ? "Make changes below" : "Your personal information"}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    className="pf-btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={13} /> Edit
                  </button>
                )}
              </div>

              {/* Fields */}
              <form id="profileForm" onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                {fields.map(({ label, name, type }) => (
                  <div key={name} className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-medium tracking-widest uppercase text-[#B4B2A9]">
                      {label}
                    </label>
                    <input
                      className="pf-input-line"
                      type={type}
                      name={name}
                      value={profile[name]}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                ))}
              </form>

              {/* Footer actions */}
              {isEditing && (
                <div className="flex justify-end gap-2.5 mt-6 pt-5 border-t border-[#E5E3DC]">
                  <button className="pf-btn-ghost" onClick={handleCancel}>
                    <X size={13} /> Cancel
                  </button>
                  <button
                    type="submit"
                    form="profileForm"
                    className="pf-btn-save"
                    disabled={updating}
                  >
                    <Save size={14} /> Save changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Success modal ── */}
        {showModal && (
          <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl border border-[#E5E3DC] p-8 w-72 text-center flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-[#EAF3DE] flex items-center justify-center mb-4">
                <Check size={20} className="text-[#27500A]" />
              </div>
              <p className="pf-serif text-[17px] text-[#1C1B18] mb-1">Profile updated</p>
              <p className="text-[12px] text-[#888780] leading-relaxed">
                Your information has been saved successfully.
              </p>
              <button className="pf-modal-ok" onClick={() => setShowModal(false)}>
                Done
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Profile;