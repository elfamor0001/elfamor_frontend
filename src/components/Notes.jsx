import React, { useEffect, useState } from "react";
const Notes = ({ productId, notes: initialNotesProp }) => {
  const [notes, setNotes] = useState(null); // normalized array: [{type, text}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // normalize helper: accepts either object or array and returns standardized array
  const normalizeNotes = (raw) => {
    if (!raw) return [];

    // If it's an array already (prefer this shape)
    if (Array.isArray(raw)) {
      return raw.map((n) =>
        typeof n === "string" ? { type: "Note", text: n } : { type: n.type || "Note", text: n.text || "" }
      );
    }

    // If it's an object (keys -> values)
    if (typeof raw === "object") {
      // If already wrapped in `notes` key
      if (raw.notes && Array.isArray(raw.notes)) return normalizeNotes(raw.notes);

      return Object.entries(raw).map(([k, v]) => ({
        type: prettifyKey(k),
        text: String(v)
      }));
    }

    // fallback
    return [{ type: "Note", text: String(raw) }];
  };

  const prettifyKey = (key) => {
    // convert camelCase or snake_case to Title Case
    return key
      .replace(/_/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Use provided notes prop if present
  useEffect(() => {
    if (initialNotesProp) {
      setNotes(normalizeNotes(initialNotesProp));
      return;
    }

    // If no productId provided, do nothing (admin can pass notes prop instead)
    if (!productId) return;

    let aborted = false;
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/products/${productId}/notes`);
        if (!res.ok) throw new Error(`Failed to fetch notes (${res.status})`);
        const data = await res.json();
        if (!aborted) setNotes(normalizeNotes(data));
      } catch (err) {
        if (!aborted) setError(err.message || "Failed to load notes");
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchNotes();

    return () => {
      aborted = true;
    };
  }, [productId, initialNotesProp]);

  // Loading / empty states
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-md border">
        <h3 className="font-semibold mb-2">Notes :</h3>
        <div className="text-sm text-gray-500">Loading notes…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-md border">
        <h3 className="font-semibold mb-2">Notes :</h3>
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    );
  }

  const displayNotes = notes && notes.length ? notes : [];

  return (
    <div className="p-6 bg-white rounded-md border">
      <h3 className="font-semibold mb-4">Notes :</h3>

      {displayNotes.length === 0 ? (
        <p className="text-sm text-gray-500">No notes available for this product.</p>
      ) : (
        <div className="space-y-3">
          {displayNotes.map((n, i) => (
            <div key={i}>
              <div className="text-base font-medium leading-6">{n.type}:</div>
              <div className="text-lg leading-7 text-gray-800">{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
