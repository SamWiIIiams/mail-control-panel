"use client";

import { useEffect, useRef, useState } from "react";
import { Resend } from "resend";

type MessageStepProps = {
  templateId: string;
  onBack: () => void;
  onReset: () => void;
};

type TemplateVariable = {
  id: string;
  key: string;
  type: string;
  fallback_value?: string;
};

type Template = {
  id: string;
  name: string;
  variables: TemplateVariable[];
};

type Segment = {
  id: string;
  name: string;
};

export default function MessageStep({ templateId, onBack, onReset }: MessageStepProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const fetchedSegmentsRef = useRef(false);
  const fetchedTemplatesRef = useRef(false);

  // Fetch template by ID
  useEffect(() => {
    if (fetchedTemplatesRef.current) return;
    fetchedTemplatesRef.current = true;
    async function fetchTemplate() {
      setLoading(true);
      try {
        const res = await fetch(`/api/templates/${templateId}`);
        const data = await res.json();
        setTemplate(data.data);

        const initialVariables: Record<string, string> = {};
        data.variables.forEach((v: TemplateVariable) => {
          initialVariables[v.key] = v.fallback_value || "";
        });
        setVariableValues(initialVariables);
      } catch (err) {
        console.error("Error fetching template:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [templateId]);

  // Fetch segments
useEffect(() => {
  if (fetchedSegmentsRef.current) return; // prevent double-fetch
  fetchedSegmentsRef.current = true;

  async function fetchSegments() {
    try {
      const res = await fetch("/api/segments");
      const data = await res.json();
      setSegments(data.data);
    } catch (err) {
      console.error("Error fetching segments:", err);
    }
  }

  fetchSegments();
}, []);

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSegmentId) {
      alert("Please select a segment");
      return;
    }

    console.log("Sending email with data:", {
      templateId,
      segmentId: selectedSegmentId,
      variables: variableValues,
    });

    // TODO: Call your backend to trigger Resend send here
    alert("Email sent (mock)!");
    onReset();
  };

  if (loading || !template) return <p>Loading template...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">{template.name}</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Segment selection */}
        <label>
          Audience Segment:
          <select
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={selectedSegmentId || ""}
            onChange={(e) => setSelectedSegmentId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a segment
            </option>
            {segments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        {/* Template variables */}
        {template.variables.map((v) => (
          <label key={v.id}>
            {v.key}:
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={variableValues[v.key]}
              onChange={(e) => handleVariableChange(v.key, e.target.value)}
              placeholder={v.fallback_value || ""}
              required
            />
          </label>
        ))}

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-100"
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
}
