import React, { useState, useCallback, memo } from "react";
import SuggestionModal from "../SuggestionModal";
import { generateSuggestion } from "../../utils/api";
import { t } from "../../i18n";
import { validateSituationDescription } from "../../utils/validation";

export const validate = (values, lang = "en") => {
  return validateSituationDescription(values, lang);
}

export const SituationDescription = ({
  value,
  onChange,
  lang = "en",
  errors = {},
  showErrors = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleHelp = useCallback(
    async (field) => {
      setActiveField(field);
      setModalOpen(true);
      setSuggestion("");
      setLoading(true);
      setError(null);
      setIsEditing(false);

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        setError("API key not configured");
        setSuggestion(
          "Please configure your OpenAI API key in the .env file (VITE_OPENAI_API_KEY) and restart the dev server."
        );
        setLoading(false);
        return;
      }

      try {
        // Build a summary of Step1 and Step2 values
        const keys = [
          "name",
          "nationalId",
          "dob",
          "gender",
          "address",
          "city",
          "state",
          "country",
          "phone",
          "email",
          "maritalStatus",
          "dependents",
          "employmentStatus",
          "monthlyIncome",
          "housingStatus",
        ];

        const lines = [];
        for (const k of keys) {
          if (
            value[k] !== undefined &&
            value[k] !== null &&
            String(value[k]).trim() !== ""
          ) {
            lines.push(`${k}: ${value[k]}`);
          }
        }

        const applicantData = lines.length
          ? lines.join("\n")
          : "No applicant data provided.";

        const exampleInstruction = `I am unemployed with no income. Help me describe my financial hardship.`;

        const prompt = `Use the applicant data below to write a clear, empathetic, and concise paragraph for the field: "${t(
          lang,
          field
        )}".\n\nApplicant data:\n${applicantData}\n\nCurrent field value:\n${
          value[field] || "(empty)"
        }\n\nInstruction / example for tone and intent:\n"${exampleInstruction}"\n\nPlease create one well-formed paragraph suitable for use in an application to explain circumstances.`;

        const txt = await generateSuggestion(prompt, {
          apiKey,
          timeout: 10000,
        });
        setSuggestion(txt);
      } catch (err) {
        const errorMsg = err.message || "Unknown error";
        setError(errorMsg);
        setSuggestion(
          `Could not generate suggestion. Technical error: ${errorMsg}. Please try again or contact support.`
        );
      } finally {
        setLoading(false);
      }
    },
    [value, lang]
  );

  const acceptSuggestion = useCallback(
    (updatedText) => {
      onChange({ [activeField]: updatedText });
      setModalOpen(false);
    },
    [onChange, activeField]
  );

  const handle = useCallback(
    (field, v) => {
      onChange({ [field]: v });
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    [onChange]
  );

  const showErrorFor = useCallback(
    (field) => {
      return showErrors || !!touched[field];
    },
    [showErrors, touched]
  );

  const handleTouchField = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const fields = [
    "currentFinancialSituation",
    "employmentCircumstances",
    "reasonForApplying",
  ];

  return (
    <section
      aria-labelledby="step3-title"
      className="border border-gray-300 rounded-lg p-6 bg-gray-50"
    >
      <h2 id="step3-title" className="text-xl font-semibold mb-4">
        {t(lang, "step3")}
      </h2>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <label className="flex justify-between items-center">
              <span className="text-xs">{t(lang, field)}</span>
              <button
                type="button"
                onClick={() => handleHelp(field)}
                className="text-sm px-2 py-1 bg-indigo-500 text-white rounded"
              >
                {t(lang, "helpMeWrite")}
              </button>
            </label>
            <textarea
              className="w-full mt-1 px-2 py-1 border rounded"
              rows={5}
              value={value[field]}
              onChange={(e) => handle(field, e.target.value)}
              onBlur={() => handleTouchField(field)}
            />
            {showErrorFor(field) && errors[field] && (
              <div className="text-xs text-red-600">{errors[field]}</div>
            )}
          </div>
        ))}
      </div>

      <SuggestionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setError(null);
        }}
        suggestion={suggestion}
        onSuggestionChange={setSuggestion}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
        onAccept={acceptSuggestion}
        loading={loading}
        error={error}
        lang={lang}
      />
    </section>
  );
}
