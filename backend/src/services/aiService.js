const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  'gemini-3.1-flash-lite-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3-flash-preview',
];

const MAX_CODE_CHARS = 6000; // Truncate large files to save tokens

const FileReviewSchema = z.object({
  file_path: z.string(),
  bug_report: z.array(z.object({
    issue: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    explanation: z.string(),
    line_number: z.number().nullable().optional()
  })),
  improvements: z.array(z.object({
    suggestion: z.string(),
    before_code: z.string(),
    after_code: z.string()
  })),
  quality_score: z.number().min(1).max(10),
  documentation: z.string()
});

const SingleReviewSchema = FileReviewSchema.omit({ file_path: true });
const BatchReviewSchema = z.object({ files: z.array(FileReviewSchema) });

function truncate(code) {
  return code.length > MAX_CODE_CHARS ? code.slice(0, MAX_CODE_CHARS) + '\n// ... truncated' : code;
}

// Single file analysis (paste mode) — 1 API call
async function analyzeSingle(code, language) {
  const prompt = `Review this ${language} code. Return JSON: {"bug_report":[{"issue":"","severity":"low|medium|high|critical","explanation":"","line_number":0}],"improvements":[{"suggestion":"","before_code":"","after_code":""}],"quality_score":7,"documentation":""}
Code:\n${truncate(code)}`;

  return callWithFallback(prompt, raw => SingleReviewSchema.parse(raw));
}

// Batch file analysis (GitHub mode) — 1 API call for ALL files
async function analyzeBatch(files) {
  const fileBlocks = files.map((f, i) => `--- FILE ${i + 1}: ${f.name} (${f.language}) ---\n${truncate(f.content)}`).join('\n\n');

  const prompt = `Review each file below. Return JSON: {"files":[{"file_path":"filename","bug_report":[{"issue":"","severity":"low|medium|high|critical","explanation":"","line_number":0}],"improvements":[{"suggestion":"","before_code":"","after_code":""}],"quality_score":7,"documentation":""}]}
${fileBlocks}`;

  return callWithFallback(prompt, raw => BatchReviewSchema.parse(raw).files);
}

async function callWithFallback(prompt, validate) {
  let lastError = null;
  for (const model of MODELS) {
    try {
      console.log(`Trying: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      const text = typeof response.text === 'function' ? response.text() : response.text;
      const result = validate(JSON.parse(text));
      console.log(`OK: ${model}`);
      return result;
    } catch (err) {
      console.warn(`${model} failed: ${err.message?.slice(0, 100)}`);
      lastError = err;
    }
  }
  throw new Error(`All models failed: ${lastError?.message || 'Unknown'}`);
}

module.exports = { analyzeSingle, analyzeBatch };
