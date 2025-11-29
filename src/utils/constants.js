export const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
export const MODEL_GPT_TURBO = 'gpt-3.5-turbo'

export const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
export const MODEL_LLAMA = 'llama-3.1-8b-instant'
export const SYSTEM_PROMPT_CONTENT = 'You are a helpful, empathetic assistant that writes concise paragraphs for applications or forms.';

// Select options for form fields
export const GENDER_OPTIONS = [
  { value: 'male', labelKey: 'male' },
  { value: 'female', labelKey: 'female' },
  { value: 'other', labelKey: 'other' }
]

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', labelKey: 'single' },
  { value: 'married', labelKey: 'married' },
  { value: 'divorced', labelKey: 'divorced' },
  { value: 'widowed', labelKey: 'widowed' }
]

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'employed', labelKey: 'employed' },
  { value: 'self-employed', labelKey: 'selfEmployed' },
  { value: 'unemployed', labelKey: 'unemployed' },
  { value: 'student', labelKey: 'student' }
]

export const HOUSING_STATUS_OPTIONS = [
  { value: 'rent', labelKey: 'rent' },
  { value: 'own', labelKey: 'own' },
  { value: 'living-with-family', labelKey: 'livingWithFamily' }
]