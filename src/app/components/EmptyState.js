"use client";

export default function EmptyState({ searchQuery }) {
  const hasSearchQuery = Boolean(searchQuery && searchQuery.trim());

  return (
    <div className="flex w-full flex-col items-center justify-center py-20">
      <div className="text-6xl">📝</div>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">
        {hasSearchQuery
          ? `No notes found for "${searchQuery}"`
          : "No notes yet"}
      </h2>
      <p className="mt-1 text-sm text-gray-400">
        {hasSearchQuery
          ? "Try a different search term"
          : "Create your first note to get started"}
      </p>
    </div>
  );
}
