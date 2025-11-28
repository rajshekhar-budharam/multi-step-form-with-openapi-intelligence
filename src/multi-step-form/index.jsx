import React, { memo, useState, useEffect, useCallback } from "react";
import ProgressBar from "../components/ProgressBar";
import { PersonalInformation,
  validate as validateStep1,
} from "./steps/PersonalInformation";
import { FamilyFinancialInfo, 
  validate as validateStep2,
} from "./steps/FamilyFinancialInfo";
import { SituationDescription, 
  validate as validateStep3,
} from "./steps/SituationDescription";
import { mockSubmit } from "../utils/api";
import { t } from "../i18n";

const STORAGE_KEY = "multiStepFormData_v1";

const MultiStepForm = ({ lang = "en" }) => {
  const total = 3;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    // step1
    name: "",
    nationalId: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
    // step2
    maritalStatus: "",
    dependents: "",
    employmentStatus: "",
    monthlyIncome: "",
    housingStatus: "",
    // step3
    currentFinancialSituation: "",
    employmentCircumstances: "",
    reasonForApplying: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm(JSON.parse(raw));
    } catch (e) {
      setError("Could not load saved form data. Starting fresh.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setError(null);
    } catch (e) {
      setError("Could not save form data locally.");
    }
  }, [form]);

  const update = useCallback((patch) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  const validateCurrent = useCallback(() => {
    if (step === 0) return validateStep1(form, lang);
    if (step === 1) return validateStep2(form, lang);
    return validateStep3(form, lang);
  }, [step, form, lang]);

  const getCompletedSteps = useCallback(() => {
    const completed = [];
    if (Object.keys(validateStep1(form, lang)).length === 0) completed.push(0);
    if (Object.keys(validateStep2(form, lang)).length === 0) completed.push(1);
    if (Object.keys(validateStep3(form, lang)).length === 0) completed.push(2);
    return completed;
  }, [form, lang]);

  const isCurrentStepValid = useCallback(() => {
    return Object.keys(validateCurrent()).length === 0;
  }, [validateCurrent]);

  const isFormValid = useCallback(() => {
    const errs1 = validateStep1(form, lang);
    const errs2 = validateStep2(form, lang);
    const errs3 = validateStep3(form, lang);
    return (
      Object.keys(errs1).length === 0 &&
      Object.keys(errs2).length === 0 &&
      Object.keys(errs3).length === 0
    );
  }, [form, lang]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockSubmit(form, { delay: 800 });
      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        alert("Submitted successfully (mock)");
      }
    } catch (err) {
      setError("Submit failed: " + err.message);
      alert("Submit failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [form]);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (step === total - 1) {
        setShowErrors(true);
        const errs = {
          ...validateStep1(form, lang),
          ...validateStep2(form, lang),
          ...validateStep3(form, lang),
        };
        if (Object.keys(errs).length === 0) handleSubmit();
      } else {
        const errs = validateCurrent();
        if (Object.keys(errs).length === 0) {
          setShowErrors(false);
          setStep((s) => Math.min(total - 1, s + 1));
        } else {
          setShowErrors(true);
        }
      }
    },
    [step, total, form, validateCurrent, handleSubmit, lang]
  );

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handleNext = useCallback(() => {
    const errs = validateCurrent();
    if (Object.keys(errs).length === 0) {
      setShowErrors(false);
      setStep((s) => s + 1);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      } catch (e) {
        /* ignore localStorage save failures on next */
      }
    } else {
      setShowErrors(true);
    }
  }, [validateCurrent, form]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
          <button
            onClick={handleDismissError}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="mb-4">
        <ProgressBar
          step={step}
          total={total}
          completedSteps={getCompletedSteps()}
        />
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          {step === 0 && (
            <PersonalInformation
              lang={lang}
              value={form}
              onChange={update}
              errors={validateStep1(form, lang)}
              showErrors={showErrors}
            />
          )}
          {step === 1 && (
            <FamilyFinancialInfo
              lang={lang}
              value={form}
              onChange={update}
              errors={validateStep2(form, lang)}
              showErrors={showErrors}
            />
          )}
          {step === 2 && (
            <SituationDescription
              lang={lang}
              value={form}
              onChange={update}
              errors={validateStep3(form, lang)}
              showErrors={showErrors}
            />
          )}
        </div>

        <div className="flex gap-2 justify-between">
          <div>
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              {t(lang, "back")}
            </button>
          </div>
          <div className="flex gap-2">
            {step < total - 1 ? (
              <button
                type="button"
                onClick={handleNext}
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
        </div>
      </form>
    </div>
  );
};

export default memo(MultiStepForm);