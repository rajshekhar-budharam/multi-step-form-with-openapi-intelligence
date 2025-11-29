import React, { memo } from "react";

const ProgressBar = ({ step, total, completedSteps = [] }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">

        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = completedSteps.includes(index);
          const isActive = index === step;
          const isPastOrActive = index <= step;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300 shadow-md
                    ${isCompleted ? "bg-green-500 text-white scale-105 shadow-green-300" 
                      : isActive ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110 shadow-blue-300"
                      : isPastOrActive ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-500"}
                  `}
                  role="progressbar"
                  aria-valuenow={index + 1}
                  aria-valuemin="1"
                  aria-valuemax={total}
                  aria-label={`Step ${index + 1} of ${total}${isCompleted ? " (completed)" : ""}`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
              </div>

              {/* Line */}
              {index < total - 1 && (
                <div
                  className={`
                    flex-1 h-2 rounded-full transition-all duration-300
                    ${isCompleted ? "bg-green-500"
                      : isPastOrActive ? "bg-blue-400"
                      : "bg-gray-200"}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step display */}
      <div className="text-sm mt-4 text-gray-700 text-center font-medium tracking-wide">
        Step <span className="font-bold">{step + 1}</span> of {total}
      </div>
    </div>
  );
};

export default memo(ProgressBar);
