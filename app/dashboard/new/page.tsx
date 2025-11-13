"use client";

import { useState } from "react";
import TemplateStep from "./TemplateStep";
import MessageStep from "./MessageStep";

export default function NewEmailBlastPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const resetWorkflow = () => {
    setSelectedTemplateId(null);
  };

  return (
    <main className="p-8">
      {!selectedTemplateId ? (
        // Step 1: Select Template
        <TemplateStep
          onSelect={(templateId: string) => setSelectedTemplateId(templateId)}
        />
      ) : (
        // Step 2: Message editor with segment dropdown
        <MessageStep
          templateId={selectedTemplateId}
          onBack={() => setSelectedTemplateId(null)}
          onReset={resetWorkflow}
        />
      )}
    </main>
  );
}
