import { GROQ_URL, MODEL_LLAMA, SYSTEM_PROMPT_CONTENT } from "../utils/helper/constants";

// Function to generate suggestion using LLM API
export async function generateSuggestion(
  prompt,
  { apiKey, timeout = 8000, model = MODEL_LLAMA } = {}
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT_CONTENT },
          { role: "user", content: prompt },
        ],
        max_tokens: 450,
        temperature: 0.7,
      }),
    });
    clearTimeout(id);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      // If quota exceeded (429) or insufficient_quota, suggest fallback instead of failing.
      try {
        const parsed = JSON.parse(text || "{}");
        const code = parsed?.error?.code;
        const type = parsed?.error?.type;
        if (
          response.status === 429 ||
          code === "insufficient_quota" ||
          type === "insufficient_quota"
        ) {
          // produce a local fallback suggestion based on the prompt
          return localFallbackSuggestion(prompt);
        }
      } catch (e) {
        throw new Error(`OpenAI error (model ${model}): ${response.status} ${text}`);
      }
    }

    const data = await response.json();
    // Extract text from either chat or completion response
    const chatText = data?.choices?.[0]?.message?.content;
    const completionText = data?.choices?.[0]?.text;
    const llmResponse = chatText || completionText || "";
    return llmResponse;
  } catch (err) {
    clearTimeout(id);
    if (err.name === "AbortError") throw new Error("Request timed out");
    throw err;
  }
}

function localFallbackSuggestion(prompt) {
  // Try to extract applicant data and example instruction from the prompt to construct a helpful paragraph.
  try {
    const applicantMatch = prompt.match(
      /Applicant data:\n([\s\S]*?)\n\nCurrent field value:/i
    );
    const exampleMatch = prompt.match(
      /Instruction \/ example for tone and intent:\n"([\s\S]*?)"/i
    );
    const currentMatch = prompt.match(
      /Current field value:\n([\s\S]*?)\n\nInstruction/i
    );

    const applicantRaw = applicantMatch ? applicantMatch[1].trim() : "";
    const exampleInstruction = exampleMatch ? exampleMatch[1].trim() : "";
    const currentField = currentMatch ? currentMatch[1].trim() : "";

    let summary = "";
    if (applicantRaw) {
      // convert lines like "key: value" into short phrases
      const parts = applicantRaw
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const phrases = parts.map((p) => p.replace(/:\s*/, " is "));
      summary = phrases.join(", ");
    }

    const intro =
      exampleInstruction ||
      "I am writing to explain my financial circumstances.";
    const bodyParts = [];
    if (summary) bodyParts.push(`Applicant details: ${summary}.`);
    if (currentField && currentField !== "(empty)")
      bodyParts.push(`Current detail: ${currentField}.`);
    bodyParts.push(intro);

    // A simple empathetic paragraph constructed locally
    const paragraph = `${bodyParts.join(
      " "
    )} I am currently experiencing financial hardship and would appreciate consideration of my application. Please consider this statement as a truthful summary of my situation.`;

    return paragraph;
  } catch (err) {
    return "Unable to generate suggestion locally.";
  }
}

export function mockSubmit(data, { delay = 1000 } = {}) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ ok: true, data }), delay)
  );
}
