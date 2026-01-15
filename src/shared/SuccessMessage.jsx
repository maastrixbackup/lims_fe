import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const SuccessMessage = ({ open, type, message, onClose }) => {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
        <div className="flex flex-col items-center text-center">
          {isSuccess ? (
            <CheckCircle className="text-green-600 w-14 h-14 mb-3" />
          ) : (
            <XCircle className="text-red-600 w-14 h-14 mb-3" />
          )}

          <h2 className="text-lg font-semibold text-gray-800">
            {isSuccess ? "Success" : "Error"}
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            {message || "Something went wrong"}
          </p>

          <button
            onClick={onClose}
            className={`mt-5 px-6 py-2 text-white rounded-lg ${
              isSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
