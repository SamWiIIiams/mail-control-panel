'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface TemplateVariable {
  key: string;
  type: 'string' | 'number';
  fallbackValue: string;
}

// Extract {{{VAR}}} placeholders
function extractVariablesFromHTML(html: string) {
  const regex = /{{{\s*(\w+)\s*}}}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
}

export default function CreateTemplatePage() {
  const router = useRouter();

  const [templateName, setTemplateName] = useState('');
  const [html, setHtml] = useState('');
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [subject, setSubject] = useState('');
  const [from, setFrom] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});

  const handleHTMLChange = (newHTML: string) => {
    setHtml(newHTML);

    const keys = extractVariablesFromHTML(newHTML);
    const oldMap = Object.fromEntries(variables.map((v) => [v.key, v]));

    const newVariables = keys.map((key) => ({
      key,
      type: oldMap[key]?.type || 'string',
      fallbackValue: oldMap[key]?.fallbackValue || '',
    }));

    setVariables(newVariables);
  };

  const handleVariableChange = (
    index: number,
    key: 'type' | 'fallbackValue',
    value: string
  ) => {
    const updated = [...variables];
    if (key === 'fallbackValue') updated[index][key] = value;
    if (key === 'type') updated[index][key] = value as 'string' | 'number';
    setVariables(updated);
  };

  const handleSubmit = async () => {
    const newInvalid: Record<string, boolean> = {};

    if (!templateName.trim()) newInvalid['templateName'] = true;
    if (!html.trim()) newInvalid['html'] = true;
    variables.forEach((v, idx) => {
      if (!v.type) newInvalid[`variable-${idx}`] = true;
    });

    if (Object.keys(newInvalid).length > 0) {
      setInvalidFields(newInvalid);
      setError('Please fill in all required fields.');
      return;
    }

    setInvalidFields({});
    setError(null);
    setLoading(true);

    const payload = {
      name: templateName,
      html,
      variables: variables.map((v) => ({
        key: v.key,
        type: v.type,
        fallbackValue: v.type === 'number' ? Number(v.fallbackValue) : v.fallbackValue,
      })),
      subject,
      from,
      replyTo: replyTo ? replyTo.split(',').map((s) => s.trim()) : undefined,
      text,
    };

    try {
      const res = await fetch('/api/templates/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) router.push('/dashboard');
      else setError(data.error || 'Failed to create template');
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-8 flex flex-col gap-6 transition-colors duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold text-center dark:text-white mb-4">
          Create Template
        </h1>

        {/* Template Name */}
        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            Template Name
          </span>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            onFocus={() =>
              setInvalidFields((prev) => ({ ...prev, templateName: false }))
            }
            className={`
              w-full p-2 mt-1 rounded
              bg-gray-200 dark:bg-gray-800 text-black dark:text-white
              border ${
                invalidFields['templateName']
                  ? 'border-red-400 bg-red-100 dark:bg-red-900'
                  : 'border-gray-300 dark:border-gray-700'
              }
              transition-colors
            `}
          />
        </label>

        {/* Optional Fields */}
        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          />
        </label>
        <label>
          From:
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Your Name <you@domain.com>"
            className="w-full p-2 mt-1 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          />
        </label>
        <label>
          Reply-To (comma-separated):
          <input
            type="text"
            value={replyTo}
            onChange={(e) => setReplyTo(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          />
        </label>
        <label>
          Plain Text Version:
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full p-2 mt-1 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-mono"
          />
        </label>

        {/* HTML Editor / Preview with Toggle Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold dark:text-white">HTML:</label>
            <div className="flex items-center gap-2">
              <span className="text-sm dark:text-white">Edit</span>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                  isPreview ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${
                    isPreview ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm dark:text-white">Preview</span>
            </div>
          </div>

          {isPreview ? (
            <div
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-mono min-h-[200px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <textarea
              value={html}
              onChange={(e) => handleHTMLChange(e.target.value)}
              onFocus={() =>
                setInvalidFields((prev) => ({ ...prev, html: false }))
              }
              rows={10}
              className={`w-full p-2 mt-1 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-mono border ${
                invalidFields['html']
                  ? 'border-red-400 bg-red-100 dark:bg-red-900'
                  : 'border-gray-300 dark:border-gray-700'
              } transition-colors`}
              required
            />
          )}
        </div>

        {/* Variables */}
        {variables.length > 0 && (
          <div className="flex flex-col gap-4">
            <span className="font-semibold dark:text-white">Variables</span>
            {variables.map((v, i) => (
              <div key={i} className="flex gap-2 flex-wrap items-center">
                <input
                  value={v.key}
                  readOnly
                  className="p-2 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white flex-1 cursor-not-allowed"
                />
                <select
                  value={v.type}
                  onChange={(e) => handleVariableChange(i, 'type', e.target.value)}
                  onFocus={() =>
                    setInvalidFields((prev) => ({ ...prev, [`variable-${i}`]: false }))
                  }
                  className={`p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white border ${
                    invalidFields[`variable-${i}`]
                      ? 'border-red-400 bg-red-100 dark:bg-red-900'
                      : 'border-gray-300 dark:border-gray-700'
                  } transition-colors`}
                  required
                >
                  <option value="">Select type</option>
                  <option value="string">string</option>
                  <option value="number">number</option>
                </select>
                <input
                  value={v.fallbackValue}
                  onChange={(e) =>
                    handleVariableChange(i, 'fallbackValue', e.target.value)
                  }
                  placeholder="Fallback Value"
                  className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white flex-1"
                />
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Template'}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </motion.div>
    </div>
  );
}
