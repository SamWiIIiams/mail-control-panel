"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TemplateStep({ onSelect }: { onSelect: (t: any) => void }) {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/templates/list")
      .then((res) => res.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : data?.data || []))
      .catch((err) => console.error("Failed to fetch templates:", err));
  }, []);

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full">
      {templates.map((template) => (
        <motion.div
          key={template.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(template.id)}
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
          <h2 className="text-2xl font-semibold mb-2">{template.name}</h2>
          <p className="text-sm opacity-80 leading-relaxed">
            {template.description || "No description"}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
