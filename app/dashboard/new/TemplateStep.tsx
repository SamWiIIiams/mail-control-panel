"use client";

import { useEffect, useState } from "react";

export default function TemplateStep({ onSelect }: { onSelect: (t: any) => void }) {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : data?.data || []))
      .catch((err) => console.error("Failed to fetch templates:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Select a Template</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.description || "No description"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
