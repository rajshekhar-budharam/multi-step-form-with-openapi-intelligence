import React, { memo } from "react";
import { t } from "../i18n";

const Select = ({
  label,
  value,
  onChange,
  onBlur,
  options = [],
  lang = "en",
  className = "",
}) => {
  return (
    <label>
      <div className="text-xs">{t(lang, label)}</div>
      <select
        className={`w-full px-2 py-1 border rounded ${className}`}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onBlur={onBlur}
      >
        <option value="">{t(lang, "select")}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.labelKey ? t(lang, opt.labelKey) : opt.label || opt.value}
          </option>
        ))}
      </select>
    </label>
  );
};

export default memo(Select);
