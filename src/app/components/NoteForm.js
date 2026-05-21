"use client";

import { useState } from "react";
import { validateNote, sanitizeNoteInput } from "@/lib/validations";

export default function NoteForm({ onSubmit, onCancel, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [pinned, setPinned] = useState(initialData?.pinned || false);
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const validation = validateNote(title, content);

    if (!validation.valid) {
      setErrors({
        title: validation.errors.title || "",
        content: validation.errors.content || "",
      });
      return;
    }

    setLoading(true);

    try {
      await onSubmit(sanitizeNoteInput(title, content, pinned));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) {
              setErrors((previous) => ({ ...previous, title: "" }));
            }
          }}
          placeholder="Note title..."
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-400 ring-2 ring-red-200" : "border-gray-200"
          }`}
        />
        {errors.title ? (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        ) : null}
        <div
          className={`mt-1 text-right text-xs ${
            title.length >= 100
              ? "text-red-500"
              : title.length > 90
                ? "text-amber-500"
                : "text-gray-400"
          }`}
        >
          {title.length}/100
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (errors.content) {
              setErrors((previous) => ({ ...previous, content: "" }));
            }
          }}
          placeholder="Write your note..."
          rows={5}
          className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.content ? "border-red-400 ring-2 ring-red-200" : "border-gray-200"
          }`}
        />
        {errors.content ? (
          <p className="mt-1 text-xs text-red-500">{errors.content}</p>
        ) : null}
        <div
          className={`mt-1 text-right text-xs ${
            content.length >= 5000
              ? "text-red-500"
              : content.length > 4500
                ? "text-amber-500"
                : "text-gray-400"
          }`}
        >
          {content.length}/5000
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <input
          type="checkbox"
          checked={pinned}
          onChange={(event) => setPinned(event.target.checked)}
          className="h-4 w-4 cursor-pointer accent-amber-400"
        />
        <label className="text-sm text-gray-600">Pin this note 📌</label>
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-5 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Note" : "Create Note"}
        </button>
      </div>
    </div>
  );
}
