import React, { memo, useState, useEffect } from "react";
import Modal from "../components/Modal";
import { t } from "../i18n";

const SuggestionModal = ({
  open,
  initialValue = "",
  onClose,
  onAccept,
  lang = "en",
}) => {
  const [text, setText] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setText(initialValue);
      setError(null);
      setIsEditing(false);
    }
  }, [open, initialValue]);

  return (
    <Modal open={open} title={t(lang, "suggestion")} onClose={onClose}>
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
          <strong>Warning:</strong> {error}
        </div>
      )}

      <textarea
        className="w-full border p-2 rounded"
        rows={8}
        value={text}
        onChange={(e) => isEditing && setText(e.target.value)}
        readOnly={!isEditing}
      />

      <div className="mt-3 flex gap-2 justify-end">
        <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
          {t(lang, "discard")}
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-3 py-1 bg-blue-500 text-white rounded ${
            !isEditing ? "bg-blue-600" : "bg-green-500"
          }`}
        >
          {isEditing ? t(lang, "save") : t(lang, "edit")}
        </button>

        <button
          onClick={() => onAccept(text)}
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          {t(lang, "accept")}
        </button>
      </div>
    </Modal>
  );
};

export default memo(SuggestionModal);
