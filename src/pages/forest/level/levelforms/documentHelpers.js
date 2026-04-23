import { API_BASE_URL } from "../../../../utils/config";
import store from "../../../../utils/store";

const getDocumentName = (value, fallback = "Document") => {
  if (!value || typeof value !== "string") return fallback;
  const clean = value.split("?")[0];
  const parts = clean.split(/[\\/]/);
  return parts[parts.length - 1] || fallback;
};

const buildStageDocumentUrl = ({
  stage,
  fileName,
  mode = "view",
}) => {
  if (!stage || !fileName) return "";

  const endpoint =
    mode === "download"
      ? "downloadForestStageDocument"
      : "viewForestStageDocument";

  return `${API_BASE_URL}/forestland/${endpoint}/${encodeURIComponent(stage)}/${encodeURIComponent(fileName)}`;
};

const extractFileName = (value, fallback = "") => {
  if (!value || typeof value !== "string") return fallback;

  try {
    const parsedUrl = new URL(value, API_BASE_URL);
    return getDocumentName(parsedUrl.pathname, fallback);
  } catch {
    return getDocumentName(value, fallback);
  }
};

const resolveDocumentUrls = (value, options = {}) => {
  const { stage = "" } = options;

  if (!value || typeof value !== "string") return "";

  const fileName = extractFileName(value);

  if (stage && fileName) {
    const viewUrl = buildStageDocumentUrl({
      stage,
      fileName,
      mode: "view",
    });
    const downloadUrl = buildStageDocumentUrl({
      stage,
      fileName,
      mode: "download",
    });

    return {
      viewUrl,
      downloadUrl,
    };
  }

  if (/^https?:\/\//i.test(value)) {
    return {
      viewUrl: value,
      downloadUrl: value,
    };
  }

  return {
    viewUrl: value,
    downloadUrl: value,
  };
};

const normalizeDocumentEntries = (
  value,
  fallbackName = "Document",
  options = {},
) => {
  if (!value) return [];

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        return normalizeDocumentEntries(
          JSON.parse(trimmed),
          fallbackName,
          options,
        );
      } catch {
        // keep as plain string
      }
    }

    const urls = resolveDocumentUrls(trimmed, options);
    return urls?.viewUrl
      ? [
          {
            name: getDocumentName(trimmed, fallbackName),
            url: urls.viewUrl,
            viewUrl: urls.viewUrl,
            downloadUrl: urls.downloadUrl,
          },
        ]
      : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      normalizeDocumentEntries(
        item,
        `${fallbackName} ${index + 1}`,
        options,
      ),
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

    const urls = resolveDocumentUrls(rawUrl, options);
    if (!urls?.viewUrl) return [];

    return [
      {
        name:
          value.name ||
          value.file_name ||
          value.filename ||
          getDocumentName(rawUrl, fallbackName),
        url: urls.viewUrl,
        viewUrl: urls.viewUrl,
        downloadUrl: urls.downloadUrl,
      },
    ];
  }

  return [];
};

export const buildExistingDocumentsByKey = (
  responseData,
  fileMap,
  options = {},
) => {
  const { stage = "" } = options;
  return Object.entries(fileMap).reduce((acc, [uiKey, apiKey]) => {
    acc[uiKey] = normalizeDocumentEntries(
      responseData?.[apiKey],
      apiKey.replace(/_/g, " "),
      {
        stage,
      },
    );
    return acc;
  }, {});
};

export const downloadRemoteDocument = async (
  url,
  fileName = "document",
) => {
  if (!url) return;

  const token = store.getState().auth.userToken;
  const res = await fetch(url, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP Error ${res.status}`);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName || "document";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

export const viewRemoteDocument = async (
  url,
  fileName = "document",
) => {
  if (!url) return;

  const token = store.getState().auth.userToken;
  const res = await fetch(url, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP Error ${res.status}`);
  }

  const blob = await res.blob();
  const blobType = blob.type || "";
  const objectUrl = URL.createObjectURL(blob);
  const newWindow = window.open(objectUrl, "_blank", "noopener,noreferrer");

  if (!newWindow) {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (!blobType.startsWith("image/") && blobType !== "application/pdf") {
      link.download = fileName || "document";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
};
