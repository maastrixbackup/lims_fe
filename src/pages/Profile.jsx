import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Camera,
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../utils/config";

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
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/user/getProfile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load profile");
        }

        const user = data.user;
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

        if (user.profile_pic) {
          setPreview(
            user.profile_pic.startsWith("http")
              ? user.profile_pic
              : `${API_BASE_URL}/uploads/${user.profile_pic}`
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Not authorized");
        return;
      }

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

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert(err.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    window.location.reload(); // refresh to restore original data
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Loading profile...
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">👤 My Profile</h1>

     
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* --- Left Side: Profile Picture Card --- */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
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
            <p className="text-xs text-gray-400 mt-1">
              {profile.email || "No email"}
            </p>

            <div className="mt-6 text-sm text-gray-600 space-y-1">
              <p className="flex items-center justify-center gap-2">
                <Phone size={14} /> {profile.phone_number || "N/A"}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail size={14} />{" "}
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

          {/* --- Right Side: Edit Form --- */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <User size={20} /> Profile Details
            </h2>

            <form id="profileForm" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    readOnly={!isEditing}
                  />
                  {profile.isEmailVerified ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={profile.phone_number}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  readOnly={!isEditing}
                />
              </div>
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
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
