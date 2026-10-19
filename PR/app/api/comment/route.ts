import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { codeDiff } = await req.json();

    if (!codeDiff) {
      return NextResponse.json({ error: "No code changes provided." }, { status: 400 });
    }

    const prompt = `You are an elite automated software engineering platform. 
Analyze this git diff and extract issues into categorized arrays. 

CRITICAL RULES FOR METRICS CALCULATION:
1. You must calculate the 'healthScore' mathematically using this exact formula:
   Start at 100.
   Deduct 20 points for each item placed in 'criticalIssues'.
   Deduct 10 points for each item placed in 'performanceIssues'.
   Deduct 5 points for each item placed in 'codeQualityIssues'.
   The minimum possible score is 0. You must double-check your subtraction before outputting the final number.

2. Determine 'riskLevel' strictly based on the final healthScore:
   - Score 80-100: "Low"
   - Score 50-79: "Medium"
   - Score 0-49: "High"

Return a valid JSON object matching this structure exactly. Do not include markdown tags like \`\`\`json or text wrapper words outside the raw JSON.

{
  "healthScore": 0, 
  "riskLevel": "Low | Medium | High",
  "confidence": 95,
  "riskReasons": ["Reason 1"],
  "criticalIssues": ["Issue 1"],
  "performanceIssues": ["Issue 1"],
  "codeQualityIssues": ["Issue 1"],
  "positives": ["Positive 1"],
  "complexityDelta": "+3"
}

Here is the diff:
${codeDiff}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const textOutput = response.text?.trim() || "{}";
    const cleanJsonString = textOutput.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    
    const parsedData = JSON.parse(cleanJsonString);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Structure Parsing Error:", error);
    return NextResponse.json({ error: "Failed to generate clean structured metrics." }, { status: 500 });
  }
}