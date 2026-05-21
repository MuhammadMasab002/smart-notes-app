/**
 * Validates that a note title is present, non-empty, and within the maximum length.
 */
export function validateTitle(title) {
  if (title === undefined || title === null) {
    return { valid: false, error: "Title is required" };
  }

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return {
      valid: false,
      error: "Title cannot be empty or whitespace only",
    };
  }

  if (trimmedTitle.length > 100) {
    return {
      valid: false,
      error: "Title cannot exceed 100 characters",
    };
  }

  return { valid: true, error: null };
}

/**
 * Validates that note content is present, non-empty, and within the maximum length.
 */
export function validateContent(content) {
  if (content === undefined || content === null) {
    return { valid: false, error: "Content is required" };
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return {
      valid: false,
      error: "Content cannot be empty or whitespace only",
    };
  }

  if (trimmedContent.length > 5000) {
    return {
      valid: false,
      error: "Content cannot exceed 5000 characters",
    };
  }

  return { valid: true, error: null };
}

/**
 * Validates both the title and content for a note and returns a combined result.
 */
export function validateNote(title, content) {
  const titleResult = validateTitle(title);
  const contentResult = validateContent(content);

  return {
    valid: titleResult.valid && contentResult.valid,
    errors: {
      title: titleResult.error,
      content: contentResult.error,
    },
  };
}

/**
 * Validates and parses a note ID to ensure it is a positive integer.
 */
export function validateId(id) {
  const parsed = parseInt(id, 10);

  if (Number.isNaN(parsed)) {
    return { valid: false, error: "Invalid ID: must be a number" };
  }

  if (parsed < 1) {
    return { valid: false, error: "Invalid ID: must be a positive number" };
  }

  return { valid: true, error: null, parsed };
}

/**
 * Trims note text fields and normalizes the pinned flag for safe persistence.
 */
export function sanitizeNoteInput(title, content, pinned) {
  return {
    title: title.trim(),
    content: content.trim(),
    pinned: typeof pinned === "boolean" ? pinned : false,
  };
}
