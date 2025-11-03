import React, { useEffect, useState } from "react";
import {CheckCircle,XCircle,Camera, User, Mail, Phone, Edit, Save, X, Loader2,} from "lucide-react";
import { API_BASE_URL } from "../utils/config";
import { useDispatch } from "react-redux";
import { updateUser } from "../utils/userSlice";

const Profile = () => {
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

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
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
      const token = localStorage.getItem("authToken");
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

      //  Update local and Redux states
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
      console.error("Profile update error:", err);
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
      <main className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-3 text-gray-600 text-lg font-medium">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Avatar */}
          <div className="bg-white rounded-2xl shadow-all p-6 flex flex-col items-center text-center border-gray-300">
            <div className="relative">
              <img
                src={preview || "https://www.gravatar.com/avatar/?d=mp&f=y"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border shadow-md"
              />
              {isEditing && (
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/80 transition"
                >
                  <Camera size={16} />
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>

            <h3 className="text-lg font-semibold mt-4">{profile.fullName}</h3>
            <p className="text-sm text-gray-500">{profile.role_name}</p>
            <p className="text-xs text-gray-400 mt-1">{profile.email}</p>

            <div className="mt-6 text-sm text-gray-600 space-y-1">
              <p className="flex items-center justify-center gap-2">
                <Phone size={14} /> {profile.phone_number || "N/A"}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail size={14} />
                {profile.isEmailVerified ? (
                  <span className="flex items-center gap-1 text-green-600">
                    Verified <CheckCircle size={14} />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500">
                    Not Verified <XCircle size={14} />
                  </span>
                )}
              </p>
            </div>
          </div>
          {/* Profile Details */}
          <div className="bg-white rounded-2xl shadow-all p-6 md:col-span-2 relative">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <User size={20} /> Profile Details
            </h2>

            {updating && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-2xl z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-2 text-gray-600 font-medium">Updating...</p>
              </div>
            )}

            <form id="profileForm" onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "Full Name", name: "fullName", type: "text" },
                { label: "Username", name: "username", type: "text" },
                { label: "Email Address", name: "email", type: "email" },
                { label: "Phone Number", name: "phone_number", type: "tel" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={profile[field.name]}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    readOnly={!isEditing}
                  />
                </div>
              ))}
            </form>

            <div className="flex justify-end mt-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Edit size={18} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="submit"
                    form="profileForm"
                    className="btn btn-success flex items-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost flex items-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-80 text-center">
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <h3 className="text-lg font-semibold mt-4 text-gray-800">
              Profile Updated
            </h3>
            <p className="text-gray-500 mt-2 text-sm">
              Your profile has been successfully updated.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-primary mt-6 w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
