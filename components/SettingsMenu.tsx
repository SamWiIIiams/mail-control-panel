"use client";

import { useState } from "react";

interface Props {
  onLogout: () => void;
}

export default function SettingsMenu({ onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-gray-200 dark:bg-gray-900 rounded"
      >
        ☰
      </button>

      {/* Slideout */}
      {open && (
        <div className="fixed top-0 right-0 w-80 h-full bg-gray-100 dark:bg-gray-900 shadow-lg p-4 flex flex-col gap-4 z-50">
          <button onClick={() => setOpen(false)} className="self-end text-xl">
            ✕
          </button>

          {/* Password change section */}
          <div>
            <button
              onClick={() => setShowPasswordForm((prev) => !prev)}
              className="w-full text-left font-semibold mb-2"
            >
              Change Password
            </button>
            {showPasswordForm && (
              <form className="flex flex-col gap-2">
                <input type="password" placeholder="New password" className="p-2 rounded border" />
                <button className="bg-blue-600 text-white p-2 rounded">Save</button>
              </form>
            )}
          </div>

          {/* Resend API key section */}
          <div>
            <button
              onClick={() => setShowApiKeyForm((prev) => !prev)}
              className="w-full text-left font-semibold mb-2"
            >
              Update Resend API Key
            </button>
            {showApiKeyForm && (
              <form className="flex flex-col gap-2">
                <input type="text" placeholder="API Key" className="p-2 rounded border" />
                <button className="bg-blue-600 text-white p-2 rounded">Save</button>
              </form>
            )}
          </div>

          <button
            onClick={onLogout}
            className="mt-auto bg-red-600 text-white p-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
