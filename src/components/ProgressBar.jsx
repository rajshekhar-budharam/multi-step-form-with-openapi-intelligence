import React from 'react'

export default function ProgressBar({ step, total, completedSteps = [] }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: total }).map((_, index) => (
          <React.Fragment key={index}>
            {/* Step dot */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                completedSteps.includes(index)
                  ? 'bg-green-500 text-white'
                  : index <= step
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
              role="progressbar"
              aria-valuenow={index + 1}
              aria-valuemin="1"
              aria-valuemax={total}
              aria-label={`Step ${index + 1} of ${total}${completedSteps.includes(index) ? ' (completed)' : ''}`}
            >
              {completedSteps.includes(index) ? '✓' : index + 1}
            </div>
            {/* Connector line (not after last dot) */}
            {index < total - 1 && (
              <div
                className={`flex-1 h-1 transition-colors ${
                  completedSteps.includes(index) ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-sm mt-3 text-gray-600 text-center">
        Step {step + 1} of {total}
      </div>
    </div>
  )
}
