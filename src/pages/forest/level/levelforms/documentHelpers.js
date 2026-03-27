import { API_BASE_URL } from "../../../../utils/config";

const API_ROOT = API_BASE_URL.replace(/\/api\/?$/, "");

const getDocumentName = (value, fallback = "Document") => {
  if (!value || typeof value !== "string") return fallback;
  const clean = value.split("?")[0];
  const parts = clean.split(/[\\/]/);
  return parts[parts.length - 1] || fallback;
};

const resolveDocumentUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${API_ROOT}${value}`;
  return `${API_ROOT}/${value}`;
};

const normalizeDocumentEntries = (value, fallbackName = "Document") => {
  if (!value) return [];

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        return normalizeDocumentEntries(JSON.parse(trimmed), fallbackName);
      } catch {
        // keep as plain string
      }
    }

    const url = resolveDocumentUrl(trimmed);
    return url
      ? [
          {
            name: getDocumentName(trimmed, fallbackName),
            url,
          },
        ]
      : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      normalizeDocumentEntries(item, `${fallbackName} ${index + 1}`),
    );
  }

  if (typeof value === "object") {
    const rawUrl =
      value.url ||
      value.file_url ||
      value.document_url ||
      value.path ||
      value.file_path ||
      value.document ||
      value.location;

    if (!rawUrl) return [];

    const url = resolveDocumentUrl(rawUrl);
    if (!url) return [];

    return [
      {
        name:
          value.name ||
          value.file_name ||
          value.filename ||
          getDocumentName(rawUrl, fallbackName),
        url,
      },
    ];
  }

  return [];
};

export const buildExistingDocumentsByKey = (responseData, fileMap) => {
  return Object.entries(fileMap).reduce((acc, [uiKey, apiKey]) => {
    acc[uiKey] = normalizeDocumentEntries(
      responseData?.[apiKey],
      apiKey.replace(/_/g, " "),
    );
    return acc;
  }, {});
};
