const API_BASE = "https://elfamor.pythonanywhere.com";

export const getCSRFToken = async () => {
  const res = await fetch(`${API_BASE}/accounts/csrf/`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.csrfToken || data.csrf_token || "";
};