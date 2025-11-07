
import { GoogleGenAI, Type } from "@google/genai";
import type { Group, Criterion } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const schema = {
  type: Type.OBJECT,
  properties: {
    groups: {
      type: Type.ARRAY,
      description: "A list of creative and tech-themed team names for a hackathon.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the hackathon team."
          }
        },
        required: ["name"]
      }
    },
    criteria: {
      type: Type.ARRAY,
      description: "A list of judging criteria for the hackathon.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the criterion, e.g., 'Innovation' or 'Technical Complexity'."
          },
          maxScore: {
            type: Type.INTEGER,
            description: "The maximum score for this criterion, typically 10 or 20."
          }
        },
        required: ["name", "maxScore"]
      }
    }
  },
  required: ["groups", "criteria"]
};

export const generateSampleData = async (topic: string): Promise<{ groups: Group[], criteria: Criterion[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const prompt = `Generate a list of 10 team names and 5 judging criteria for a hackathon about "${topic}". The criteria should have appropriate maximum scores.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    const generatedGroups = data.groups.map((g: { name: string }) => ({ id: crypto.randomUUID(), name: g.name }));
    const generatedCriteria = data.criteria.map((c: { name: string; maxScore: number }) => ({ id: crypto.randomUUID(), name: c.name, maxScore: c.maxScore }));

    return { groups: generatedGroups, criteria: generatedCriteria };

  } catch (error) {
    console.error("Error generating sample data with Gemini:", error);
    throw new Error("Failed to generate sample data. Please check your API key and connection.");
  }
};
