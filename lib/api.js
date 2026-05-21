const BASE_URL = "/api/notes";

/**
 * Handles API responses and throws a descriptive error for failed requests.
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Something went wrong");
  }

  return response.json();
}

/**
 * Fetches all notes, optionally filtered by a search query.
 */
export async function fetchNotes(searchQuery = "") {
  const trimmedQuery = searchQuery.trim();
  const url = trimmedQuery
    ? `${BASE_URL}?search=${encodeURIComponent(trimmedQuery)}`
    : BASE_URL;

  const response = await fetch(url, { method: "GET" });
  return handleResponse(response);
}

/**
 * Fetches a single note by ID.
 */
export async function fetchNoteById(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "GET" });
  return handleResponse(response);
}

/**
 * Creates a new note.
 */
export async function createNote(noteData) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  });

  return handleResponse(response);
}

/**
 * Updates an existing note.
 */
export async function updateNote(id, noteData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  });

  return handleResponse(response);
}

/**
 * Deletes a note by ID.
 */
export async function deleteNote(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return handleResponse(response);
}

/**
 * Toggles the pinned state for a note.
 */
export async function togglePin(id, currentPinned) {
  return updateNote(id, { pinned: !currentPinned });
}