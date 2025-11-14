"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();

  const options = [
    {
      title: "📨 New Email Blast",
      description: "Send a campaign to one of your audience segments using a saved template.",
      href: "/dashboard/new",
    },
    {
      title: "🧱 Create Template from HTML",
      description: "Upload or paste custom HTML and create a reusable email template.",
      href: "/dashboard/create-template",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-colors bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-10 text-center">Mail Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full">
        {options.map((opt, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(opt.href)}
            className={`
              cursor-pointer flex flex-col items-center justify-center text-center
              p-8 rounded-2xl aspect-square
              border border-gray-300 dark:border-gray-800
              bg-gray-100 dark:bg-gray-900
              hover:border-blue-600 dark:hover:border-blue-400
              hover:shadow-lg hover:shadow-blue-500/10
              transition-all duration-300
            `}
          >
            <h2 className="text-2xl font-semibold mb-2">{opt.title}</h2>
            <p className="text-sm opacity-80 leading-relaxed">{opt.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
