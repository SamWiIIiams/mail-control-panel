// /lib/replaceTemplateVariables.ts

/**
 * Safely escape HTML entities to prevent injection.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Replaces template placeholders ({{var}} / {{{var}}}) with provided values.
 * - Supports fallbacks like {{var|default}}
 * - Escapes HTML unless using triple braces
 */
export function replaceTemplateVariables(
  html: string,
  variables: Record<string, string>
): string {
  if (!html) return "";

  // Regex to match {{var}} or {{{var}}}, optionally with fallbacks (e.g. {{name|Guest}})
  // Groups:
  // 1 = number of braces (2 or 3)
  // 2 = variable name
  // 3 = fallback value (optional)
  const regex = /\{{2,3}\s*([\w.-]+)(?:\|([^}]+))?\s*\}{2,3}/g;

  return html.replace(regex, (match, key, fallback, offset, str) => {
    const userValue = variables[key];
    const finalValue = userValue ?? fallback ?? "";

    // Triple braces => unescaped
    if (match.startsWith("{{{")) {
      return finalValue;
    }

    // Double braces => escaped
    return escapeHtml(finalValue);
  });
}
