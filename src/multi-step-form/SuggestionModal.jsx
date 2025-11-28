import React, {memo} from 'react'
import Modal from '../components/Modal'
import { t } from '../i18n'

const SuggestionModal = ({
  open,
  onClose,
  suggestion,
  onSuggestionChange,
  isEditing,
  onEditToggle,
  onAccept,
  loading,
  error,
  lang = 'en',
}) => {
  return (
    <Modal open={open} title={t(lang, 'suggestion')} onClose={onClose}>
      <div>
        {error && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
            <strong>Warning:</strong> {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-4">Generating...</div>
        ) : (
          <>
            <textarea
              className="w-full border p-2"
              rows={8}
              value={suggestion}
              onChange={(e) => isEditing && onSuggestionChange(e.target.value)}
              readOnly={!isEditing}
            />
            <div className="mt-2 flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                {t(lang, 'discard')}
              </button>
              <button
                onClick={onEditToggle}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                {isEditing ? t(lang, 'save') : t(lang, 'edit')}
              </button>
              <button
                onClick={() => onAccept(suggestion)}
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                {t(lang, 'accept')}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default memo(SuggestionModal);