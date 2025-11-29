import React, { useState, useCallback } from "react";
import SuggestionModal from "../SuggestionModal";
import { generateSuggestion } from "../../utils/api";
import { t } from "../../i18n";
import { validateSituationDescription } from "../../utils/validation";

export const validate = validateSituationDescription;

export const SituationDescription = ({
  value,
  onChange,
  lang = "en",
  errors = {},
  showErrors = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleHelp = async (field) => {
    setActiveField(field);
    setModalOpen(true);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      const applicantKeys = [
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

      const applicantData = applicantKeys
        .filter((k) => value[k])
        .map((k) => `${k}: ${value[k]}`)
        .join("\n");

      const prompt = `
            Write a clear, empathetic paragraph for: ${t(lang, field)}

            Applicant data:
            ${applicantData || "No applicant data provided."}

            Current field value:
            ${value[field] || "(empty)"}

            Instruction:
            "I am unemployed with no income. Help me describe my financial hardship."`;

      const txt = await generateSuggestion(prompt, { apiKey });
      setSuggestion(txt);
    } catch (err) {
      setSuggestion(`Could not generate text. Error: ${err.message}`);
    }

    setLoading(false);
  };

  const acceptSuggestion = (text) => {
    onChange({ [activeField]: text });
    setModalOpen(false);
  };

  const fields = [
    "currentFinancialSituation",
    "employmentCircumstances",
    "reasonForApplying",
  ];

  return (
    <section className="border border-gray-300 rounded-xl p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">{t(lang, "step3")}</h2>

      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field}>
            <label className="flex justify-between items-center">
              <span className="text-xs">{t(lang, field)}</span>

              <button
                type="button"
                onClick={() => handleHelp(field)}
                className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              >
                <span className="flex items-center justify-center w-5 h-5 bg-white text-indigo-600 font-bold rounded-full text-xs">
                  ?
                </span>
                {t(lang, "helpMeWrite")}
              </button>
            </label>

            <textarea
              className="mt-1 w-full px-3 py-2 border rounded"
              rows={5}
              value={value[field]}
              onChange={(e) => onChange({ [field]: e.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, [field]: true }))}
            />

            {(showErrors || touched[field]) && errors[field] && (
              <div className="text-xs text-red-600">{errors[field]}</div>
            )}
          </div>
        ))}
      </div>

      <SuggestionModal
        open={modalOpen}
        initialValue={loading ? "Generating..." : suggestion}
        onClose={() => setModalOpen(false)}
        onAccept={acceptSuggestion}
        lang={lang}
      />
    </section>
  );
};
