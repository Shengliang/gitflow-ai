import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async analyzeConflict(sourceCode: string, targetCode: string, conflictMarker: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are a senior software engineer specializing in Git conflict resolution.
        
        Source Branch Code:
        ${sourceCode}
        
        Target Branch Code:
        ${targetCode}
        
        Conflict:
        ${conflictMarker}
        
        Please resolve this conflict. Provide the resolved code and a brief explanation of why you chose this resolution.
        Return the result in JSON format:
        {
          "resolvedCode": "...",
          "explanation": "..."
        }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  },

  async analyzeTestFailure(logs: string, codeSnippet: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are an automated test analysis agent.
        
        Test Logs:
        ${logs}
        
        Related Code:
        ${codeSnippet}
        
        Analyze why the tests failed and suggest a fix.
        Return the result in JSON format:
        {
          "reason": "...",
          "suggestedFix": "...",
          "isFlaky": boolean
        }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  }
};
