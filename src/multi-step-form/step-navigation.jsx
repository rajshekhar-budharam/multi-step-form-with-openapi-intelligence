import React, { memo } from "react";
import { t } from "../i18n";

const StepNavigationButtons = ({
  prevStep,
  nextStep,
  loading,
  isCurrentStepValid,
  lang = "en",
  total,
  step,
  isFormValid,
}) => {
  return (
    <div className="flex justify-between gap-2 my-2">
      <button
        type="button"
        onClick={prevStep}
        disabled={step === 0}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        {t(lang, "back")}
      </button>

      {step < total - 1 ? (
        <button
          type="button"
          onClick={nextStep}
          disabled={!isCurrentStepValid()}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          {t(lang, "next")}
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? t(lang, "submit") + "..." : t(lang, "submit")}
        </button>
      )}
    </div>
  );
};

export default memo(StepNavigationButtons);
