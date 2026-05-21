"use client";

export default function SearchBar({ value, onChange }) {
  const hasValue = Boolean(value);

  return (
    <div className="relative w-full max-w-md">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search notes..."
        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {hasValue ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-lg leading-none text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
