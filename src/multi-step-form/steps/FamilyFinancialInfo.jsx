import React, { useState, useCallback, memo } from "react";
import { t } from "../../i18n";
import { validateFamilyFinancialInfo } from "../../utils/helper/validation";
import {
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  HOUSING_STATUS_OPTIONS,
} from "../../utils/helper/constants";
import Select from "../../components/Select";

export function validate(values, lang = "en") {
  return validateFamilyFinancialInfo(values, lang);
}

export const FamilyFinancialInfo = ({
  value,
  onChange,
  lang = "en",
  errors = {},
  showErrors = false,
}) => {
  const [touched, setTouched] = useState({});

  // Handle field changes and capture touched state
  const handle = useCallback(
    (field, v) => {
      onChange({ [field]: v });
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    [onChange]
  );

  // Determine if to show error for a field
  const showErrorFor = useCallback(
    (field) => {
      return showErrors || touched[field];
    },
    [showErrors, touched]
  );

  // handled textarea touched state
  const handleTouchField = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  return (
    <section
      aria-labelledby="step2-title"
      className="border border-gray-300 rounded-lg p-6 bg-gray-50"
    >
      <h2 id="step2-title" className="text-xl font-semibold mb-4">
        {t(lang, "step2")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          <div className="text-xs">{t(lang, "maritalStatus")}</div>
          <Select
            value={value.maritalStatus}
            onChange={(v) => handle("maritalStatus", v)}
            options={MARITAL_STATUS_OPTIONS}
            lang={lang}
          />
          {showErrorFor("maritalStatus") && errors.maritalStatus && (
            <div className="text-xs text-red-600">{errors.maritalStatus}</div>
          )}
        </label>

        <label>
          <div className="text-xs">{t(lang, "dependents")}</div>
          <input
            type="number"
            min="0"
            className="w-full px-2 py-1 border rounded"
            value={value.dependents}
            onChange={(e) => handle("dependents", e.target.value)}
          />
        </label>

        <label>
          <div className="text-xs">{t(lang, "employmentStatus")}</div>
          <Select
            value={value.employmentStatus}
            onChange={(v) => handle("employmentStatus", v)}
            onBlur={() => handleTouchField("employmentStatus")}
            options={EMPLOYMENT_STATUS_OPTIONS}
            lang={lang}
          />
          {showErrorFor("employmentStatus") && errors.employmentStatus && (
            <div className="text-xs text-red-600">
              {errors.employmentStatus}
            </div>
          )}
        </label>

        <label>
          <div className="text-xs">{t(lang, "monthlyIncome")}</div>
          <input
            type="number"
            min="0"
            className="w-full px-2 py-1 border rounded"
            value={value.monthlyIncome}
            onChange={(e) => handle("monthlyIncome", e.target.value)}
            onBlur={() => handleTouchField("monthlyIncome")}
          />
          {showErrorFor("monthlyIncome") && errors.monthlyIncome && (
            <div className="text-xs text-red-600">{errors.monthlyIncome}</div>
          )}
        </label>

        <label className="col-span-1 md:col-span-2">
          <div className="text-xs">{t(lang, "housingStatus")}</div>
          <Select
            value={value.housingStatus}
            onChange={(v) => handle("housingStatus", v)}
            options={HOUSING_STATUS_OPTIONS}
            lang={lang}
          />
          {showErrorFor("housingStatus") && errors.housingStatus && (
            <div className="text-xs text-red-600">{errors.housingStatus}</div>
          )}
        </label>
      </div>
    </section>
  );
};
