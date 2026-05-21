"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createNote,
  deleteNote,
  fetchNotes,
  togglePin,
  updateNote,
} from "@/lib/api";
import NoteList from "./components/NoteList";
import NoteForm from "./components/NoteForm";
import SearchBar from "./components/SearchBar";
import EmptyState from "./components/EmptyState";
import LoadingSpinner from "./components/LoadingSpinner";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState(null);

  const fetchNotesData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchNotes(searchQuery);
      setNotes(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchNotesData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchNotesData, searchQuery]);

  const handleCreate = async (noteData) => {
    try {
      await createNote(noteData);
      await fetchNotesData();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdate = async (noteData) => {
    try {
      await updateNote(editingNote.id, noteData);
      await fetchNotesData();
      setEditingNote(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) {
      return;
    }

    try {
      await deleteNote(id);
      await fetchNotesData();
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleTogglePin = async (id, currentPinned) => {
    try {
      await togglePin(id, currentPinned);
      await fetchNotesData();
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const isFormOpen = showForm || editingNote !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Notes</h1>
            <p className="mt-0.5 text-sm text-gray-400">Your thoughts, organized</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setEditingNote(null);
            }}
            className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
          >
            ＋ New Note
          </button>
        </div>

        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="mb-4 text-xs text-gray-400">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </div>

        <div>
          {loading ? (
            <LoadingSpinner />
          ) : notes.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <NoteList
              notes={notes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          )}
        </div>
      </div>

      {isFormOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={handleCancelForm}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingNote ? "Edit Note" : "New Note"}
              </h2>
              <button
                type="button"
                onClick={handleCancelForm}
                className="text-xl leading-none text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <NoteForm
              onSubmit={editingNote ? handleUpdate : handleCreate}
              onCancel={handleCancelForm}
              initialData={editingNote || undefined}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
