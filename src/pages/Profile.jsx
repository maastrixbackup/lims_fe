import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Camera } from "lucide-react";
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Profile fetch response:", data);

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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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

      if (profile.avatar instanceof File) {
        formData.append("profile_pic", profile.avatar);
      }

      const response = await fetch(`${API_BASE_URL}/user/updateUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="flex justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl hover:shadow-3xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
         
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={preview || "https://www.gravatar.com/avatar/?d=mp&f=y"}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border shadow-md"
              />
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700"
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
            </div>
            <p className="text-sm text-gray-500 mt-2">Upload or change picture</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {profile.isEmailVerified ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : (
                <XCircle className="text-red-500" size={20} />
              )}
            </div>
            <p className="text-xs text-gray-500">
              {profile.isEmailVerified
                ? "Email is verified"
                : "Email not verified"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Profile;
