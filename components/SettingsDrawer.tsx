"use client";

import { FC, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { ChevronRightIcon, ChevronDownIcon } from "lucide-react";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const SettingsDrawer: FC<SettingsDrawerProps> = ({
  open,
  onClose,
  onLogout,
}) => {
  // Accordion states
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // API key field
  const [apiKey, setApiKey] = useState(""); // the *new* key user enters
  const [apiKeyMessage, setApiKeyMessage] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [apiKeyLoading, setApiKeyLoading] = useState(false);

  // Handlers
  async function handleSavePassword(e: { preventDefault: () => void }) {
    e.preventDefault();
    clearPasswordFeedback();
    setPasswordLoading(true);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password.");
      } else {
        setPasswordMessage("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setPasswordError("Unexpected error.");
    }

    setPasswordLoading(false);
  }

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    clearApiKeyFeedback();
    setApiKeyLoading(true);

    if (!apiKey.trim()) {
      setApiKeyError("API key cannot be empty.");
      setApiKeyLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/update-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiKeyError(data.error || "Failed to update API key.");
      } else {
        setApiKeyMessage("API key updated successfully.");
        setApiKey("");
      }
    } catch (err) {
      setApiKeyError("Unexpected error.");
    }

    setApiKeyLoading(false);
  };

  function clearPasswordFeedback() {
    setPasswordError("");
    setPasswordMessage("");
  }

  function clearApiKeyFeedback() {
    setApiKeyError("");
    setApiKeyMessage("");
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 relative">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-black dark:text-white"
          >
            &times;
          </button>
          <div className="absolute top-4 right-12">
            <ThemeToggle />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4 text-black dark:text-white flex-1 overflow-y-auto">
          {/* Change Password Accordion */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              className="w-full flex justify-between items-center py-2 font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={() => setPasswordOpen((prev) => !prev)}
            >
              <span>Change Password</span>
              {passwordOpen ? (
                <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 ml-2 text-gray-500" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                passwordOpen ? "max-h-[500px] mt-2" : "max-h-0"
              }`}
            >
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSavePassword}
              >
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    clearPasswordFeedback();
                  }}
                  className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  required
                />

                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearPasswordFeedback();
                  }}
                  className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearPasswordFeedback();
                  }}
                  className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  required
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Saving..." : "Save Password"}
                </button>

                {passwordError && (
                  <p className="text-sm text-red-600 dark:text-red-500 mt-2">
                    {passwordError}
                  </p>
                )}

                {passwordMessage && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {passwordMessage}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Update API Key Accordion */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              className="w-full flex justify-between items-center py-2 font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={() => setApiKeyOpen((prev) => !prev)}
            >
              <span>Update API Key</span>
              {apiKeyOpen ? (
                <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 ml-2 text-gray-500" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                apiKeyOpen ? "max-h-[300px] mt-2" : "max-h-0"
              }`}
            >
              <form className="flex flex-col gap-2" onSubmit={handleSaveApiKey}>
                <input
                  type="text"
                  placeholder="New API Key"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    clearApiKeyFeedback();
                  }}
                  className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={apiKeyLoading}
                >
                  {apiKeyLoading ? "Saving..." : "Save API Key"}
                </button>
                {apiKeyMessage && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {apiKeyMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Logout button at bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            onClick={onLogout}
            className="
              w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
              bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white
              hover:border-blue-600 dark:hover:border-blue-400
              hover:text-blue-600 dark:hover:text-blue-400
              transition
            "
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
