"use client";

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`relative flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer ${
        note.pinned ? "border-l-4 border-l-amber-400" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate text-base font-semibold text-gray-800">
          {note.title}
        </h3>
        <button
          type="button"
          title={note.pinned ? "Unpin note" : "Pin note"}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          onClick={() => onTogglePin(note.id, note.pinned)}
          className={`rounded p-1 text-lg transition-colors hover:bg-gray-50 hover:text-amber-400 ${
            note.pinned ? "text-amber-500" : "text-gray-300"
          }`}
        >
          {note.pinned ? "📌" : "📍"}
        </button>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
        {note.content}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-gray-400">{formattedDate}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(note)}
            className="rounded-lg px-2 py-1 text-sm transition-colors hover:bg-blue-50 hover:text-blue-500"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            className="rounded-lg px-2 py-1 text-sm transition-colors hover:bg-red-50 hover:text-red-500"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
