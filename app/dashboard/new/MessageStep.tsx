"use client";

import { useEffect, useRef, useState } from "react";

type MessageStepProps = {
  templateId: string;
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
  html: string;
  subject: string;
  from: string;
};

type Segment = {
  id: string;
  name: string;
};

export default function MessageStep({ templateId, onReset }: MessageStepProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
    null
  );
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(template?.subject || "");

  // Refs to prevent double fetching
  const fetchedTemplatesRef = useRef<string | null>(null);
  const fetchedSegmentsRef = useRef(false);

  // Fetch template by ID (only once per templateId)

  useEffect(() => {
    if (template?.subject) setSubject(template.subject);
  }, [template?.subject]);

  useEffect(() => {
    if (fetchedTemplatesRef.current === templateId) return;
    fetchedTemplatesRef.current = templateId;

    async function fetchTemplate() {
      setLoading(true);
      try {
        const res = await fetch(`/api/templates/${templateId}`);
        const data = await res.json();
        const tmpl = data?.data || data;

        setTemplate(tmpl);

        const initialVariables: Record<string, string> = {};
        tmpl.variables?.forEach((v: TemplateVariable) => {
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

  // Fetch segments (only once)
  useEffect(() => {
    if (fetchedSegmentsRef.current) return;
    fetchedSegmentsRef.current = true;

    async function fetchSegments() {
      try {
        const res = await fetch("/api/segments");
        const data = await res.json();
        setSegments(data?.data || []);
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

    try {
      // Generate name at submit time
      const easternDateTime = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour12: false,
      });
      const name = `${subject} ${easternDateTime}`;
      const res = await fetch("/api/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: template?.html,
          variables: variableValues,
          segmentId: selectedSegmentId,
          subject,
          from: template?.from,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Broadcast error:", data);
        alert("Failed to send email: " + (data.error || "Unknown error"));
        return;
      }

      alert("Email sent successfully!");
      onReset();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Failed to send email: " + (err as Error).message);
    }
  };

  function applyVariables(html: string, vars: Record<string, string>) {
    let output = html;
    Object.entries(vars).forEach(([key, value]) => {
      const re = new RegExp(`{{{\\s*${key}\\s*}}}`, "g");
      output = output.replace(re, value);
    });
    return output;
  }

  if (loading || !template) return <p>Loading template...</p>;

  return (
    <div
      className={`
        w-full max-w-4xl bg-gray-100 dark:bg-gray-900
        border border-gray-300 dark:border-gray-800
        rounded-2xl p-8 flex flex-col gap-6
        transition-colors duration-300
      `}
    >
      <h2 className="text-2xl font-semibold text-center">{template.name}</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Segment selection */}
        <label>
          Audience Segment:
          <select
            className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
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

        {/* Subject field */}
        <label>
          Subject:
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </label>

        {/* Template variables */}
        {template.variables?.map((v) => (
          <label key={v.id}>
            {v.key}:
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
              value={variableValues[v.key]}
              onChange={(e) => handleVariableChange(v.key, e.target.value)}
              placeholder={v.fallback_value || ""}
              required
            />
          </label>
        ))}

        {/* Message preview */}
        <div className="mt-6 max-w-3xl mx-auto">
          <h3 className="font-semibold text-center mb-2">Preview</h3>
          <div
            className="p-4 rounded bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-mono overflow-auto max-h-64"
            dangerouslySetInnerHTML={{
              __html: applyVariables(template.html, variableValues),
            }}
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          Send Email
        </button>
      </form>
    </div>
  );
}
