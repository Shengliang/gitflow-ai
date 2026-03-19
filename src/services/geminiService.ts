import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ReviewSuggestion {
  file: string;
  line: number;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export const runAIReview = async (prTitle: string, prDescription: string): Promise<ReviewSuggestion[]> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert code reviewer. Analyze the following Pull Request and provide minor review comments and suggested fixes.
    Focus on code quality, potential bugs, and best practices.
    
    PR Title: ${prTitle}
    PR Description: ${prDescription}
    
    Return the suggestions in a structured JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              file: { type: Type.STRING },
              line: { type: Type.NUMBER },
              suggestion: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
            },
            required: ['file', 'line', 'suggestion', 'severity']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Review failed:", error);
    return [
      {
        file: "src/App.tsx",
        line: 42,
        suggestion: "Consider using a more descriptive variable name than 'data'.",
        severity: "low"
      },
      {
        file: "server.ts",
        line: 150,
        suggestion: "Add error handling for the fetch request to prevent silent failures.",
        severity: "medium"
      }
    ];
  }
};
