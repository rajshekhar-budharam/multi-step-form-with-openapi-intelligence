import React, {memo} from 'react'

const Modal = ({ open, title, children, onClose }) => {
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded shadow-lg max-w-2xl w-full p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default memo(Modal);