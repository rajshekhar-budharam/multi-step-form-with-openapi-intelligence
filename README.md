# React Multi-step Form (Tailwind)

This sample project demonstrates a responsive, accessible multi-step form with:

- Progress bar
- Responsive layout (mobile/tablet/desktop)
- English + Arabic (RTL) basic toggle
- Accessibility-friendly components (labels, roles)
- Local save/load using `localStorage`
- Mock submit
- OpenAI integration helper for suggestions (client-side call) ( Note: Due to some technical/billing issue on openAI integrate groq with /completions api)

Quick start:

1. Install dependencies

```powershell
npm install
```

2. Run dev server

```powershell
npm run dev
```

In the output window you should see similar URL to hit the browser.
Open http://localhost:5174

Environment variable for OpenAI (optional):

- Create '.env' file and your key with following name to openAI API
`VITE_OPENAI_API_KEY=your_key`

Notes:

- The app uses a mock submit (`mockSubmit`) to simulate server submission.
- The OpenAI call is performed from client-side; No real time server is created.
