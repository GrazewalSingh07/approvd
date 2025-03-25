import React, { useState } from "react";
import { doPasswordReset } from "../../firebase/auth";
import { message } from "antd";

export const ForgotPassword = ({ onClose }) => {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const onPasswordReset = async (e) => {
    e.preventDefault();
    if (!isResettingPassword) {
      setIsResettingPassword(true);
      try {
        await doPasswordReset(resetEmail);
        messageApi.open({
          type: "success",
          content: "Password reset email sent!",
          className: "text-white",
        });
        setTimeout(() => onClose(), 1500);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: error.message,
          className: "text-white",
        });
      } finally {
        setIsResettingPassword(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {contextHolder}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
        <form onSubmit={onPasswordReset}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isResettingPassword}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md ${
                isResettingPassword
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
            >
              {isResettingPassword ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
