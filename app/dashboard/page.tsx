"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");
    // TODO: call Resend API here
    setTimeout(() => setStatus("Email sent! (demo)"), 1000);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jinjnet Dashboard</h1>
        <button onClick={() => signOut()}>Logout</button>
      </header>

      <section className="bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Send Email</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSend}>
          <input
            type="email"
            placeholder="Recipient Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
          />

          <button type="submit">Send Email</button>
        </form>

        {status && <p className="mt-4 text-sm text-gray-300">{status}</p>}
      </section>
    </main>
  );
}
