import React, { useState } from "react";
import { CheckCircle, XCircle, Camera } from "lucide-react";
{/* <LockKeyhole /> */}
const Profile = () => {
  const [profile, setProfile] = useState({
    avatar: null,
    fullName: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    isEmailVerified: true,
    phone: "+91 9876543210",
  });

  const [preview, setPreview] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <main className="flex justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl hover:shadow-3xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
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

          {/* Full Name */}
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

          {/* Username */}
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

          {/* Email with verification */}
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
              {profile.isEmailVerified ? "Email is verified" : "Email not verified"}
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Save Button */}
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
