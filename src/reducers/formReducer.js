// Initial state
export const initialState = {
  step: 0,
  loading: false,
  showErrors: false,
  error: null,
  form: {
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
  },
};

// Action types
export const ACTIONS = {
  UPDATE_FORM: "UPDATE_FORM",
  SET_STEP: "SET_STEP",
  NEXT_STEP: "NEXT_STEP",
  PREV_STEP: "PREV_STEP",
  SET_LOADING: "SET_LOADING",
  SET_SHOW_ERRORS: "SET_SHOW_ERRORS",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  LOAD_FORM: "LOAD_FORM",
  RESET_FORM: "RESET_FORM",
};

// Reducer function for multi-step form state management
export const formReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_FORM:
      return {
        ...state,
        form: { ...state.form, ...action.payload },
      };
    case ACTIONS.SET_STEP:
      return { ...state, step: action.payload };
    case ACTIONS.NEXT_STEP:
      return { ...state, step: Math.min(action.payload.total - 1, state.step + 1) };
    case ACTIONS.PREV_STEP:
      return { ...state, step: Math.max(0, state.step - 1) };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_SHOW_ERRORS:
      return { ...state, showErrors: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTIONS.LOAD_FORM:
      return { ...state, form: action.payload };
    case ACTIONS.RESET_FORM:
      return { ...state, form: initialState.form };
    default:
      return state;
  }
};
