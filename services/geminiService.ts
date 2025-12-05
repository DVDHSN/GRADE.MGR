import { GoogleGenAI, Type } from "@google/genai";
import { Grade } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAcademicInsights = async (grades: Grade[]): Promise<string> => {
  if (grades.length === 0) {
    return "No grades available for analysis. Please add some grades first.";
  }

  const prompt = `
    Analyze the following student grades and provide a brutal, honest, yet constructive summary.
    Identify trends, weak spots, and specific study advice.
    
    Data:
    ${JSON.stringify(grades, null, 2)}
    
    Format the response in Markdown with bold headers.
    Keep it concise (under 200 words).
    Use a motivating but slightly strict tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a strict but effective academic coach using a brutalist design philosophy in your speech patterns (direct, efficient, bold).",
        temperature: 0.7,
      }
    });

    return response.text || "Could not generate insights.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating insights. Please try again later.";
  }
};
