import React, { useState, useCallback, memo } from "react";
import { t } from "../../i18n";
import { validatePersonalInformation } from "../../utils/helper/validation";
import { GENDER_OPTIONS } from "../../utils/helper/constants";
import Select from "../../components/Select";
import FormField from "../../components/FormField";

export function validate(values, lang = "en") {
  return validatePersonalInformation(values, lang);
}

export const PersonalInformation = memo(
  ({ value, onChange, lang = "en", errors = {}, showErrors = false }) => {
    const [touched, setTouched] = useState({});

    const handle = useCallback(
      (field, v) => {
        onChange({ [field]: v });
        setTouched((prev) => ({ ...prev, [field]: true }));
      },
      [onChange]
    );

    const handleBlur = useCallback((field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }, []);

    const showErrorFor = useCallback(
      (field) => showErrors || touched[field],
      [showErrors, touched]
    );

    return (
      <section className="border border-gray-300 rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">{t(lang, "step1")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "nationalId", "address", "city", "state", "country"].map(
            (field) => (
              <FormField
                key={field}
                field={field}
                label={t(lang, field)}
                value={value[field]}
                onChange={handle}
                onBlur={handleBlur}
                error={errors[field]}
                showError={showErrorFor(field)}
              />
            )
          )}

          <FormField
            field="phone"
            type="tel"
            label={t(lang, "phone")}
            value={value.phone}
            onKeyDown={(e) => {
              const allowed = [
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
              ];
              if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                e.preventDefault();
              }
              onChange({ phone: e.target.value });
              setTouched((prev) => ({ ...prev, phone: true }));
            }}
            onChange={handle}
            onBlur={handleBlur}
            error={errors.phone}
            showError={showErrorFor("phone")}
          />

          {/* Date field */}
          <FormField
            field="dob"
            type="date"
            label={t(lang, "dob")}
            value={value.dob}
            onChange={handle}
            onBlur={handleBlur}
            error={errors.dob}
            showError={showErrorFor("dob")}
          />

          {/* Email */}
          <FormField
            field="email"
            type="email"
            label={t(lang, "email")}
            value={value.email}
            onChange={handle}
            onBlur={handleBlur}
            error={errors.email}
            showError={showErrorFor("email")}
          />

          {/* Gender select */}
          <FormField
            field="gender"
            label={t(lang, "gender")}
            error={errors.gender}
            showError={showErrorFor("gender")}
            onChange={handle}
            onBlur={handleBlur}
          >
            <Select
              value={value.gender}
              onChange={(v) => handle("gender", v)}
              options={GENDER_OPTIONS}
              lang={lang}
            />
          </FormField>
        </div>
      </section>
    );
  }
);
