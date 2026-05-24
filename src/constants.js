export const getApiUrl = (apiKey, model) => {
  const selectedModel = model || "gemini-2.5-flash";
  return `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
};

// Keep URL export for fallback compatibility
export const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";