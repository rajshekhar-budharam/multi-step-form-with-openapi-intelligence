import React, {
  memo,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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

import { mockSubmit } from "../api";
import { t } from "../i18n";
import { ACTIONS, formReducer, initialState } from "../reducers/formReducer";
import StepNavigationButtons from "./StepNavigation";

const STORAGE_KEY = "multiStepFormData_v1";

// Define steps with their components and validation functions
const steps = [
  { component: PersonalInformation, validate: validateStep1 },
  { component: FamilyFinancialInfo, validate: validateStep2 },
  { component: SituationDescription, validate: validateStep3 },
];

const MultiStepForm = ({ lang = "en" }) => {
  const total = steps.length;
  // custom reducer for form state management
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { step, form, showErrors, loading } = state;

  // memoize step component + validator
  const { Current, validate } = useMemo(
    () => ({
      Current: steps[step].component,
      validate: steps[step].validate,
    }),
    [step]
  );

  // Load saved form
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: ACTIONS.LOAD_FORM, payload: JSON.parse(raw) });
      }
    } catch {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Could not load saved form data.",
      });
    }
  }, []);

  // Save form locally
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

  // Validate all steps
  const validateAll = useCallback(() => {
    return steps.reduce(
      (acc, s) => ({ ...acc, ...s.validate(form, lang) }),
      {}
    );
  }, [form, lang]);

  // Get completed steps
  const getCompletedSteps = useCallback(() => {
    return steps
      .map((s, i) =>
        Object.keys(s.validate(form, lang)).length === 0 ? i : null
      )
      .filter((x) => x !== null);
  }, [form, lang]);

  // Check if current step is valid
  const isCurrentStepValid = useCallback(() => {
    return Object.keys(validate(form, lang)).length === 0;
  }, [validate, form, lang]);

  // Check if entire form is valid
  const isFormValid = useCallback(() => {
    return steps.every((s) => Object.keys(s.validate(form, lang)).length === 0);
  }, [form, lang]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    const errs = validate(form, lang);

    // enable showErrors if there are validation errors
    dispatch({
      type: ACTIONS.SET_SHOW_ERRORS,
      payload: !!Object.keys(errs).length,
    });
    // if no errors, go to next step
    if (!Object.keys(errs).length) {
      dispatch({ type: ACTIONS.NEXT_STEP, payload: { total } });
    }
  }, [form, lang, validate, total]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    dispatch({ type: ACTIONS.PREV_STEP });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      const res = await mockSubmit(form, { delay: 800 });
      // on success, clear local storage and show success message
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
  }, [form]);

  // Handle form submission at each step
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const errs = validateAll();
      // enable showErrors if there are validation errors
      dispatch({
        type: ACTIONS.SET_SHOW_ERRORS,
        payload: !!Object.keys(errs).length,
      });

      // if no errors, either go to next step or submit
      if (!Object.keys(errs).length) {
        handleSubmit();
      }
    },
    [validateAll, handleSubmit]
  );

  // Handle form field changes and track all fields in state
  const handleChange = useCallback((v) => {
    dispatch({ type: ACTIONS.UPDATE_FORM, payload: v });
  }, []);

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
          onChange={handleChange}
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
