"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex w-full items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Loading notes...</p>
      </div>
    </div>
  );
}
