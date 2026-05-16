export function buildPrompt(content: string) {
  return `
You are an AI assistant helping summarize notes.

Analyze the following note content and return ONLY valid JSON.

Required JSON format:

{
  "summary": "short concise summary",
  "action_items": [
    "action item 1",
    "action item 2"
  ],
  "suggested_title": "better note title"
}

Rules:
- Keep summary concise
- Extract actionable tasks
- Return valid JSON only
- No markdown
- No explanation text

NOTE CONTENT:
${content}
`;
}
