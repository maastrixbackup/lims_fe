// utils/googleDrive.js
export const extractDriveFileId = (url) => {
  if (!url) return null;
  const match = url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};