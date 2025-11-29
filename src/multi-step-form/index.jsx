import React, { memo, useReducer, useEffect, useCallback } from "react";
import ProgressBar from "../components/ProgressBar";
import {
  PersonalInformation,
  validate as validateStep1,
} from "./steps/PersonalInformation";
import {
  FamilyFinancialInfo,
  validate as validateStep2,
} from "./steps/FamilyFinancialInfo";
import {
  SituationDescription,
  validate as validateStep3,
} from "./steps/SituationDescription";

import { mockSubmit } from "../utils/api";
import { t } from "../i18n";
import { ACTIONS, formReducer, initialState } from "../reducers/formReducer";
import StepNavigationButtons from "./step-navigation";

const STORAGE_KEY = "multiStepFormData_v1";
const steps = [
  { component: PersonalInformation, validate: validateStep1 },
  { component: FamilyFinancialInfo, validate: validateStep2 },
  { component: SituationDescription, validate: validateStep3 },
];

const MultiStepForm = ({ lang = "en" }) => {
  const total = steps.length;
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { step, form, showErrors, loading } = state;

  const Current = steps[step].component;
  const validate = steps[step].validate;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      raw && dispatch({ type: ACTIONS.LOAD_FORM, payload: JSON.parse(raw) });
    } catch {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Could not load saved form data.",
      });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Could not save form data locally.",
      });
    }
  }, [form]);

  const validateAll = () =>
    steps.reduce((acc, s) => ({ ...acc, ...s.validate(form, lang) }), {});

  const getCompletedSteps = () =>
    steps
      .map((s, i) =>
        Object.keys(s.validate(form, lang)).length === 0 ? i : null
      )
      .filter((x) => x !== null);

  const isCurrentStepValid = () =>
    Object.keys(validate(form, lang)).length === 0;

  const isFormValid = () =>
    steps.every((s) => Object.keys(s.validate(form, lang)).length === 0);

  const nextStep = () => {
    const errs = validate(form, lang);
    dispatch({
      type: ACTIONS.SET_SHOW_ERRORS,
      payload: !!Object.keys(errs).length,
    });

    if (!Object.keys(errs).length)
      dispatch({ type: ACTIONS.NEXT_STEP, payload: { total } });
  };

  const prevStep = () => dispatch({ type: ACTIONS.PREV_STEP });

  const handleSubmit = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await mockSubmit(form, { delay: 800 });
      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        alert("Submitted successfully (mock)");
      }
    } catch (err) {
      const msg = "Submit failed: " + err.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: msg });
      alert(msg);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validateAll();

    dispatch({
      type: ACTIONS.SET_SHOW_ERRORS,
      payload: !!Object.keys(errs).length,
    });

    if (!Object.keys(errs).length) handleSubmit();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ProgressBar
        step={step}
        total={total}
        completedSteps={getCompletedSteps()}
      />

      <form onSubmit={onSubmit}>
        <Current
          lang={lang}
          value={form}
          onChange={(v) => dispatch({ type: ACTIONS.UPDATE_FORM, payload: v })}
          errors={validate(form, lang)}
          showErrors={showErrors}
        />

        <StepNavigationButtons
          prevStep={prevStep}
          nextStep={nextStep}
          loading={loading}
          isCurrentStepValid={isCurrentStepValid}
          lang={lang}
          total={total}
          step={step}
          isFormValid={isFormValid}
        />

      </form>
    </div>
  );
};

export default memo(MultiStepForm);
