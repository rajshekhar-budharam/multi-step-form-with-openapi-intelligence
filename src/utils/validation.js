import { t } from '../i18n'

export const validatePersonalInformation = (values, lang = 'en') => {
  const errs = {};

  if (!values.name) errs.name = t(lang, 'nameRequired');
  if (!values.nationalId) errs.nationalId = t(lang, 'nationalIdRequired');
  if (!values.dob) errs.dob = t(lang, 'dobRequired');
  if (!values.gender) errs.gender = t(lang, 'genderRequired');
  if (!values.address) errs.address = t(lang, 'addressRequired');
  if (!values.city) errs.city = t(lang, 'cityRequired');
  if (!values.state) errs.state = t(lang, 'stateRequired');
  if (!values.country) errs.country = t(lang, 'countryRequired');

  if (!values.email) errs.email = t(lang, 'emailRequired');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errs.email = t(lang, 'emailInvalid');

  if (!values.phone) errs.phone = t(lang, 'phoneRequired');
  else if (!/^[0-9]+$/.test(values.phone))
    errs.phone = t(lang, 'phoneInvalid');
  else if (values.phone.length < 8)
    errs.phone = t(lang, 'phoneTooShort');

  return errs;
};

export const validateFamilyFinancialInfo = (values, lang = 'en') => {
  const errs = {}
  if (!values.maritalStatus) errs.maritalStatus = t(lang, 'maritalStatusRequired')
  if (!values.employmentStatus) errs.employmentStatus = t(lang, 'employmentStatusRequired')
  if (!values.monthlyIncome) errs.monthlyIncome = t(lang, 'monthlyIncomeRequired')
  if (!values.housingStatus) errs.housingStatus = t(lang, 'housingStatusRequired')
  return errs
}

export const validateSituationDescription = (values, lang = 'en') => {
  const errs = {}
  if (!values.currentFinancialSituation) errs.currentFinancialSituation = t(lang, 'currentFinancialSituationRequired')
  if (!values.employmentCircumstances) errs.employmentCircumstances = t(lang, 'employmentCircumstancesRequired')
  if (!values.reasonForApplying) errs.reasonForApplying = t(lang, 'reasonForApplyingRequired')
  return errs
}

export const validateForStep = (stepIndex, values, lang = 'en') => {
  if (stepIndex === 0) return validatePersonalInformation(values, lang)
  if (stepIndex === 1) return validateFamilyFinancialInfo(values, lang)
  return validateSituationDescription(values, lang)
}
