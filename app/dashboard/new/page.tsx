"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateStep from "./TemplateStep";
import MessageStep from "./MessageStep";

export default function NewEmailBlastPage() {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const resetWorkflow = () => setSelectedTemplateId(null);

  // Dynamic header text
  const headerText = !selectedTemplateId ? "Select a Template" : "Compose Message";

  // Back button handler
  const handleBack = () => {
    if (selectedTemplateId) {
      setSelectedTemplateId(null); // go from MessageStep -> TemplateStep
    } else {
      router.push("/dashboard"); // go from TemplateStep -> Dashboard
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-colors bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 relative">
      {/* Fixed Back Button */}
      <button
        onClick={handleBack}
        className="
          fixed top-4 left-4 z-50 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
          hover:border-blue-600 dark:hover:border-blue-400
          hover:text-blue-600 dark:hover:text-blue-400
          transition
        "
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-10 text-center">{headerText}</h1>

      {!selectedTemplateId ? (
        <TemplateStep onSelect={(templateId: string) => setSelectedTemplateId(templateId)} />
      ) : (
        <MessageStep templateId={selectedTemplateId} onReset={resetWorkflow} />
      )}
    </div>
  );
}
